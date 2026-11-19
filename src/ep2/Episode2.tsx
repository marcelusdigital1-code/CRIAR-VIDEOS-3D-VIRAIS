// Episode 2 — Short (9:16) composition
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Stage } from "../engine/Stage";
import { Captions } from "../engine/Captions";
import { SHOTS } from "./shots";
import timing from "../../episodes/ep2/timing.json";

export const TAIL = 0.7;
export const totalFrames2 = (fps: number) => Math.ceil((timing.total + TAIL) * fps);

export const shotSpans2 = (fps: number) =>
  timing.shots.map((s: { id: number; start: number }, i: number) => {
    const a = i === 0 ? 0 : Math.round(s.start * fps);
    const b = i + 1 < timing.shots.length ? Math.round((timing.shots[i + 1] as { start: number }).start * fps) : totalFrames2(fps);
    return { id: s.id, from: a, dur: b - a };
  });

export const ShotView2: React.FC<{ id: number; dur: number }> = ({ id, dur }) => {
  const S = SHOTS[id];
  return (
    <Stage look={S.look} cam={S.cam} dur={dur} focus={S.focus}>
      <S.Body dur={dur} />
    </Stage>
  );
};

export const Episode2: React.FC<{ captions?: boolean; music?: boolean }> = ({ captions = true, music = true }) => {
  const { fps } = useVideoConfig();
  const words = timing.shots.flatMap((s: { words: unknown[] }) => s.words);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {shotSpans2(fps).map((s: { id: number; from: number; dur: number }) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={"shot " + s.id}>
          <ShotView2 id={s.id} dur={s.dur} />
        </Sequence>
      ))}
      {captions ? <Captions words={words as never} /> : null}
      <Audio src={staticFile(music ? "ep2/mix.wav" : "ep2/voice.wav")} />
    </AbsoluteFill>
  );
};

export const ShotStill2: React.FC<{ id?: number | string }> = ({ id = 1 }) => {
  const { fps } = useVideoConfig();
  const nid = Number(id) || 1;
  const s = shotSpans2(fps).find((x: { id: number }) => x.id === nid) ?? shotSpans2(fps)[0];
  return <ShotView2 id={nid} dur={s?.dur ?? 90} />;
};
