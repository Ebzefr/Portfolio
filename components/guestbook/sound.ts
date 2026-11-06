/* A tiny plastic "clack" made with Web Audio, so there's no sound file to download.
   Created only after the visitor turns sound on (browsers need a click first). */
export function createThud() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return () => {};
  const ctx = new AC();
  let lastAt = 0;

  return (speed: number) => {
    const now = ctx.currentTime;
    if (now - lastAt < 0.06) return; // avoid a buzz when bricks chatter
    lastAt = now;
    if (ctx.state === "suspended") void ctx.resume();
    const volume = Math.min(0.5, 0.08 + speed * 0.03);

    // short noise burst = the click of plastic
    const noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2400;
    const g1 = ctx.createGain();
    g1.gain.value = volume;
    src.connect(filter).connect(g1).connect(ctx.destination);
    src.start(now);

    // low knock underneath
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.09);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(volume * 0.8, now);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(g2).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  };
}
