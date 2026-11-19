import React from "react";
import { Composition } from "remotion";
import { Episode, ShotStill, totalFrames } from "./ep1/Episode";
import { LongEpisode, longFrames } from "./ep1/Long";
import { Episode2, ShotStill2, totalFrames2 } from "./ep2/Episode2";

export const Root: React.FC = () => (
  <>
    {/* Episode 1 — London cabmen's shelters */}
    <Composition id="Short" component={Episode} width={1080} height={1920} fps={30} durationInFrames={totalFrames(30)} defaultProps={{ captions: true, music: true }} />
    <Composition id="Long" component={LongEpisode} width={1920} height={1080} fps={30} durationInFrames={longFrames(30)} />
    <Composition id="Short16x9" component={Episode} width={1920} height={1080} fps={30} durationInFrames={totalFrames(30)} defaultProps={{ captions: false, music: true }} />
    <Composition id="Shot" component={ShotStill} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    {/* Episode 2 — The White Gold (salt) */}
    <Composition id="Short2" component={Episode2} width={1080} height={1920} fps={30} durationInFrames={totalFrames2(30)} defaultProps={{ captions: true, music: true }} />
    <Composition id="Long2" component={Episode2} width={1920} height={1080} fps={30} durationInFrames={totalFrames2(30)} defaultProps={{ captions: true, music: true }} />
    <Composition id="Shot2" component={ShotStill2} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
  </>
);
