import * as THREE from "three";

let speech = { active: false, pulse: 0, mood: "happy" };
export function setPipSpeech(active, text = "") {
  speech.active = active;
  speech.pulse = performance.now();
  speech.mood = /try|almost/i.test(text) ? "encourage" : "happy";
  document
    .querySelectorAll(".pip-3d")
    .forEach((p) => p.classList.toggle("is-speaking", active));
}
export function pipMarkup(grown, crowned) {
  return `<span class="fox pip-3d ${grown ? "grown" : ""}" data-crown="${crowned}" role="img" aria-label="Pip, a soft 3D cartoon fox"><canvas aria-hidden="true"></canvas><span class="pip-fallback" aria-hidden="true">🦊</span></span>`;
}
const orange = new THREE.MeshStandardMaterial({
  color: "#f29442",
  roughness: 0.75,
});
const lightOrange = new THREE.MeshStandardMaterial({
  color: "#ffb35c",
  roughness: 0.8,
});
const cream = new THREE.MeshStandardMaterial({
  color: "#fff0d2",
  roughness: 0.9,
});
const brown = new THREE.MeshStandardMaterial({
  color: "#965332",
  roughness: 0.8,
});
const pink = new THREE.MeshStandardMaterial({
  color: "#e68c87",
  roughness: 0.9,
});
const black = new THREE.MeshStandardMaterial({
  color: "#25282b",
  roughness: 0.2,
  metalness: 0.05,
});
const eyeWhite = new THREE.MeshStandardMaterial({
  color: "#fffcf1",
  roughness: 0.3,
});
const iris = new THREE.MeshStandardMaterial({
  color: "#67442c",
  roughness: 0.28,
});
const scarfMat = new THREE.MeshStandardMaterial({
  color: "#19a69c",
  roughness: 0.75,
});
const gold = new THREE.MeshStandardMaterial({
  color: "#ffd15b",
  metalness: 0.45,
  roughness: 0.3,
});
const sphere = new THREE.SphereGeometry(1, 36, 28);
const instances = new Map();
let renderer;
let unavailable = false;
function ball(parent, mat, x, y, z, sx, sy = sx, sz = sx) {
  let m = new THREE.Mesh(sphere, mat);
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  parent.add(m);
  return m;
}
function buildPip(crown) {
  const root = new THREE.Group();
  const tail = new THREE.Group();
  tail.position.set(0.49, 0.65, -0.2);
  root.add(tail);
  ball(tail, orange, 0.36, 0.22, -0.05, 0.4, 0.23, 0.25).rotation.z = 0.5;
  ball(tail, orange, 0.62, 0.48, -0.1, 0.3, 0.34, 0.26).rotation.z = -0.4;
  ball(tail, cream, 0.7, 0.75, -0.1, 0.22, 0.25, 0.22).rotation.z = -0.3;
  ball(root, brown, -0.27, 0.17, 0.15, 0.23, 0.17, 0.3);
  ball(root, brown, 0.27, 0.17, 0.15, 0.23, 0.17, 0.3);
  const body = ball(root, orange, 0, 0.71, 0, 0.51, 0.64, 0.38);
  ball(root, cream, 0, 0.69, 0.335, 0.32, 0.43, 0.1);
  const arms = [];
  for (let side of [-1, 1]) {
    const a = new THREE.Group();
    a.position.set(side * 0.43, 1.05, 0.02);
    root.add(a);
    ball(a, orange, side * 0.09, -0.2, 0.07, 0.17, 0.32, 0.18).rotation.z =
      side * 0.25;
    ball(a, lightOrange, side * 0.14, -0.4, 0.11, 0.17, 0.16, 0.19);
    arms.push(a);
  }
  const head = new THREE.Group();
  head.position.set(0, 1.68, 0);
  root.add(head);
  for (let side of [-1, 1]) {
    let ear = new THREE.Group();
    ear.position.set(side * 0.47, 0.47, -0.02);
    ear.rotation.z = -side * 0.24;
    head.add(ear);
    let cone = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.68, 3, 1), orange);
    cone.rotation.y = Math.PI / 3;
    cone.scale.z = 0.65;
    ear.add(cone);
    let inner = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.42, 3, 1), brown);
    inner.rotation.y = Math.PI / 3;
    inner.scale.z = 0.3;
    inner.position.set(0, 0.025, 0.12);
    ear.add(inner);
  }
  ball(head, orange, 0, 0.03, 0, 0.73, 0.64, 0.49);
  ball(head, lightOrange, -0.22, 0.24, 0.32, 0.43, 0.32, 0.2);
  ball(head, cream, -0.29, -0.22, 0.365, 0.37, 0.25, 0.19).rotation.z = -0.26;
  ball(head, cream, 0.29, -0.22, 0.365, 0.37, 0.25, 0.19).rotation.z = 0.26;
  ball(head, cream, 0, -0.35, 0.31, 0.39, 0.2, 0.19);
  const lids = [];
  for (let side of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(side * 0.285, 0.07, 0.442);
    head.add(eye);
    lids.push(eye);
    ball(eye, eyeWhite, 0, 0, 0, 0.16, 0.205, 0.085);
    ball(eye, iris, 0.01, -0.012, 0.065, 0.105, 0.14, 0.055);
    ball(eye, black, 0.015, -0.006, 0.1, 0.073, 0.106, 0.035);
    ball(eye, eyeWhite, -0.027, 0.052, 0.125, 0.036, 0.039, 0.018);
    ball(eye, eyeWhite, 0.04, -0.048, 0.128, 0.015, 0.017, 0.01);
    ball(head, pink, side * 0.47, -0.19, 0.484, 0.105, 0.05, 0.015);
    let brow = ball(head, brown, side * 0.29, 0.32, 0.42, 0.14, 0.025, 0.024);
    brow.rotation.z = side * -0.12;
  }
  const mouth = new THREE.Group();
  mouth.position.set(0, -0.34, 0.505);
  head.add(mouth);
  const opening = ball(mouth, brown, 0, 0, 0, 0.12, 0.055, 0.025);
  ball(mouth, pink, 0, -0.025, 0.016, 0.068, 0.022, 0.015);
  ball(head, black, 0, -0.19, 0.585, 0.113, 0.075, 0.07);
  ball(head, eyeWhite, -0.025, -0.164, 0.644, 0.026, 0.012, 0.007);
  const scarf = new THREE.Mesh(
    new THREE.TorusGeometry(0.355, 0.09, 12, 50),
    scarfMat,
  );
  scarf.rotation.x = Math.PI / 2;
  scarf.position.set(0, 1.16, 0.035);
  scarf.scale.set(1.1, 1, 0.7);
  root.add(scarf);
  const flap = ball(root, scarfMat, 0.2, 0.96, 0.41, 0.12, 0.26, 0.045);
  flap.rotation.z = 0.4;
  if (crown) {
    let band = new THREE.Mesh(
      new THREE.CylinderGeometry(0.31, 0.34, 0.13, 32),
      gold,
    );
    band.position.set(0, 2.32, 0);
    root.add(band);
    for (let i = 0; i < 5; i++) {
      let a = (i * Math.PI * 2) / 5;
      let spike = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.27, 4), gold);
      spike.position.set(Math.sin(a) * 0.24, 2.48, Math.cos(a) * 0.24);
      root.add(spike);
      ball(root, gold, Math.sin(a) * 0.24, 2.63, Math.cos(a) * 0.24, 0.035);
    }
  }
  return { root, head, tail, arms, lids, mouth, opening, body };
}
function init(el) {
  if (unavailable) return;
  try {
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(420, 460, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
    }
    const canvas = el.querySelector("canvas");
    canvas.width = 420;
    canvas.height = 460;
    const context = canvas.getContext("2d");
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xfff8e9, 0x8e99b4, 2.6));
    let key = new THREE.DirectionalLight(0xfff1d5, 4.5);
    key.position.set(-3, 5, 6);
    scene.add(key);
    let rim = new THREE.DirectionalLight(0xc3e9ff, 2.5);
    rim.position.set(3, 3, -3);
    scene.add(rim);
    const model = buildPip(el.dataset.crown === "true");
    scene.add(model.root);
    // Soft transparent contact shadow adds depth without hard edges.
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sc = shadowCanvas.getContext("2d");
    const grad = sc.createRadialGradient(64, 64, 4, 64, 64, 64);
    grad.addColorStop(0, "rgba(48,66,78,.27)");
    grad.addColorStop(1, "rgba(48,66,78,0)");
    sc.fillStyle = grad;
    sc.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(shadowCanvas);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.3),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.005;
    scene.add(shadow);
    const camera = new THREE.PerspectiveCamera(30, 420 / 460, 0.1, 30);
    camera.position.set(0.25, 1.65, 5.6);
    camera.lookAt(0, 1.32, 0);
    el.classList.toggle("is-speaking", speech.active);
    instances.set(el, {
      scene,
      camera,
      context,
      canvas,
      model,
      texture,
      shadow,
      phase: Math.random() * 3,
    });
    el.classList.add("ready");
  } catch (e) {
    unavailable = true;
    console.warn("3D character unavailable; using the illustrated fallback.");
  }
}
function sync() {
  for (const [el, item] of instances) {
    if (!el.isConnected) {
      item.texture.dispose();
      item.shadow.geometry.dispose();
      item.shadow.material.dispose();
      item.scene.traverse((o) => {
        if (o.isMesh && o.geometry !== sphere) o.geometry.dispose();
      });
      instances.delete(el);
    }
  }
  document.querySelectorAll(".pip-3d").forEach((el) => {
    if (!instances.has(el)) init(el);
  });
}
let last = 0;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden || now - last < 40) return;
  last = now;
  const t = now / 1000;
  for (const [el, item] of instances) {
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight || rect.width === 0) continue;
    const m = item.model;
    const moving = !reduced.matches;
    const talk = speech.active;
    const beat = moving ? Math.sin(t * 5) : 0;
    m.root.position.y = moving ? Math.sin(t * 2) * 0.018 : 0;
    m.root.rotation.y = moving ? Math.sin(t * 0.7) * 0.075 : 0;
    m.head.rotation.z = moving
      ? talk
        ? Math.sin(t * 3) * 0.045
        : Math.sin(t * 1.2) * 0.028
      : 0;
    m.head.rotation.x = talk && moving ? Math.sin(t * 4) * 0.025 : 0;
    m.tail.rotation.x = moving ? Math.sin(t * 4) * 0.18 : 0;
    m.tail.rotation.z = moving ? Math.sin(t * 3) * 0.12 : 0;
    m.arms[1].rotation.z =
      talk && moving ? -0.8 + Math.sin(t * 6) * 0.22 : Math.sin(t * 2) * 0.035;
    m.arms[0].rotation.z = talk && moving ? 0.12 + Math.sin(t * 3) * 0.08 : 0;
    const blink = moving && (t + item.phase) % 4.7 < 0.13;
    for (const eye of m.lids) eye.scale.y = blink ? 0.08 : 1;
    const elapsed = (now - speech.pulse) / 1000;
    m.mouth.scale.y =
      talk && moving ? 0.9 + Math.abs(Math.sin(elapsed * 13)) * 2.6 : 0.45;
    m.mouth.scale.x =
      talk && moving ? 0.85 + Math.abs(Math.sin(elapsed * 8)) * 0.2 : 1;
    renderer.render(item.scene, item.camera);
    item.context.clearRect(0, 0, 420, 460);
    item.context.drawImage(renderer.domElement, 0, 0);
  }
}
export function startPip() {
  sync();
  new MutationObserver(sync).observe(document.querySelector("#app"), {
    childList: true,
    subtree: true,
  });
  requestAnimationFrame(frame);
}
