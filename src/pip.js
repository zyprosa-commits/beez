import * as THREE from "three";

let speech = { active: false, pulse: 0, mood: "happy" };
let audioLevel = 0;
export function setPipLevel(level) {
  audioLevel = level;
}
export function setPipSpeech(active, text = "") {
  speech.active = active;
  speech.pulse = performance.now();
  speech.mood = /try|almost/i.test(text) ? "encourage" : "happy";
  document
    .querySelectorAll(".pip-3d")
    .forEach((p) => p.classList.toggle("is-speaking", active));
}
export function pipMarkup(grown, crowned) {
  return `<span class="fox pip-3d ${grown ? "grown" : ""}" data-crown="${crowned}" data-growth="${typeof grown === "number" ? grown : grown ? 2 : 0}" role="img" aria-label="Pip, a goofy purple adventure creature"><canvas aria-hidden="true"></canvas><span class="pip-fallback" aria-hidden="true">👾</span></span>`;
}
const orange = new THREE.MeshStandardMaterial({
  color: "#9a68d4",
  roughness: 0.75,
});
const lightOrange = new THREE.MeshStandardMaterial({
  color: "#b58be4",
  roughness: 0.8,
});
const cream = new THREE.MeshStandardMaterial({
  color: "#e5d0f1",
  roughness: 0.9,
});
const brown = new THREE.MeshStandardMaterial({
  color: "#694696",
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
let motion = { kind: "idle", until: 0 };
export function pipAction(kind = "hop", duration = 2600) {
  motion = { kind, until: performance.now() + duration };
  document.querySelectorAll(".pip-3d").forEach((el) => {
    el.dataset.action = kind;
    setTimeout(() => {
      if (el.dataset.action === kind) delete el.dataset.action;
    }, duration);
  });
}
function buildPip(crown, growth = 0) {
  const root = new THREE.Group();
  const body = ball(root, orange, 0, 0.82, 0, 0.55, 0.65, 0.42);
  ball(root, cream, 0, 0.75, 0.365, 0.32, 0.38, 0.1);
  const tail = new THREE.Group();
  tail.position.set(0.45, 0.5, -0.15);
  root.add(tail);
  ball(tail, orange, 0.25, 0.08, -0.1, 0.33, 0.16, 0.19);
  ball(tail, scarfMat, 0.48, 0.18, -0.12, 0.15, 0.16, 0.14);
  for (const side of [-1, 1]) {
    ball(root, brown, side * 0.29, 0.17, 0.22, 0.26, 0.17, 0.33);
    ball(root, lightOrange, side * 0.29, 0.23, 0.34, 0.17, 0.05, 0.12);
  }
  const arms = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(side * 0.46, 1.1, 0);
    root.add(arm);
    ball(arm, orange, side * 0.09, -0.2, 0.04, 0.15, 0.3, 0.16);
    ball(arm, lightOrange, side * 0.12, -0.4, 0.08, 0.2, 0.18, 0.18);
    arms.push(arm);
  }
  const head = new THREE.Group();
  head.position.set(0, 1.65, 0);
  root.add(head);
  ball(head, orange, 0, 0.04, 0, 0.69, 0.59, 0.47);
  const ears = [];
  for (const side of [-1, 1]) {
    const ear = new THREE.Group();
    ear.position.set(side * 0.5, 0.43, -0.05);
    head.add(ear);
    ball(ear, orange, side * 0.08, 0.12, 0, 0.16, 0.35, 0.12).rotation.z =
      side * -0.5;
    ball(ear, scarfMat, side * 0.08, 0.15, 0.09, 0.075, 0.2, 0.035).rotation.z =
      side * -0.5;
    ears.push(ear);
  }
  // A crooked tuft, asymmetrical eyes, and one tiny tooth give Pip a comic silhouette.
  ball(head, lightOrange, -0.07, 0.59, 0, 0.13, 0.26, 0.12).rotation.z = -0.6;
  ball(head, lightOrange, 0.1, 0.56, -0.02, 0.12, 0.2, 0.11).rotation.z = 0.4;
  const lids = [];
  for (const side of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(side * 0.25, 0.12, 0.405);
    eye.rotation.z = side * 0.09;
    head.add(eye);
    lids.push(eye);
    ball(eye, eyeWhite, 0, 0, 0, 0.22, side === -1 ? 0.285 : 0.255, 0.12);
    ball(eye, black, -side * 0.025, -0.025, 0.105, 0.105, 0.145, 0.045);
    ball(
      eye,
      eyeWhite,
      -side * 0.025 - 0.035,
      0.027,
      0.147,
      0.036,
      0.045,
      0.012,
    );
    ball(head, pink, side * 0.46, -0.16, 0.4, 0.12, 0.06, 0.022);
  }
  const mouth = new THREE.Group();
  mouth.position.set(0.015, -0.245, 0.458);
  mouth.rotation.z = -0.06;
  head.add(mouth);
  const opening = ball(mouth, brown, 0, 0, 0, 0.19, 0.1, 0.035);
  ball(mouth, pink, 0.025, -0.045, 0.027, 0.1, 0.035, 0.015);
  ball(head, eyeWhite, 0.055, -0.19, 0.499, 0.052, 0.068, 0.02);
  ball(head, lightOrange, 0, -0.1, 0.49, 0.12, 0.065, 0.055);
  for (const [x, y] of [
    [-0.49, -0.02],
    [-0.54, 0.1],
    [0.51, 0.01],
  ])
    ball(head, scarfMat, x, y, 0.32, 0.045, 0.055, 0.015);
  if (crown) {
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.115), gold);
    star.position.set(0, 0.87, 0.49);
    root.add(star);
  }
  if (growth >= 1) {
    ball(root, scarfMat, -0.46, 0.85, 0.25, 0.06, 0.11, 0.035);
    ball(root, scarfMat, 0.46, 0.85, 0.25, 0.06, 0.11, 0.035);
  }
  if (growth >= 2)
    for (const side of [-1, 1]) {
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.035, 10, 24),
        gold,
      );
      band.position.set(side * 0.59, 0.74, 0.07);
      band.rotation.x = Math.PI / 2;
      root.add(band);
    }
  if (growth >= 3) {
    ball(root, scarfMat, 0, 0.95, -0.36, 0.42, 0.4, 0.16);
    ball(root, gold, 0, 1.14, 0.43, 0.07);
  }
  if (growth >= 4) {
    ball(head, gold, -0.5, 0.2, 0.32, 0.05);
    ball(head, gold, 0.5, 0.22, 0.32, 0.05);
  }
  return { root, head, tail, arms, lids, mouth, opening, body, ears, growth };
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
      renderer.toneMappingExposure = 1.05;
    }
    const canvas = el.querySelector("canvas");
    canvas.width = 420;
    canvas.height = 460;
    const context = canvas.getContext("2d");
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xfff8f3, 0x8e99b4, 2));
    let key = new THREE.DirectionalLight(0xfff5eb, 3.2);
    key.position.set(-3, 5, 6);
    scene.add(key);
    let rim = new THREE.DirectionalLight(0xc3e9ff, 2.5);
    rim.position.set(3, 3, -3);
    scene.add(rim);
    const model = buildPip(
      el.dataset.crown === "true",
      Number(el.dataset.growth) || 0,
    );
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
    if (
      (reduced.matches || document.documentElement.dataset.calm) &&
      !speech.active &&
      item.rendered
    )
      continue;
    const m = item.model;
    const moving = !reduced.matches && !document.documentElement.dataset.calm;
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
    const action = now < motion.until ? motion.kind : "idle";
    if (moving) {
      const idleHop = (t + item.phase) % 9 < 0.65;
      const hopping = action === "hop" || idleHop;
      const dancing = action === "dance" || action === "chant";
      const hop = Math.abs(Math.sin(t * 5));
      m.root.position.y = hopping
        ? hop * 0.3
        : dancing
          ? Math.abs(Math.sin(t * 7)) * 0.1
          : Math.sin(t * 2) * 0.025;
      m.root.position.x = dancing
        ? Math.sin(t * 3) * 0.16
        : Math.sin(t * 0.65) * 0.06;
      m.root.rotation.z = dancing ? Math.sin(t * 7) * 0.12 : 0;
      m.root.rotation.y = dancing
        ? Math.sin(t * 2) * 0.4
        : Math.sin(t * 0.6) * 0.14;
      m.root.scale.set(
        hopping ? 1.04 - hop * 0.08 : 1,
        hopping ? 0.92 + hop * 0.16 : 1,
        1,
      );
      if (dancing) {
        m.arms[0].rotation.z = 0.8 + Math.sin(t * 7) * 0.5;
        m.arms[1].rotation.z = -0.8 + Math.sin(t * 7) * 0.5;
      }
      if (action === "wave") {
        m.arms[1].rotation.z = -2 + Math.sin(t * 10) * 0.3;
      }
      m.ears.forEach((ear, i) => (ear.rotation.z = Math.sin(t * 3 + i) * 0.1));
    } else {
      m.root.scale.setScalar(1);
      m.root.position.x = 0;
      m.root.rotation.z = 0;
    }
    const blink = moving && (t + item.phase) % 4.7 < 0.13;
    for (const eye of m.lids) eye.scale.y = blink ? 0.08 : 1;
    const elapsed = (now - speech.pulse) / 1000;
    m.mouth.scale.y = talk && moving ? 0.4 + audioLevel * 2.7 : 0.45;
    m.mouth.scale.x = talk && moving ? 1 - audioLevel * 0.17 : 1;
    m.root.scale.multiplyScalar(0.9 + m.growth * 0.025);
    renderer.render(item.scene, item.camera);
    item.rendered = true;
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
