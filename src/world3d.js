import * as T from "three";
let disposePrevious = () => {};
export function startWorld() {
  disposePrevious();
  const host = document.querySelector(".adventure-world");
  if (!host) return;
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return;
  }
  host.classList.add("has-3d-world");
  const canvas = renderer.domElement;
  canvas.className = "world-canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.prepend(canvas);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new T.Scene();
  scene.fog = new T.Fog("#b4e9ec", 30, 65);
  scene.add(new T.HemisphereLight("#fff4d6", "#a3a5ce", 2.4));
  const key = new T.DirectionalLight("#fff4d2", 3.5);
  key.position.set(-7, 15, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -13;
  key.shadow.camera.right = 13;
  key.shadow.camera.top = 12;
  key.shadow.camera.bottom = -12;
  key.shadow.normalBias = 0.04;
  scene.add(key);
  scene.add(key.target);
  const camera = new T.PerspectiveCamera(39, 1, 0.1, 100);
  const materials = [];
  function mat(color, extra = {}) {
    const m = new T.MeshStandardMaterial({ color, roughness: 0.84, ...extra });
    materials.push(m);
    return m;
  }
  const grass = mat("#88d99b"),
    mint = mat("#b5ecc0"),
    soil = mat("#8777af"),
    trunk = mat("#a57954"),
    leaf = mat("#54bf9d"),
    lightLeaf = mat("#93dc9a"),
    purple = mat("#ab8bd6"),
    cream = mat("#fff1cd"),
    pink = mat("#ef94b0"),
    gold = mat("#f9d37c"),
    water = mat("#68c8de", { roughness: 0.25, metalness: 0.1 }),
    white = mat("#fff7e8");
  function mesh(parent, geometry, material, x, y, z) {
    let m = new T.Mesh(geometry, material);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function sphere(parent, material, x, y, z, sx, sy = sx, sz = sx) {
    let m = mesh(parent, new T.SphereGeometry(1, 24, 18), material, x, y, z);
    m.scale.set(sx, sy, sz);
    return m;
  }
  function box(parent, material, x, y, z, w, h, d) {
    return mesh(parent, new T.BoxGeometry(w, h, d), material, x, y, z);
  }
  function cylinder(parent, material, x, y, z, rt, rb, h) {
    return mesh(
      parent,
      new T.CylinderGeometry(rt, rb, h, 40),
      material,
      x,
      y,
      z,
    );
  }
  const world = new T.Group();
  scene.add(world);
  // The entire playable map is a modeled, floating miniature landscape.
  let base = cylinder(world, soil, 0, -1.5, 0, 7.8, 5.6, 2.2);
  base.scale.z = 0.68;
  let rim = cylinder(world, mint, 0, -0.38, 0, 7.85, 7.65, 0.3);
  rim.scale.z = 0.68;
  let ground = cylinder(world, grass, 0, -0.17, 0, 7.65, 7.8, 0.3);
  ground.scale.z = 0.68;
  for (let i = 0; i < 9; i++) {
    let angle = i * 2.4;
    sphere(
      world,
      soil,
      Math.cos(angle) * 5.7,
      -2.1,
      Math.sin(angle) * 2.5,
      0.8,
      0.75,
      0.7,
    );
  }
  const points = [
    new T.Vector3(-6, 0.03, 2.4),
    new T.Vector3(-3, 0.03, 1.8),
    new T.Vector3(-1, 0.03, 2.5),
    new T.Vector3(1, 0.03, 1.6),
    new T.Vector3(3, 0.03, 1.2),
    new T.Vector3(5.4, 0.03, -0.3),
  ];
  const trail = new T.CatmullRomCurve3(points);
  let road = mesh(
    world,
    new T.TubeGeometry(trail, 80, 0.48, 12, false),
    gold,
    0,
    0,
    0,
  );
  road.scale.y = 0.19;
  const streamCurve = new T.CatmullRomCurve3([
    new T.Vector3(-1.2, 0.05, -4.9),
    new T.Vector3(-0.5, 0.05, -2),
    new T.Vector3(0.3, 0.05, 0),
    new T.Vector3(0.5, 0.05, 2),
    new T.Vector3(1.6, 0.05, 4.8),
  ]);
  let stream = mesh(
    world,
    new T.TubeGeometry(streamCurve, 64, 0.65, 14, false),
    water,
    0,
    0,
    0,
  );
  stream.scale.y = 0.13;
  // Storybook bridge: individual planks, rails, and support posts.
  for (let i = 0; i < 9; i++) {
    let plank = box(
      world,
      cream,
      -0.8 + i * 0.21,
      0.19,
      1.95,
      0.19,
      0.16,
      1.22,
    );
    plank.position.y += Math.sin((i / 8) * Math.PI) * 0.25;
  }
  for (let z of [1.25, 2.65]) {
    for (let x of [-0.9, 0.85])
      cylinder(world, trunk, x, 0.58, z, 0.055, 0.055, 0.9);
    box(world, trunk, -0.025, 0.88, z, 1.9, 0.07, 0.07);
  }
  const garden = new T.Group();
  garden.position.set(-4, 0.07, -0.5);
  world.add(garden);
  cylinder(garden, mint, 0, 0.06, 0, 1.65, 1.65, 0.18);
  box(garden, cream, 0, 0.7, 0, 1.5, 1.35, 1.25);
  let roof = mesh(garden, new T.ConeGeometry(1.36, 0.9, 4), purple, 0, 1.78, 0);
  roof.rotation.y = Math.PI / 4;
  roof.scale.z = 0.92;
  box(garden, purple, 0, 0.49, 0.64, 0.48, 0.95, 0.08);
  sphere(garden, gold, 0.15, 0.48, 0.7, 0.04);
  for (let x of [-0.48, 0.48]) {
    box(garden, pink, x, 0.9, 0.654, 0.3, 0.38, 0.05);
    box(garden, cream, x, 0.9, 0.69, 0.035, 0.38, 0.03);
  }
  for (let i = 0; i < 7; i++) {
    let x = -1.15 + i * 0.37;
    box(garden, white, x, 0.32, 1.1, 0.1, 0.62, 0.08);
  }
  box(garden, white, 0, 0.4, 1.1, 2.4, 0.07, 0.09);
  const castle = new T.Group();
  castle.position.set(4, 0.12, -1.3);
  world.add(castle);
  cylinder(castle, mint, 0, 0.1, 0, 1.8, 1.8, 0.25);
  box(castle, cream, 0, 0.8, 0, 1.65, 1.5, 1.1);
  box(castle, purple, 0, 0.52, 0.57, 0.55, 1, 0.08);
  for (let x of [-0.92, 0.92]) {
    cylinder(castle, purple, x, 0.98, 0, 0.36, 0.39, 1.8);
    mesh(castle, new T.ConeGeometry(0.54, 0.9, 32), pink, x, 2.3, 0);
    cylinder(castle, gold, x, 2.94, 0, 0.022, 0.022, 0.45);
    box(castle, gold, x + 0.17, 3.03, 0, 0.32, 0.21, 0.04);
    box(castle, cream, x, 1.15, 0.36, 0.13, 0.3, 0.06);
  }
  for (let i = 0; i < 5; i++)
    box(castle, cream, -0.7 + i * 0.35, 1.68, 0.15, 0.19, 0.35, 0.95);
  for (let i = 0; i < 18; i++) {
    let a = i * 2.399;
    let x = Math.cos(a) * (3.6 + (i % 3) * 1.4),
      z = Math.sin(a) * (2.7 + (i % 2) * 0.5);
    if ((x < -2 && z < 0.5 && z > -2) || (x > 2.5 && z < 0.2 && z > -2.8))
      continue;
    let tree = new T.Group();
    tree.position.set(x, 0, z);
    world.add(tree);
    const size = 0.65 + (i % 3) * 0.15;
    cylinder(tree, trunk, 0, 0.5, 0, 0.11, 0.15, 1);
    sphere(tree, i % 2 ? leaf : lightLeaf, 0, 1.2, 0, size, size * 1.15, size);
    sphere(
      tree,
      lightLeaf,
      -0.24,
      1.45,
      0.12,
      size * 0.65,
      size * 0.65,
      size * 0.65,
    );
  }
  for (let i = 0; i < 65; i++) {
    let a = i * 2.399;
    let r = 2 + (i % 9) * 0.58;
    let x = Math.cos(a) * r,
      z = Math.sin(a) * r * 0.62;
    if (Math.abs(x) < 1 || (z > 1 && z < 2.8)) continue;
    const color = i % 3 === 0 ? pink : i % 3 === 1 ? gold : white;
    cylinder(world, leaf, x, 0.14, z, 0.016, 0.018, 0.28);
    sphere(world, color, x, 0.32, z, 0.105, 0.065, 0.105);
    sphere(world, gold, x, 0.36, z, 0.035);
  }
  // Tiny floating clouds and world fragments add foreground/background separation.
  const clouds = [];
  for (let i = 0; i < 6; i++) {
    let g = new T.Group();
    g.position.set(-9 + i * 3.5, 2.6 + (i % 3) * 0.7, -6 - (i % 2) * 1.5);
    for (let j = 0; j < 3; j++)
      sphere(g, white, (j - 1) * 0.55, j === 1 ? 0.2 : 0, 0, 0.65, 0.4, 0.4);
    scene.add(g);
    clouds.push(g);
  }
  const motes = [];
  const glow = mat("#fff0a3", { emissive: "#ffe39a", emissiveIntensity: 0.4 });
  for (let i = 0; i < 13; i++) {
    let m = sphere(
      world,
      glow,
      Math.cos(i * 2.4) * 5,
      1 + (i % 4) * 0.4,
      Math.sin(i * 2.4) * 3,
      0.045,
    );
    motes.push(m);
  }
  const anchors = [
    new T.Vector3(-4, 2.3, -0.5),
    new T.Vector3(0.1, 1.2, 1.9),
    new T.Vector3(4, 3.1, -1.3),
  ];
  const stops = [...host.querySelectorAll(".map-stop")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let width = 1,
    height = 1,
    px = 0,
    py = 0,
    active = true,
    frameId;
  function resize() {
    const r = host.getBoundingClientRect();
    width = r.width;
    height = r.height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();
  const pointer = (e) => {
    if (
      reduced.matches ||
      document.documentElement.dataset.calm ||
      e.pointerType !== "mouse"
    )
      return;
    const r = host.getBoundingClientRect();
    px = (e.clientX - r.left) / width - 0.5;
    py = (e.clientY - r.top) / height - 0.5;
  };
  const leave = () => {
    px = py = 0;
  };
  host.addEventListener("pointermove", pointer);
  host.addEventListener("pointerleave", leave);
  let last = 0;
  function frame(now) {
    if (!active) return;
    frameId = requestAnimationFrame(frame);
    if (
      document.hidden ||
      now - last <
        (reduced.matches || document.documentElement.dataset.calm ? 200 : 32)
    )
      return;
    last = now;
    const mobile = width < 650;
    const d = mobile ? 27 : 21;
    camera.position.set(2.4 + px * 0.8, d * 0.54 + py * 0.35, d);
    camera.lookAt(0, mobile ? 0.5 : 0.1, 0);
    const t = now / 1000;
    if (!reduced.matches && !document.documentElement.dataset.calm) {
      clouds.forEach(
        (c, i) => (c.position.x += Math.sin(t * 0.4 + i) * 0.0015),
      );
      motes.forEach((m, i) => {
        m.position.y = 1.3 + (i % 4) * 0.4 + Math.sin(t * 1.5 + i) * 0.12;
      });
    }
    renderer.render(scene, camera);
    anchors.forEach((a, i) => {
      const p = a.clone().project(camera);
      if (stops[i]) {
        stops[i].style.left = ((p.x + 1) / 2) * width + "px";
        stops[i].style.top = ((-p.y + 1) / 2) * height + "px";
      }
    });
  }
  requestAnimationFrame(frame);
  disposePrevious = () => {
    active = false;
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    host.removeEventListener("pointermove", pointer);
    host.removeEventListener("pointerleave", leave);
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
    materials.forEach((m) => m.dispose());
    renderer.dispose();
    canvas.remove();
  };
}
