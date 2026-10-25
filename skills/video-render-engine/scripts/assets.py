#!/usr/bin/env python3
"""Asset fetcher for the video render engine.

Every source here is license-safe for monetized YouTube/Instagram video:
  emoji     Microsoft Fluent 3D emoji — transparent PNG, MIT
  icon      Iconify (200k+ icons, brand logos) — SVG, per-set open licenses
  unsplash  Unsplash photos (Unsplash License) — needs UNSPLASH_ACCESS_KEY
  cutout    local background removal (rembg / U2-Net) → transparent PNG
  picsart   Picsart remove-bg API → transparent PNG — needs PICSART_API_KEY
  music     curated Kevin MacLeod / incompetech tracks — CC-BY 4.0 (credit line printed)
  trends    Google Trends daily trending searches (India by default)
  keywords  YouTube/Google autocomplete keyword expansion for a seed topic
  instagram top hashtags co-occurring with a seed hashtag — needs IG_USER_ID + IG_ACCESS_TOKEN
            (Instagram Graph API, business/creator account)

Usage: assets.py <command> [args] --out DIR
"""
import argparse, json, os, re, sys, urllib.parse, urllib.request, xml.etree.ElementTree as ET
from pathlib import Path

UA = {"User-Agent": "video-skills/1.0"}
HERE = Path(__file__).resolve().parent


def http(url, data=None, headers=None, timeout=60):
    req = urllib.request.Request(url, data=data, headers={**UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def jget(url, headers=None):
    return json.loads(http(url, headers=headers))


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def save(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    print(path)
    return path


# ── transparent images ────────────────────────────────────────────────────────

def emoji(name, out):
    """Fluent 3D emoji by Iconify-style name, e.g. 'mobile-phone', 'rocket', 'locked'."""
    names = [name]
    if not re.fullmatch(r"[a-z0-9-]+", name):
        hits = jget(f"https://api.iconify.design/search?query={urllib.parse.quote(name)}&prefix=fluent-emoji&limit=5")
        names = [h.split(":")[1] for h in hits.get("icons", [])] or names
    for n in names:
        folder = n.replace("-", " ").capitalize()
        url = ("https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/"
               f"{urllib.parse.quote(folder)}/3D/{n.replace('-', '_')}_3d.png")
        try:
            return save(Path(out) / f"emoji-{n}.png", http(url))
        except Exception:
            # Some folders differ from the Iconify name; fall back to the vector color version.
            try:
                return save(Path(out) / f"emoji-{n}.svg", http(f"https://api.iconify.design/fluent-emoji/{n}.svg?height=512"))
            except Exception:
                continue
    sys.exit(f"emoji not found: {name} (try: assets.py search-emoji {name})")


def search_emoji(query, out=None):
    hits = jget(f"https://api.iconify.design/search?query={urllib.parse.quote(query)}&prefix=fluent-emoji&limit=20")
    print("\n".join(h.split(":")[1] for h in hits.get("icons", [])))


def icon(name, out, color=None, size=512):
    """Iconify id 'prefix:name' (e.g. 'logos:android-icon', 'mdi:download', 'simple-icons:whatsapp').
    A bare word searches all sets and takes the first hit."""
    if ":" not in name:
        hits = jget(f"https://api.iconify.design/search?query={urllib.parse.quote(name)}&limit=10").get("icons", [])
        if not hits:
            sys.exit(f"icon not found: {name}")
        print("candidates:", ", ".join(hits), file=sys.stderr)
        name = hits[0]
    prefix, n = name.split(":", 1)
    q = f"?height={size}" + (f"&color={urllib.parse.quote(color)}" if color else "")
    return save(Path(out) / f"icon-{prefix}-{n}.svg", http(f"https://api.iconify.design/{prefix}/{n}.svg{q}"))


def unsplash(query, out, n=3, orientation="portrait", do_cutout=False):
    key = os.environ.get("UNSPLASH_ACCESS_KEY")
    if not key:
        sys.exit("UNSPLASH_ACCESS_KEY not set — get a free key at https://unsplash.com/developers")
    h = {"Authorization": f"Client-ID {key}", "Accept-Version": "v1"}
    res = jget(f"https://api.unsplash.com/search/photos?query={urllib.parse.quote(query)}"
               f"&per_page={n}&orientation={orientation}&content_filter=high", h)
    credits = []
    for i, p in enumerate(res.get("results", [])):
        http(p["links"]["download_location"], headers=h)  # required by Unsplash API guidelines
        path = save(Path(out) / f"unsplash-{slug(query)}-{i+1}.jpg", http(p["urls"]["regular"]))
        credits.append(f"Photo by {p['user']['name']} on Unsplash ({p['links']['html']})")
        if do_cutout:
            cutout(path, out)
    if credits:
        save(Path(out) / f"unsplash-{slug(query)}-credits.txt", "\n".join(credits).encode())


def cutout(src, out, model="u2net"):
    """Remove background locally → transparent PNG (rembg, U2-Net)."""
    from rembg import new_session, remove
    data = remove(Path(src).read_bytes(), session=new_session(model), post_process_mask=True)
    return save(Path(out) / f"{Path(src).stem}-cutout.png", data)


def picsart(src, out):
    key = os.environ.get("PICSART_API_KEY")
    if not key:
        sys.exit("PICSART_API_KEY not set — get one at https://picsart.io/ (or use: assets.py cutout)")
    import uuid
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"output_type\"\r\n\r\ncutout\r\n"
            f"--{b}\r\nContent-Disposition: form-data; name=\"format\"\r\n\r\nPNG\r\n"
            f"--{b}\r\nContent-Disposition: form-data; name=\"image\"; filename=\"{Path(src).name}\"\r\n"
            "Content-Type: application/octet-stream\r\n\r\n").encode() + Path(src).read_bytes() + f"\r\n--{b}--\r\n".encode()
    res = json.loads(http("https://api.picsart.io/tools/1.0/removebg", body,
                          {"X-Picsart-API-Key": key, "Content-Type": f"multipart/form-data; boundary={b}"}))
    return save(Path(out) / f"{Path(src).stem}-picsart.png", http(res["data"]["url"]))


# ── music ─────────────────────────────────────────────────────────────────────

def music(mood, out, pick=0):
    cat = json.loads((HERE.parent / "assets" / "music-catalog.json").read_text())
    tracks = [t for t in cat["tracks"] if mood in t["moods"]] or cat["tracks"]
    if mood == "list":
        for t in cat["tracks"]:
            print(f"{t['title']:<28} {', '.join(t['moods'])}")
        return
    t = tracks[pick % len(tracks)]
    url = "https://incompetech.com/music/royalty-free/mp3-royaltyfree/" + urllib.parse.quote(t["title"]) + ".mp3"
    path = save(Path(out) / f"music-{slug(t['title'])}.mp3", http(url, timeout=120))
    credit = (f'"{t["title"]}" Kevin MacLeod (incompetech.com)\n'
              "Licensed under Creative Commons: By Attribution 4.0 License\n"
              "http://creativecommons.org/licenses/by/4.0/")
    save(path.with_suffix(".credit.txt"), credit.encode())
    print("\nPUT THIS IN THE VIDEO DESCRIPTION:\n" + credit)


# ── trends & keywords ─────────────────────────────────────────────────────────

def trends(geo="IN", out=None):
    root = ET.fromstring(http(f"https://trends.google.com/trending/rss?geo={geo}"))
    ns = {"ht": "https://trends.google.com/trending/rss"}
    rows = []
    for it in root.iter("item"):
        rows.append({"query": it.findtext("title"),
                     "traffic": it.findtext("ht:approx_traffic", namespaces=ns),
                     "news": [n.findtext("ht:news_item_title", namespaces=ns) for n in it.findall("ht:news_item", ns)][:2]})
    print(json.dumps(rows, ensure_ascii=False, indent=1))


def keywords(seed, out=None, lang="mr", yt=True):
    """Expand a seed with autocomplete: seed, seed + a..z, and question prefixes."""
    ds = "&ds=yt" if yt else ""
    seen = {}
    prefixes = ["", "how to ", "best ", "कसे ", "कैसे "]
    suffixes = [""] + [f" {c}" for c in "abcdefghijklmnoprstuvwy"]
    for p in prefixes:
        for s in suffixes if p == "" else [""]:
            q = urllib.parse.quote(p + seed + s)
            try:
                res = json.loads(http(f"https://suggestqueries.google.com/complete/search?client=firefox{ds}&hl={lang}&gl=IN&q={q}").decode("utf-8", "ignore"))
            except Exception:
                continue
            for k in res[1]:
                seen[k] = seen.get(k, 0) + 1
    for k, _ in sorted(seen.items(), key=lambda kv: -kv[1]):
        print(k)


def instagram(tag, out=None):
    uid, tok = os.environ.get("IG_USER_ID"), os.environ.get("IG_ACCESS_TOKEN")
    if not (uid and tok):
        sys.exit("Set IG_USER_ID and IG_ACCESS_TOKEN (Instagram Graph API, business/creator account; "
                 "permission instagram_basic). Without them use: assets.py keywords / trends")
    g = "https://graph.facebook.com/v21.0"
    hid = jget(f"{g}/ig_hashtag_search?user_id={uid}&q={urllib.parse.quote(tag)}&access_token={tok}")["data"][0]["id"]
    counts = {}
    for edge in ("top_media", "recent_media"):
        media = jget(f"{g}/{hid}/{edge}?user_id={uid}&fields=caption,like_count,comments_count,media_type,permalink&limit=50&access_token={tok}")
        for m in media.get("data", []):
            w = 1 + (m.get("like_count") or 0) / 1000
            for h in re.findall(r"#(\w+)", m.get("caption") or ""):
                counts[h.lower()] = counts.get(h.lower(), 0) + w
    for h, s in sorted(counts.items(), key=lambda kv: -kv[1])[:40]:
        print(f"#{h}\t{s:.1f}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cmd", choices=["emoji", "search-emoji", "icon", "unsplash", "cutout", "picsart",
                                    "music", "trends", "keywords", "instagram"])
    ap.add_argument("arg", nargs="?", default="")
    ap.add_argument("--out", default="assets")
    ap.add_argument("--color")
    ap.add_argument("--n", type=int, default=3)
    ap.add_argument("--cutout", action="store_true")
    ap.add_argument("--orientation", default="portrait")
    ap.add_argument("--lang", default="mr")
    ap.add_argument("--geo", default="IN")
    ap.add_argument("--pick", type=int, default=0, help="music: Nth track for the mood")
    a = ap.parse_args()
    if a.cmd == "emoji": emoji(a.arg, a.out)
    elif a.cmd == "search-emoji": search_emoji(a.arg)
    elif a.cmd == "icon": icon(a.arg, a.out, a.color)
    elif a.cmd == "unsplash": unsplash(a.arg, a.out, a.n, a.orientation, a.cutout)
    elif a.cmd == "cutout": cutout(a.arg, a.out)
    elif a.cmd == "picsart": picsart(a.arg, a.out)
    elif a.cmd == "music": music(a.arg or "upbeat", a.out, a.pick)
    elif a.cmd == "trends": trends(a.geo)
    elif a.cmd == "keywords": keywords(a.arg, lang=a.lang)
    elif a.cmd == "instagram": instagram(a.arg.lstrip("#"))
