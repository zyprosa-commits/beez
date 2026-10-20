import { pipMarkup, pipAction, startPip } from "./pip.js";
import { playPipVoice, stopPipVoice } from "./voice.js";
import { startWorld } from "./world3d.js";
import { cartoon } from "./cartoon.js";
import lines from "./episode-lines.json";
const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const vocabulary = [
  ["Apple", "🍎", "Ant", "🐜", "Airplane", "✈️"],
  ["Butterfly", "🦋", "Ball", "⚽", "Bear", "🐻"],
  ["Cat", "🐱", "Cake", "🍰", "Car", "🚗"],
  ["Dog", "🐶", "Duck", "🦆", "Drum", "🥁"],
  ["Elephant", "🐘", "Egg", "🥚", "Envelope", "✉️"],
  ["Fox", "🦊", "Fish", "🐟", "Flower", "🌸"],
  ["Giraffe", "🦒", "Grapes", "🍇", "Guitar", "🎸"],
  ["House", "🏠", "Hat", "🎩", "Horse", "🐴"],
  ["Ice cream", "🍦", "Igloo", "🧊", "Insect", "🐞"],
  ["Jellyfish", "🪼", "Jam", "🫙", "Juice", "🧃"],
  ["Kite", "🪁", "Key", "🔑", "Koala", "🐨"],
  ["Lion", "🦁", "Leaf", "🍃", "Lemon", "🍋"],
  ["Moon", "🌙", "Mouse", "🐭", "Monkey", "🐵"],
  ["Nest", "🪺", "Nose", "👃", "Nut", "🥜"],
  ["Owl", "🦉", "Orange", "🍊", "Octopus", "🐙"],
  ["Penguin", "🐧", "Pear", "🍐", "Pizza", "🍕"],
  ["Queen", "👑", "Quilt", "🛏️", "Quail", "🐦"],
  ["Rainbow", "🌈", "Rabbit", "🐰", "Rocket", "🚀"],
  ["Sun", "☀️", "Star", "⭐", "Snail", "🐌"],
  ["Tree", "🌳", "Tiger", "🐯", "Turtle", "🐢"],
  ["Umbrella", "☂️", "Unicorn", "🦄", "Up", "⬆️"],
  ["Violin", "🎻", "Volcano", "🌋", "Van", "🚐"],
  ["Whale", "🐳", "Watermelon", "🍉", "Watch", "⌚"],
  ["X-ray", "🩻", "X-ray fish", "🐟", "X-ray picture", "🩻"],
  ["Yo-yo", "🪀", "Yarn", "🧶", "Yak", "🐃"],
  ["Zebra", "🦓", "Zoo", "🦁", "Zipper", "🤐"],
];
const chapters = [
  ["meet", "Hello, little letter", 3],
  ["sound", "Say it your way", 5],
  ["hunt", "The bubble hunt", 6],
  ["color", "Color a little magic", 8],
  ["trace", "Follow the star trail", 6],
  ["move", "Wiggle with Pip", 4],
  ["sort", "The letter basket", 5],
  ["memory", "A match made in magic", 5],
  ["song", "Our growing letter song", 5],
  ["draw", "Your imagination studio", 6],
  ["review", "One last adventure", 4],
  ["grow", "Pip’s big little glow-up", 3],
];
let state;
try {
  state = JSON.parse(localStorage.getItem("pip-episodes-v1"));
} catch {}
state ||= {
  letter: 0,
  chapter: 0,
  stars: 0,
  complete: {},
  art: {},
  verses: [],
};
let muted = false,
  round = 0,
  canContinue = false,
  epoch = 0,
  chanting = false,
  sessionStart = Date.now();
const app = document.querySelector("#app");
const save = () =>
  localStorage.setItem("pip-episodes-v1", JSON.stringify(state));
const L = () => alphabet[state.letter];
const word = () => vocabulary[state.letter][0];
const chant = (i = state.letter) =>
  `${alphabet[i]}, ${alphabet[i]}, ${alphabet[i]}! ${alphabet[i]} is for ${vocabulary[i][0]}! Wiggle to the left. Wiggle to the right. ${alphabet[i]}, ${alphabet[i]}, ${alphabet[i]}! You got it right!`;
const say = (t) => (muted ? Promise.resolve(false) : playPipVoice(t));
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const pip = () =>
  pipMarkup(Math.min(5, Math.floor(state.stars / 12)), state.stars >= 3);
function scene() {
  epoch++;
  stopPipVoice();
  chanting = false;
  save();
  round = 0;
  canContinue = false;
  const [id, title, minutes] = chapters[state.chapter];
  const narration =
    id === "meet"
      ? `Hey, explorer! This is ${L()}. ${L()} is for ${word().toLowerCase()}. Let’s say ${L()} together!`
      : lines[id];
  const complete = state.complete[state.letter + "-" + id];
  app.innerHTML = `<main class="letter-episode chapter-${id}"><div class="episode-world adventure-world" aria-hidden="true"></div><div class="screen-wash"></div><header class="episode-top"><a class="episode-logo" href="#" aria-label="Letterwood">✳ <b>letterwood</b></a><div class="episode-position"><span>EPISODE ${String(state.letter + 1).padStart(2, "0")}</span><b>The wonderful world of ${L()}</b></div><button class="icon-button" id="pause" aria-label="Pause adventure">Ⅱ</button></header><div class="episode-title"><span>CHAPTER ${state.chapter + 1} OF 12 <i></i> ABOUT ${minutes} MIN OF PLAY</span><h1>${title}</h1></div><div class="performance"><div class="pip-spot"><div class="pip-stage">${pip()}</div><div class="pip-dialogue"><span>PIP SAYS</span><p id="pip-caption">${narration}</p><button id="hear-pip" aria-label="Hear Pip’s instructions">${muted ? "♪ Voice muted" : "♫ Hear Pip"}</button></div><div class="pip-actions"><button data-motion="hop">Hop!</button><button data-motion="dance">Dance!</button></div></div><section class="play-zone" id="play-zone" aria-label="${title}"></section></div><footer class="episode-bottom"><button class="back-control" id="back" ${state.chapter === 0 ? "disabled" : ""}>← <span>Go back</span></button><div class="chapter-track" aria-label="Chapter ${state.chapter + 1} of 12">${chapters.map((_, i) => `<i class="${i < state.chapter ? "done" : ""} ${i === state.chapter ? "current" : ""}"></i>`).join("")}</div><button class="continue-button" id="continue" disabled>${state.chapter === 11 ? (state.letter === 25 ? "Our finale →" : "Next letter →") : "Keep exploring →"}</button></footer><div id="overlay"></div></main>`;
  document.querySelector("#hear-pip").onclick = () => say(narration);
  document.querySelector("#pause").onclick = pause;
  document
    .querySelectorAll("[data-motion]")
    .forEach((b) => (b.onclick = () => pipAction(b.dataset.motion, 4000)));
  document.querySelector("#back").onclick = () => {
    if (state.chapter) {
      state.chapter--;
      scene();
    }
  };
  document.querySelector("#continue").onclick = advance;
  document.querySelector(".episode-logo").onclick = (e) => {
    e.preventDefault();
    pause();
  };
  startWorld();
  renderActivity(id);
  if (complete) enableContinue();
}
function enableContinue() {
  canContinue = true;
  document.querySelector("#continue").disabled = false;
}
function finish() {
  if (!state.complete[state.letter + "-" + chapters[state.chapter][0]]) {
    state.complete[state.letter + "-" + chapters[state.chapter][0]] = true;
    state.stars++;
    save();
  }
  enableContinue();
  pipAction("hop", 2300);
  document.querySelector(".pip-spot").classList.add("celebrating");
  setTimeout(
    () => document.querySelector(".pip-spot")?.classList.remove("celebrating"),
    2400,
  );
}
function advance() {
  if (!canContinue) return;
  stopPipVoice();
  if (state.chapter === 11) {
    if (!state.verses.includes(state.letter)) state.verses.push(state.letter);
    if (state.letter < 25) {
      state.letter++;
      state.chapter = 0;
      scene();
    } else finale();
  } else {
    state.chapter++;
    scene();
  }
}
function renderActivity(id) {
  const zone = document.querySelector("#play-zone");
  if (id === "meet") {
    zone.innerHTML = `<div class="letter-reveal"><span class="orbit-star one">✦</span><span class="orbit-star two">✧</span><span class="giant-letter">${L()}<small>${L().toLowerCase()}</small></span><div class="letter-object">${state.letter === 0 ? cartoon("apple") : vocabulary[state.letter][1]}</div><div class="word-label">${L()} is for <b>${word()}</b></div><button class="play-pill" id="hello-letter">Say hello to ${L()} ♫</button></div>`;
    document.querySelector("#hello-letter").onclick = () => {
      say(
        `Hey, explorer! This is ${L()}. ${L()} is for ${word().toLowerCase()}. Let’s say ${L()} together!`,
      );
      finish();
    };
  }
  if (id === "sound") {
    zone.innerHTML = `<div class="sound-play"><div class="speech-letter">${L()}</div><p>My turn. Your turn!</p><div class="voice-moods">${["Like an explorer", "Like a sleepy giant", "Like a tiny mouse", "Your silly voice"].map((x, i) => `<button data-mood="${i}"><span>${["✦", "☾", "·", "☺"][i]}</span>${x}</button>`).join("")}</div><div class="activity-counter" id="sound-count">0 / 4 voices explored</div></div>`;
    const done = new Set();
    document.querySelectorAll("[data-mood]").forEach(
      (b) =>
        (b.onclick = () => {
          say(`${L()}. ${L()} is for ${word()}`);
          done.add(b.dataset.mood);
          b.classList.add("checked");
          document.querySelector("#sound-count").textContent =
            done.size + " / 4 voices explored";
          pipAction("wave");
          if (done.size === 4) finish();
        }),
    );
  }
  if (id === "hunt") bubbleHunt();
  if (id === "color") coloring();
  if (id === "trace") drawing(true);
  if (id === "move") {
    const moves = [
      "Hop three times",
      "Wave both arms",
      "Reach for a star",
      "Wiggle your shoulders",
      "Twirl slowly",
      "Your silly dance",
    ];
    zone.innerHTML = `<div class="movement-game"><span class="move-number">01</span><h2 id="move-title">${moves[0]}</h2><div class="movement-orbit">✦</div><p>Copy Pip. Make it your own.</p><button class="play-pill" id="did-move">We did it! →</button><div class="activity-counter" id="move-count">1 / 6 little moves</div></div>`;
    pipAction("hop", 4500);
    let i = 0;
    document.querySelector("#did-move").onclick = () => {
      i++;
      if (i >= moves.length) {
        finish();
        document.querySelector("#move-title").textContent =
          "The world’s wiggliest team!";
        document.querySelector("#move-count").textContent =
          "6 / 6 moves. Take a little breather.";
        document.querySelector("#did-move").textContent = "Dance again";
        i = -1;
      } else {
        document.querySelector("#move-title").textContent = moves[i];
        document.querySelector(".move-number").textContent = String(
          i + 1,
        ).padStart(2, "0");
        document.querySelector("#move-count").textContent =
          i + 1 + " / 6 little moves";
        pipAction(i % 2 ? "wave" : "dance", 5000);
      }
    };
  }
  if (id === "sort") sorting();
  if (id === "memory") memory();
  if (id === "song") song();
  if (id === "draw") drawing(false);
  if (id === "review") review();
  if (id === "grow") {
    zone.innerHTML = `<div class="growth-show"><div class="growth-halo"></div><span class="growth-sticker">✦ ${state.stars} DISCOVERIES</span><h2>You grew a little magic.</h2><p>A whole episode of ${L()}. A whole lot of teamwork.</p><button class="play-pill" id="glow-up">Watch Pip grow! ✦</button><div class="growth-message" role="status"></div></div>`;
    document.querySelector("#glow-up").onclick = () => {
      finish();
      if (!state.verses.includes(state.letter)) state.verses.push(state.letter);
      save();
      document.querySelector(".pip-stage").innerHTML = pip();
      document.querySelector(".pip-stage").classList.add("growth-burst");
      document.querySelector(".growth-show").classList.add("unlocked");
      document.querySelector(".growth-message").textContent =
        `A new star, a bigger Pip, and a ${L()} verse for our song!`;
      say(lines.grow);
      pipAction("dance", 6500);
    };
  }
}
function bubbleHunt() {
  const zone = document.querySelector("#play-zone");
  let found = 0;
  function fill() {
    const target = L();
    const choices = shuffle([
      target,
      target,
      ...shuffle(alphabet.filter((x) => x !== target)).slice(0, 4),
    ]);
    zone.innerHTML = `<div class="bubble-game"><div class="game-prompt">Find <b>${L()}</b> <span id="hunt-count">${found} / 6 found</span></div><div class="bubble-field">${choices.map((x, i) => `<button class="letter-bubble" style="--b:${i}" data-bubble="${x}" aria-label="Letter ${x}">${x}</button>`).join("")}</div><p class="gentle-hint" role="status">Which bubbles are hiding our letter?</p></div>`;
    document.querySelectorAll("[data-bubble]").forEach(
      (b) =>
        (b.onclick = () => {
          if (b.dataset.bubble === L()) {
            b.disabled = true;
            b.classList.add("popped");
            found++;
            document.querySelector("#hunt-count").textContent =
              found + " / 6 found";
            pipAction("hop", 1200);
            if (found === 6) {
              finish();
              document.querySelector(".gentle-hint").textContent =
                "Six sparkling discoveries!";
              const replay = document.createElement("button");
              replay.className = "replay";
              replay.textContent = "Play again";
              replay.onclick = () => {
                found = 0;
                fill();
              };
              zone.append(replay);
            } else if (found % 2 === 0)
              setTimeout(() => {
                if (b.isConnected) fill();
              }, 450);
          } else {
            b.classList.add("wobble");
            setTimeout(() => b.classList.remove("wobble"), 500);
            document.querySelector(".gentle-hint").textContent =
              "That’s " + b.dataset.bubble + ". Let’s look for " + L() + "!";
          }
        }),
    );
  }
  fill();
}
function coloring() {
  const zone = document.querySelector("#play-zone");
  const colors = [
    "#ff8d9e",
    "#ffa85c",
    "#ffe37e",
    "#99d5ae",
    "#7ecde2",
    "#b69bea",
    "#e8a9d3",
    "#fff9df",
  ];
  let color = colors[0],
    touched = new Set();
  const art = state.art["color-" + state.letter] || {};
  zone.innerHTML = `<div class="color-studio"><div class="game-prompt">Make ${L()} your own <span id="color-count">${Object.keys(art).length} colorful pieces</span></div><svg class="color-page" viewBox="0 0 500 360" aria-label="Coloring picture for letter ${L()}"><rect data-paint="sky" x="10" y="10" width="480" height="340" rx="40" fill="${art.sky || "#fffdf5"}"/><circle data-paint="sun" cx="410" cy="75" r="35" fill="${art.sun || "#fffdf5"}"/><path data-paint="hill" d="M12 280Q130 185 250 280Q380 190 488 270V310Q488 350 450 350H50Q12 350 12 310Z" fill="${art.hill || "#fffdf5"}"/><text data-paint="letter" x="42" y="230" font-family="sans-serif" font-size="210" font-weight="900" fill="${art.letter || "#fffdf5"}">${L()}</text><path data-paint="apple" d="M318 167C247 113 241 262 288 291Q310 305 331 290Q360 310 385 277C427 215 386 125 318 167Z" fill="${art.apple || "#fffdf5"}"/><path data-paint="leaf" d="M320 162Q322 108 373 118Q365 155 320 162Z" fill="${art.leaf || "#fffdf5"}"/><path data-paint="star" d="M233 40L243 65L270 67L249 85L254 111L232 96L209 111L214 85L193 67L222 64Z" fill="${art.star || "#fffdf5"}"/></svg><div class="paint-palette" aria-label="Paint colors">${colors.map((c, i) => `<button style="--paint:${c}" data-color="${c}" class="${i === 0 ? "selected" : ""}" aria-label="${["Pink", "Orange", "Yellow", "Green", "Blue", "Purple", "Rose", "Cream"][i]}"></button>`).join("")}</div><p class="gentle-hint">Pick a color. Tap a shape. Tell Pip a story about your picture.</p></div>`;
  document.querySelectorAll("[data-color]").forEach(
    (b) =>
      (b.onclick = () => {
        color = b.dataset.color;
        document
          .querySelectorAll("[data-color]")
          .forEach((x) => x.classList.toggle("selected", x === b));
      }),
  );
  document.querySelectorAll("[data-paint]").forEach((el) => {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "Color " + el.dataset.paint);
    const paint = () => {
      el.setAttribute("fill", color);
      art[el.dataset.paint] = color;
      touched.add(el.dataset.paint);
      state.art["color-" + state.letter] = art;
      save();
      document.querySelector("#color-count").textContent =
        Object.keys(art).length + " colorful pieces";
      if (Object.keys(art).length >= 5) finish();
    };
    el.onclick = paint;
    el.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        paint();
      }
    };
  });
  if (Object.keys(art).length >= 5) enableContinue();
}
function drawing(trace) {
  const zone = document.querySelector("#play-zone");
  const name = (trace ? "trace-" : "draw-") + state.letter;
  let strokes = state.art[name] || [],
    active = null,
    color = "#a282cc";
  zone.innerHTML = `<div class="drawing-studio"><div class="game-prompt">${trace ? "Draw " + L() + " with Pip" : "Dream it. Draw it."}<span id="trace-progress">${trace ? "Follow the soft letter guide" : "Your picture is saved as you draw"}</span></div><canvas class="drawing-canvas" width="600" height="400" aria-label="${trace ? "Trace letter " + L() : "Free drawing canvas"}"></canvas><div class="drawing-tools"><button id="undo-draw">↶ Undo</button><button id="clear-draw">Clear</button><button data-pen="#a282cc" style="--paint:#a282cc" aria-label="Purple pen"></button><button data-pen="#eea0b0" style="--paint:#eea0b0" aria-label="Pink pen"></button><button data-pen="#79b99f" style="--paint:#79b99f" aria-label="Green pen"></button><button class="drawing-done" id="drawing-done">${trace ? "I traced it!" : "My picture is ready!"}</button></div><p class="gentle-hint">${trace ? "Start anywhere on the letter. Every little line is practice." : "What did you draw? Tell Pip all about it!"}</p></div>`;
  const canvas = zone.querySelector("canvas"),
    ctx = canvas.getContext("2d");
  const guide = document.createElement("canvas");
  guide.width = 600;
  guide.height = 400;
  const gc = guide.getContext("2d");
  gc.font = "900 330px sans-serif";
  gc.textAlign = "center";
  gc.fillText(L(), 300, 320);
  const pixels = gc.getImageData(0, 0, 600, 400).data;
  const targets = [];
  if (trace)
    for (let y = 55; y < 340; y += 20)
      for (let x = 120; x < 480; x += 20)
        if (pixels[(y * 600 + x) * 4 + 3] > 100) targets.push([x, y]);
  const hits = new Set();
  function redraw() {
    ctx.clearRect(0, 0, 600, 400);
    if (trace) {
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.drawImage(guide, 0, 0);
      ctx.restore();
    }
    for (const stroke of strokes) {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = trace ? 16 : 7;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      stroke.points.forEach(([x, y], i) =>
        i ? ctx.lineTo(x * 600, y * 400) : ctx.moveTo(x * 600, y * 400),
      );
      ctx.stroke();
    }
  }
  function coverage() {
    hits.clear();
    for (const s of strokes)
      for (const [x, y] of s.points)
        targets.forEach(([tx, ty], i) => {
          if (Math.hypot(x * 600 - tx, y * 400 - ty) < 25) hits.add(i);
        });
    const pct = targets.length ? hits.size / targets.length : 0;
    zone.querySelector("#trace-progress").textContent =
      Math.round(pct * 100) + "% of the letter explored";
    zone.querySelector("#drawing-done").disabled = trace
      ? pct < 0.35
      : strokes.reduce((n, s) => n + s.points.length, 0) < 10;
  }
  const point = (e) => {
    const r = canvas.getBoundingClientRect();
    return [
      Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
    ];
  };
  canvas.onpointerdown = (e) => {
    canvas.setPointerCapture(e.pointerId);
    active = { color, points: [point(e)] };
    strokes.push(active);
    redraw();
  };
  canvas.onpointermove = (e) => {
    if (!active) return;
    active.points.push(point(e));
    redraw();
  };
  function up() {
    if (!active) return;
    active = null;
    state.art[name] = strokes;
    save();
    coverage();
  }
  canvas.onpointerup = up;
  canvas.onpointercancel = up;
  zone.querySelector("#undo-draw").onclick = () => {
    strokes.pop();
    state.art[name] = strokes;
    save();
    redraw();
    coverage();
  };
  zone.querySelector("#clear-draw").onclick = () => {
    strokes = [];
    state.art[name] = strokes;
    save();
    redraw();
    coverage();
  };
  zone
    .querySelectorAll("[data-pen]")
    .forEach((b) => (b.onclick = () => (color = b.dataset.pen)));
  zone.querySelector("#drawing-done").onclick = () => {
    finish();
    zone.querySelector(".gentle-hint").textContent = trace
      ? "A wonderful trail. Try it again, big or small!"
      : "A one-of-a-kind masterpiece. Pip loves your imagination!";
  };
  redraw();
  coverage();
}
function sorting() {
  const zone = document.querySelector("#play-zone");
  let round = 0;
  function load() {
    const correct = [0, 2, 4].map((i) => ({
      name: vocabulary[state.letter][i],
      emoji: vocabulary[state.letter][i + 1],
      yes: true,
    }));
    const wrong = [0, 2, 4].map((i) => ({
      name: vocabulary[(state.letter + 1 + round) % 26][i],
      emoji: vocabulary[(state.letter + 1 + round) % 26][i + 1],
      yes: false,
    }));
    let found = 0;
    zone.innerHTML = `<div class="sort-game"><div class="game-prompt">What belongs with ${L()}?<span>Basket ${round + 1} / 2</span></div><div class="sort-grid">${shuffle(
      [...correct, ...wrong],
    )
      .map(
        (x, i) =>
          `<button data-sort="${x.yes}"><span>${x.emoji}</span><small>${x.name}</small></button>`,
      )
      .join(
        "",
      )}</div><div class="letter-basket">${L()}<span id="basket-items">Find 3 things</span></div><p class="gentle-hint" role="status">Say each word slowly. What do you notice?</p></div>`;
    zone.querySelectorAll("[data-sort]").forEach(
      (b) =>
        (b.onclick = () => {
          if (b.dataset.sort === "true") {
            b.disabled = true;
            b.classList.add("collected");
            found++;
            zone.querySelector("#basket-items").textContent =
              found + " / 3 collected";
            pipAction("hop", 1000);
            if (found === 3) {
              if (round === 0) {
                const next = document.createElement("button");
                next.className = "play-pill";
                next.textContent = "Another basket →";
                next.onclick = () => {
                  round++;
                  load();
                };
                zone.append(next);
              } else {
                finish();
                zone.querySelector(".gentle-hint").textContent =
                  "Two baskets of brilliant discoveries!";
              }
            }
          } else {
            b.classList.add("wobble");
            setTimeout(() => b.classList.remove("wobble"), 500);
            zone.querySelector(".gentle-hint").textContent =
              b.querySelector("small").textContent +
              " starts with a different letter. Keep exploring!";
          }
        }),
    );
  }
  load();
}
function memory() {
  const zone = document.querySelector("#play-zone");
  const vocab = vocabulary[state.letter];
  const pairs = [
    { key: 0, value: L() },
    { key: 0, value: L().toLowerCase() },
    ...Array.from({ length: 3 }, (_, i) => [
      { key: i + 1, value: vocab[i * 2 + 1] },
      { key: i + 1, value: vocab[i * 2 + 1] },
    ]).flat(),
  ];
  let open = [],
    matched = 0,
    locked = false;
  zone.innerHTML = `<div class="memory-game"><div class="game-prompt">Find our matching friends<span id="memory-count">0 / 4 pairs</span></div><div class="memory-grid">${shuffle(
    pairs,
  )
    .map(
      (c, i) =>
        `<button class="memory-card" data-pair="${c.key}" aria-label="Turn over card ${i + 1}"><span class="card-back">✦</span><span class="card-front">${c.value}</span></button>`,
    )
    .join(
      "",
    )}</div><p class="gentle-hint" role="status">Turn over two. Remember where they live!</p></div>`;
  zone.querySelectorAll("[data-pair]").forEach(
    (b) =>
      (b.onclick = () => {
        if (locked || b.classList.contains("flipped") || b.disabled) return;
        b.classList.add("flipped");
        b.setAttribute(
          "aria-label",
          b.querySelector(".card-front").textContent,
        );
        open.push(b);
        if (open.length === 2) {
          locked = true;
          const [a, c] = open;
          if (a.dataset.pair === c.dataset.pair) {
            a.disabled = c.disabled = true;
            matched++;
            zone.querySelector("#memory-count").textContent =
              matched + " / 4 pairs";
            open = [];
            locked = false;
            pipAction("hop", 900);
            if (matched === 4) {
              finish();
              zone.querySelector(".gentle-hint").textContent =
                "You remembered every friend!";
            }
          } else
            setTimeout(() => {
              if (!b.isConnected) return;
              open.forEach((x) => {
                x.classList.remove("flipped");
                x.setAttribute("aria-label", "Turn over card");
              });
              open = [];
              locked = false;
            }, 1000);
        }
      }),
  );
}
function song() {
  const zone = document.querySelector("#play-zone");
  const verses = [...new Set([...state.verses, state.letter])].sort(
    (a, b) => a - b,
  );
  zone.innerHTML = `<div class="song-studio"><div class="song-orb">♫<span>${L()}</span></div><h2>One letter. One new verse.</h2><p class="song-lyric">${L()}, ${L()}, ${L()}!<br>${L()} is for ${word()}!<br><small>Wiggle to the left. Wiggle to the right.<br>${L()}, ${L()}, ${L()}! You got it right!</small></p><button class="play-pill" id="chant-letter">♫ Chant & dance with Pip</button><div class="song-collection">${verses.map((i) => `<span data-verse="${i}">${alphabet[i]}</span>`).join("")}</div><button class="text-button" id="whole-song">Play our ${verses.length}-verse adventure</button><p class="gentle-hint">A growing collection of spoken rhythmic chants.<br>Make up your own melody together!</p></div>`;
  zone.querySelector("#chant-letter").onclick = () => {
    if (chanting) {
      stopPipVoice();
      chanting = false;
      zone.querySelector("#chant-letter").textContent =
        "♫ Chant & dance with Pip";
      return;
    }
    finish();
    if (!state.verses.includes(state.letter)) {
      state.verses.push(state.letter);
      save();
    }
    chanting = true;
    zone.querySelector("#chant-letter").textContent = "■ Stop chant";
    pipAction("chant", 12000);
    say(chant()).then(() => {
      if (zone.isConnected) {
        chanting = false;
        zone.querySelector("#chant-letter").textContent =
          "♫ Chant & dance with Pip";
      }
    });
  };
  zone.querySelector("#whole-song").onclick = async () => {
    if (muted) {
      document.querySelector("#pip-caption").textContent =
        "Voice is muted. You can still make up your own tune with Pip!";
      finish();
      return;
    }
    stopPipVoice();
    chanting = true;
    const myEpoch = epoch;
    for (const i of verses) {
      if (epoch !== myEpoch || !chanting) return;
      zone
        .querySelectorAll("[data-verse]")
        .forEach((el) =>
          el.classList.toggle("singing", +el.dataset.verse === i),
        );
      pipAction("chant", 12000);
      const ok = await say(chant(i));
      if (!ok) break;
    }
    if (epoch === myEpoch) {
      chanting = false;
      zone
        .querySelectorAll("[data-verse]")
        .forEach((el) => el.classList.remove("singing"));
      finish();
    }
  };
}
function review() {
  const zone = document.querySelector("#play-zone");
  let round = 0;
  function next() {
    const target = round === 1 ? L().toLowerCase() : L();
    const choices = shuffle([
      target,
      ...shuffle(alphabet.filter((x) => x !== L()))
        .slice(0, 2)
        .map((x) => (round === 1 ? x.toLowerCase() : x)),
    ]);
    zone.innerHTML = `<div class="review-game"><div class="review-object">${round === 2 ? vocabulary[state.letter][1] : target}</div><h2>${round === 2 ? "Which letter starts " + word() + "?" : "Find " + target + " for Pip!"}</h2><div class="episode-answers">${choices.map((x) => `<button data-review="${x}">${x}</button>`).join("")}</div><p class="gentle-hint" role="status">${round + 1} / 3 little discoveries</p></div>`;
    zone.querySelectorAll("[data-review]").forEach(
      (b) =>
        (b.onclick = () => {
          if (b.dataset.review === target) {
            b.disabled = true;
            round++;
            pipAction("hop", 1200);
            if (round === 3) {
              finish();
              zone.querySelector(".gentle-hint").textContent =
                "You did it! Pip has a surprise for you.";
            } else next();
          } else {
            zone.querySelector(".gentle-hint").textContent =
              "A different letter! Try another one.";
            pipAction("wave", 1000);
          }
        }),
    );
  }
  next();
}
function pause() {
  document
    .querySelectorAll(
      ".episode-top,.episode-title,.performance,.episode-bottom",
    )
    .forEach((el) => (el.inert = true));
  stopPipVoice();
  chanting = false;
  const overlay = document.querySelector("#overlay");
  overlay.innerHTML = `<div class="pause-shade"><section class="pause-panel" role="dialog" aria-modal="true" aria-labelledby="pause-title"><span>YOUR ADVENTURE IS SAVED</span><h2 id="pause-title">A little pause.</h2><p>Letter ${L()} · Chapter ${state.chapter + 1} of 12<br>${state.stars} discoveries with Pip</p><p class="pacing-note">Each letter has 12 chapters, with about 60 minutes of suggested play, conversation, movement, and creativity. Go at your own pace. No waiting timers.</p><button class="play-pill" id="resume">Back to our adventure →</button><button class="text-button" id="toggle-voice">${muted ? "Turn Pip’s voice on" : "Mute Pip’s voice"}</button><button class="text-button" id="toggle-calm">${document.documentElement.dataset.calm ? "Turn movement on" : "Make things calmer"}</button><small>Progress and pictures stay in this browser.</small></section></div>`;
  overlay.querySelector("#resume").onclick = () => {
    overlay.innerHTML = "";
    document.querySelectorAll("[inert]").forEach((el) => (el.inert = false));
    document.querySelector("#pause").focus();
  };
  overlay.querySelector("#toggle-voice").onclick = () => {
    muted = !muted;
    document.querySelector("#hear-pip").textContent = muted
      ? "♪ Voice muted"
      : "♫ Hear Pip";
    pause();
  };
  overlay.querySelector("#toggle-calm").onclick = () => {
    if (document.documentElement.dataset.calm)
      delete document.documentElement.dataset.calm;
    else document.documentElement.dataset.calm = "true";
    pause();
  };
  overlay.querySelector("#resume").focus();
  save();
}
function finale() {
  document.querySelector("#play-zone").innerHTML =
    `<div class="finale"><h2>26 letters.<br>One extraordinary team.</h2><p>You and Pip built an alphabet adventure.</p><button class="play-pill" id="play-finale">Our alphabet collection ♫</button></div>`;
  document.querySelector("#play-finale").onclick = () => {
    state.chapter = 8;
    scene();
  };
  document.querySelector("#continue").disabled = true;
  save();
}
export function bootEpisode() {
  scene();
  startPip();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopPipVoice();
      chanting = false;
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const overlay = document.querySelector("#overlay");
      if (overlay.innerHTML) {
        overlay.innerHTML = "";
        document
          .querySelectorAll("[inert]")
          .forEach((el) => (el.inert = false));
        document.querySelector("#pause").focus();
      } else pause();
    }
  });
}
