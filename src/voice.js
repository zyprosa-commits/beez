import clips from "./voice-manifest.json";
import { setPipSpeech, setPipLevel } from "./pip.js";
export let pipVoicePlayer = null;
let context,
  source,
  frame,
  serial = 0,
  settle;
const key = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, "");
export function stopPipVoice() {
  serial++;
  cancelAnimationFrame(frame);
  if (pipVoicePlayer) {
    pipVoicePlayer.onplaying = null;
    pipVoicePlayer.onended = null;
    pipVoicePlayer.onpause = null;
    pipVoicePlayer.onerror = null;
    pipVoicePlayer.pause();
    pipVoicePlayer.removeAttribute("src");
    pipVoicePlayer.load();
  }
  source?.disconnect();
  settle?.(false);
  settle = null;
  setPipSpeech(false);
  setPipLevel(0);
}
export function playPipVoice(text) {
  stopPipVoice();
  const src = clips[key(text)];
  if (!src) return Promise.resolve(false);
  const id = serial;
  const player = new Audio(src);
  pipVoicePlayer = player;
  player.volume = 0.85;
  return new Promise((resolve) => {
    settle = resolve;
    const finish = (ok = true) => {
      if (id !== serial) return;
      cancelAnimationFrame(frame);
      setPipSpeech(false);
      setPipLevel(0);
      settle = null;
      resolve(ok);
    };
    player.onplaying = () => {
      if (id !== serial) return;
      setPipSpeech(true, text);
    };
    player.onended = () => finish(true);
    player.onerror = () => finish(false);
    player.onpause = () => finish(false);
    try {
      context ||= new (window.AudioContext || window.webkitAudioContext)();
      source = context.createMediaElementSource(player);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(context.destination);
      context.resume().catch(() => {});
      const data = new Uint8Array(analyser.fftSize);
      function meter() {
        if (id !== serial) return;
        analyser.getByteTimeDomainData(data);
        setPipLevel(
          Math.min(
            1,
            Math.sqrt(
              data.reduce((s, v) => s + ((v - 128) / 128) ** 2, 0) /
                data.length,
            ) * 6,
          ),
        );
        frame = requestAnimationFrame(meter);
      }
      meter();
    } catch {
      setPipLevel(0.2);
    }
    player.play().catch(() => finish(false));
  });
}
