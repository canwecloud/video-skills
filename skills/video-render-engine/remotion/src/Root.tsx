import React from 'react';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {Video} from './Video';
import type {Spec} from './types';

type Props = {spec: Spec};

const DEMO: Spec = {
  theme: 'ocean',
  brand: 'DEMO · मराठी',
  duration: 8,
  sfx: false,
  captions: [{start: 0.3, end: 3.8, text: 'हे आहे 3D explanation चं demo'}],
  scenes: [
    {start: 0, type: 'hook', title: 'तुमचा *phone* सुरक्षित आहे?', model: 'shield'},
    {start: 4, type: 'explain3d', title: 'Private *Vault*', model: 'lock', items: [{text: 'Photos', at: 5}, {text: 'Documents', at: 5.6}]},
  ],
};

const metadata: CalculateMetadataFunction<Props> = async ({props}) => {
  const fps = props.spec.fps ?? 30;
  let seconds = props.spec.duration;
  if (!seconds && props.spec.voiceover) seconds = (await getAudioDurationInSeconds(staticFile(`job/${props.spec.voiceover}`))) + 0.4;
  return {fps, durationInFrames: Math.ceil((seconds ?? 10) * fps)};
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Short" component={({spec}: Props) => <Video spec={spec} />} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{spec: DEMO}} calculateMetadata={metadata} />
    <Composition id="Long" component={({spec}: Props) => <Video spec={spec} />} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{spec: DEMO}} calculateMetadata={metadata} />
  </>
);
