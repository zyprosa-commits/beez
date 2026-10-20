import "./style.css";
import { pipMarkup, startPip, setPipSpeech } from "./pip.js";
const letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const words = [
  "Apple 🍎",
  "Butterfly 🦋",
  "Cat 🐱",
  "Dog 🐶",
  "Elephant 🐘",
  "Fox 🦊",
  "Giraffe 🦒",
  "House 🏠",
  "Ice cream 🍦",
  "Jellyfish 🪼",
  "Kite 🪁",
  "Lion 🦁",
  "Moon 🌙",
  "Nest 🪺",
  "Owl 🦉",
  "Penguin 🐧",
  "Queen 👑",
  "Rainbow 🌈",
  "Sun ☀️",
  "Tree 🌳",
  "Umbrella ☂️",
  "Violin 🎻",
  "Whale 🐳",
  "X-ray 🩻",
  "Yo-yo 🪀",
  "Zebra 🦓",
];
let progress;
try {
  progress = JSON.parse(localStorage.getItem("letterwood")) || {
    stars: 0,
    done: [],
  };
} catch {
  progress = { stars: 0, done: [] };
}
let sound = true,
  letter = 0,
  mode = "learn";
let episodeStep = -1;
let speechId = 0;
const fox = () => pipMarkup(progress.stars >= 10, progress.stars >= 3);
let currentUtterance = null;
function stopVoice() {
  speechId++;
  currentUtterance = null;
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  setPipSpeech(false);
}
function speak(t) {
  stopVoice();
  if (!sound || !("speechSynthesis" in window)) return;
  const id = speechId;
  const u = new SpeechSynthesisUtterance(t);
  currentUtterance = u;
  const voices = speechSynthesis
    .getVoices()
    .filter((v) => /^en[-_]/i.test(v.lang));
  // Prefer expressive, natural English voices; use the device's English voice as fallback.
  const voice = voices
    .map((v) => ({
      v,
      score:
        (/natural|neural|premium|enhanced/i.test(v.name) ? 30 : 0) +
        (/jenny|aria|samantha|google uk english female|karen|moira|susan/i.test(
          v.name,
        )
          ? 20
          : 0) +
        (/en-US|en-GB/i.test(v.lang) ? 5 : 0),
    }))
    .sort((a, b) => b.score - a.score)[0]?.v;
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else u.lang = "en-US";
  u.rate = 0.9;
  u.pitch = 1.16;
  u.volume = 1;
  const finish = () => {
    if (id === speechId) {
      setPipSpeech(false);
      currentUtterance = null;
    }
  };
  u.onstart = () => {
    if (id === speechId) setPipSpeech(true, t);
  };
  u.onboundary = () => {
    if (id === speechId) setPipSpeech(true, t);
  };
  u.onpause = () => {
    if (id === speechId) setPipSpeech(false);
  };
  u.onresume = () => {
    if (id === speechId) setPipSpeech(true, t);
  };
  u.onend = finish;
  u.onerror = finish;
  speechSynthesis.speak(u);
}
function render() {
  document.querySelector("#app").innerHTML =
    `<aside><a class="brand" href="#"><span>✳</span>letterwood<sup>®</sup></a><div class="world-label">A LITTLE LETTER MAGIC</div><nav><button class="nav active" data-page="home"><i>⌂</i>My magical world</button><button class="nav" data-page="learn"><i>Aa</i>Alphabet garden</button><button class="nav" data-page="quiz"><i>✿</i>Play & discover <small>NEW</small></button><button class="nav" data-page="achievements"><i>♜</i>My achievements</button></nav><div class="sidebar-bottom"><div class="pip-mini">${fox()}<b>A little every day.<br>A whole world of wonder.</b></div><button class="sound" id="sound">${sound ? "♫ Sounds on" : "♪ Sounds off"}<span class="toggle ${sound ? "on" : ""}"></span></button><p>Made for little explorers ♡</p></div></aside><main><header><div>Your adventure <span>/</span> <b>Letterwood</b></div><div class="header-right"><span class="star-total">✦ <b>${progress.stars}</b> magic stars</span><div class="avatar">🌱</div><span>Little explorer <small>Ready to grow!</small></span></div></header><div class="page"><div class="welcome"><div><div class="eyebrow">LET CURIOSITY LEAD THE WAY <span>✧</span></div><h1>A little letter.<br>A big <em>adventure.</em></h1><p>Wonderful words, playful discoveries, and a friend<br>to grow with. Your magical journey starts here.</p></div><span class="date-pill">☀ A lovely day to learn</span></div><section class="hero"><div class="hero-copy"><span class="pill">✦ YOUR NEXT LITTLE ADVENTURE</span><h2>Into the<br>Alphabet Garden</h2><p>Every letter has a story.<br>Let’s discover them together!</p><button class="primary" id="start">Let’s explore <span>↗</span></button><div class="hero-note">🌼 🦋 🍄 <span>A world of 26 happy discoveries</span></div></div><div class="landscape"><div class="sun"></div><span class="cloud c1"></span><span class="cloud c2"></span><span class="spark s1">✧</span><span class="spark s2">✦</span><span class="floating-letter la">A</span><span class="floating-letter lb">b</span><span class="floating-letter lc">c</span><div class="hill back"></div><div class="hill front"></div><div class="tree t1">♠</div><div class="tree t2">♠</div><span class="flower f1">✿</span><span class="flower f2">✿</span><span class="flower f3">✿</span><span class="mushroom">🍄</span><div class="hero-fox">${fox()}<div class="fox-tag">Pip, your adventure buddy ♡</div></div><div class="speech">Hi, I’m Pip!<br><b>Let’s grow together.</b><span>♡</span></div><span class="butterfly">🦋</span></div></section><section class="adventure-section"><div class="section-title"><h3>A little play, a lot of possibility <span>✧</span></h3><span>BIG DISCOVERIES START SMALL</span></div><div class="cards"><button class="activity-card garden" data-action="learn"><div class="card-art"><span class="abc a">A</span><span class="abc b">b</span><span class="abc c">c</span><span class="art-flower">✿</span><span class="art-spark">✧</span></div><span class="card-kicker">MEET THE LETTERS</span><h4>Alphabet Garden <span>↗</span></h4><p>26 letters. Endless wonder.</p><div class="card-bottom"><span>🌱 ${progress.done.length} / 26 discovered</span><span class="progress"><i style="width:${(progress.done.length / 26) * 100}%"></i></span></div></button><button class="activity-card sounds" data-action="quiz"><div class="card-art"><span class="music m1">♪</span><span class="sound-creature">🐥</span><span class="music m2">♫</span><span class="art-spark">✦</span></div><span class="card-kicker">LISTEN & DISCOVER</span><h4>Letter Sound Safari <span>↗</span></h4><p>Little sounds. Happy aha moments.</p><div class="card-bottom"><span>♫ Listen, guess & giggle</span><span>→</span></div></button><button class="activity-card match" data-action="match"><div class="card-art"><span class="match-tile">A</span><span class="apple">🍎</span><span class="match-line">⌁</span><span class="art-spark">✧</span></div><span class="card-kicker">MAKE A CONNECTION</span><h4>Match & Magic <span>↗</span></h4><p>A perfect pair is waiting for you.</p><div class="card-bottom"><span>✧ A sprinkle of brain magic</span><span>→</span></div></button></div></section><section class="growth"><div class="growth-icon">🌿</div><div><h3>Small steps. Magical growth.</h3><p>Every discovery helps Pip grow. Look how far you’ll go together!</p></div><div class="growth-stages"><span>🌱<small>Little sprout</small></span><i>·····</i><span class="${progress.stars < 3 ? "locked" : ""}">🌼<small>Curious cub</small></span><i>·····</i><span class="${progress.stars < 10 ? "locked" : ""}">🌳<small>Brave explorer</small></span></div><button id="journey">Our journey ↗</button></section><footer><span>Lovingly made for little minds with big imaginations.</span><span>Take your time. The magic is in the discovering. ✧</span></footer></div></main><dialog id="activity"><div id="modal-content"></div></dialog>`;
  document.querySelector("#start").onclick = () => open("learn");
  document
    .querySelectorAll("[data-action]")
    .forEach((b) => (b.onclick = () => open(b.dataset.action)));
  document.querySelector("#journey").onclick = achievements;
  document.querySelector("#sound").onclick = () => {
    sound = !sound;
    if (!sound) stopVoice();
    render();
  };
  document.querySelectorAll("[data-page]").forEach(
    (b) =>
      (b.onclick = () => {
        if (b.dataset.page === "achievements") achievements();
        else if (b.dataset.page !== "home") open(b.dataset.page);
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }),
  );
}
function shell(html) {
  document.querySelector("#modal-content").innerHTML =
    `<button class="close" aria-label="Close activity">×</button>${html}`;
  document.querySelector(".close").onclick = () => {
    stopVoice();
    document.querySelector("dialog").close();
    render();
  };
  document.querySelector("dialog").classList.remove("episode-dialog");
  if (!document.querySelector("dialog").open)
    document.querySelector("dialog").showModal();
}
function open(m, n = letter) {
  mode = m;
  letter = n;
  let word = words[n].split(" ").slice(0, -1).join(" "),
    emoji = words[n].split(" ").at(-1);
  if (m === "learn") {
    shell(
      `<span class="eyebrow">THE ALPHABET GARDEN</span><h2>Say hello to ${letters[n]}!</h2><div class="lesson"><div class="lesson-letter">${letters[n]}<small>${letters[n].toLowerCase()}</small></div><div class="lesson-object">${emoji}<b>${word}</b></div></div><div class="buddy-line">${fox()}<p>“${letters[n]} is for ${word.toLowerCase()}! Tap a letter and explore with me.”</p></div><div class="letter-grid">${letters.map((x, i) => `<button class="${i === n ? "selected" : ""} ${progress.done.includes(i) ? "discovered" : ""}" data-letter="${i}">${x}</button>`).join("")}</div><div class="modal-actions"><button class="secondary" id="listen">♫ Hear the letter</button><button class="primary" id="discover">${progress.done.includes(n) ? "Next letter →" : "I learned it! ✦"}</button></div>`,
    );
    document.querySelectorAll("[data-letter]").forEach(
      (b) =>
        (b.onclick = () => {
          open("learn", +b.dataset.letter);
          speak(
            letters[letter] +
              ". " +
              words[letter].split(" ").slice(0, -1).join(" "),
          );
        }),
    );
    document.querySelector("#listen").onclick = () =>
      speak(`${letters[n]}. ${letters[n]} is for ${word}`);
    document.querySelector("#discover").onclick = () => {
      if (!progress.done.includes(n)) {
        progress.done.push(n);
        reward("You discovered " + letters[n] + "!");
      } else open("learn", (n + 1) % 26);
    };
  } else {
    letter = Math.floor(Math.random() * 26);
    const target = letter;
    let choices = [
      target,
      ...letters
        .map((_, i) => i)
        .filter((i) => i !== target)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3),
    ].sort(() => Math.random() - 0.5);
    shell(
      `<span class="eyebrow">${m === "quiz" ? "LETTER SOUND SAFARI" : "MATCH & MAGIC"}</span><h2>${m === "quiz" ? "Listen closely, little explorer!" : "Find the perfect pair!"}</h2><div class="buddy-line">${fox()}<p>${m === "quiz" ? "“Tap the sound button, then find the letter you hear!”" : `“Which letter does ${words[target].split(" ").slice(0, -1).join(" ")} start with?”`}</p></div>${m === "quiz" ? '<button class="listen-big" id="quiz-sound">♫<small>Play my letter</small></button>' : `<div class="quiz-object">${words[target].split(" ").at(-1)}<small>${words[target].split(" ").slice(0, -1).join(" ")}</small></div>`}<div class="answer-grid">${choices.map((i) => `<button data-answer="${i}">${letters[i]}</button>`).join("")}</div><p id="feedback" role="status">Pip is cheering you on. You’ve got this! ♡</p>`,
    );
    if (m === "quiz")
      document.querySelector("#quiz-sound").onclick = () =>
        speak(letters[target]);
    let locked = false;
    document.querySelectorAll("[data-answer]").forEach(
      (b) =>
        (b.onclick = () => {
          if (locked) return;
          if (+b.dataset.answer === target) {
            locked = true;
            b.classList.add("correct");
            speak("Wonderful! You found it!");
            setTimeout(() => {
              if (b.isConnected && document.querySelector("dialog").open)
                reward("A magical match!");
            }, 600);
          } else {
            b.classList.add("incorrect");
            document.querySelector("#feedback").textContent =
              "A little more exploring! Try another letter. ♡";
            speak("Try again. I believe in you!");
          }
        }),
    );
  }
}
function reward(title) {
  progress.stars++;
  localStorage.setItem("letterwood", JSON.stringify(progress));
  shell(
    `<div class="celebration"><div class="reward-star">✦</div><span class="eyebrow">A LITTLE MOMENT OF MAGIC</span><h2>${title}</h2>${fox()}<p>You earned a magic star!<br>${progress.stars === 3 ? "Pip grew a magical crown!" : progress.stars >= 10 ? "You and Pip are brave explorers now!" : "Pip is growing with every discovery."}</p><div class="reward-count">✦ ${progress.stars} magic stars</div><button class="primary" id="continue">Keep discovering →</button></div>`,
  );
  document.querySelector("#continue").onclick = () =>
    open(mode, (letter + 1) % 26);
}
function achievements() {
  shell(
    `<span class="eyebrow">OUR GROWING STORY</span><h2>Look how far we’ve come.</h2><div class="achievement-pip">${fox()}</div><p class="center">${progress.stars < 3 ? "A little sprout with a big imagination." : progress.stars < 10 ? "A curious cub with a magical crown!" : "A brave explorer. A world of possibilities!"}<br>${progress.stars} magic stars · ${progress.done.length} letters discovered</p><div class="badges">${[
      ["🌱", "First steps", 1],
      ["👑", "Curious cub", 3],
      ["🌳", "Brave explorer", 10],
      ["🌈", "Alphabet hero", 26],
    ]
      .map(
        ([e, t, n]) =>
          `<div class="badge ${progress.stars >= n ? "earned" : ""}"><span>${e}</span><b>${t}</b><small>${n} magic stars</small></div>`,
      )
      .join(
        "",
      )}</div><p class="center">Every small discovery is something to celebrate. ♡</p>`,
  );
}
const originalRender = render;
render = function () {
  originalRender();
  mountWorld();
};
function mountWorld() {
  const sidebar = document.querySelector("aside");
  const header = document.querySelector("header");
  const brand = sidebar.querySelector(".brand");
  const dock = sidebar.querySelector("nav");
  header.firstElementChild.remove();
  header.prepend(brand);
  dock.classList.add("world-dock");
  document.querySelector("main").append(dock);
  sidebar.remove();
  const navIcons = [
    '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    '<path d="M4 20 10 4h3l6 16M7 14h9M19 4v5m-2-2h4"/>',
    '<path d="m9 3-2 6-5 3 5 3 2 6 3-6 6-3-6-3zM19 2v5m-2-3h5"/>',
    '<path d="M8 3h8v7a4 4 0 0 1-8 0zM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v6m-4 0h8"/>',
  ];
  dock.querySelectorAll("button").forEach((b, i) => {
    b.addEventListener("click", () => {
      dock
        .querySelectorAll("button")
        .forEach((item) => item.classList.remove("active"));
      b.classList.add("active");
    });
    b.querySelector("i").innerHTML =
      `<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${navIcons[i]}</svg>`;
    b.querySelector("small")?.remove();
  });
  document.querySelector(".welcome").innerHTML =
    `<div><div class="eyebrow"><span class="live-dot"></span> YOUR IMAGINATION. NO LIMITS.</div><h1>Small explorer.<br><em>Extraordinary world.</em></h1><p>Follow your curiosity. Pip will show you the way.</p></div><div class="daily-orbit"><div class="orbit-ring" style="--completion:${Math.min((progress.done.length / 26) * 100, 100)}%"><span>✦</span></div><div><span>YOUR LITTLE BIG JOURNEY</span><strong>${progress.done.length} of 26 discoveries</strong><small>Every little step is a superpower.</small></div></div>`;
  document.querySelector(".hero").outerHTML =
    `<section class="adventure-world" aria-label="Interactive Letterwood adventure map"><div class="world-sky"><div class="world-sun"><span>• ◡ •</span></div><div class="puffy cloud-one"></div><div class="puffy cloud-two"></div><div class="rainbow"></div></div><svg class="world-scenery" viewBox="0 0 1200 620" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="grass" x2="0" y2="1"><stop stop-color="#a8e46d"/><stop offset="1" stop-color="#53ba66"/></linearGradient></defs><path d="M0 280 Q160 150 340 285 Q560 110 820 260 Q1050 150 1200 250V620H0Z" fill="#9ad88d"/><path d="M0 365 Q200 225 440 360 Q680 200 920 350 Q1100 260 1200 320V620H0Z" fill="url(#grass)"/><path d="M1270 410 Q900 335 818 402 Q745 480 593 451 Q418 411 443 523 Q462 580 263 640" fill="none" stroke="#d09645" stroke-width="65"/><path d="M1270 403 Q900 328 818 395 Q745 473 593 444 Q418 404 443 516 Q462 573 263 633" fill="none" stroke="#ffe2a0" stroke-width="54"/><path d="M0 495 Q112 438 250 500L290 620H0Z" fill="#3ca45d"/><path d="M1050 580 Q1115 480 1240 501V620H1020Z" fill="#2fa365"/><g fill="#ffdd68"><circle cx="94" cy="475" r="8"/><circle cx="108" cy="462" r="8"/><circle cx="121" cy="477" r="8"/><circle cx="108" cy="488" r="8"/></g><g fill="#fff8d3"><circle cx="1080" cy="524" r="7"/><circle cx="1093" cy="513" r="7"/><circle cx="1105" cy="526" r="7"/><circle cx="1092" cy="537" r="7"/></g></svg><div class="world-tree tree-left"><span></span></div><div class="world-tree tree-right"><span></span></div><div class="scene-leaves leaves-left">❧</div><div class="scene-leaves leaves-right">❧</div><button class="map-stop stop-garden" data-mission="0"><span class="stop-building">🌻<b>A b c</b></span><strong>Alphabet Garden</strong><small>1 · Find the lost letter</small></button><button class="map-stop stop-river" data-mission="1"><span class="stop-building">🌊<b>♫</b></span><strong>Whispering River</strong><small>2 · Listen to the magic</small></button><button class="map-stop stop-castle" data-mission="2"><span class="stop-building">🏰<b>✦</b></span><strong>Rainbow Castle</strong><small>3 · Unlock the rainbow</small></button><div class="world-pip"><button id="pip-talk" aria-label="Talk to Pip">${fox()}</button><span class="pip-name">PIP <span>YOUR COSMICALLY CURIOUS COMPANION</span></span></div><div class="world-bubble" role="status"><span class="bubble-label">PIP SAYS…</span><p id="pip-line">Hey, explorer! Ready for a little magic?<br>Let’s bring the rainbow back together.</p><button id="begin-episode">Start our adventure <span>➜</span></button></div><button class="world-critter critter-butterfly" aria-label="Say hello to Bella the butterfly">🦋</button><button class="world-critter critter-bird" aria-label="Say hello to Sunny the bird">🐥</button><div class="world-sign">THE MAGIC STARTS HERE<br><b>Wonder Valley</b></div><span class="firefly firefly-one">✦</span><span class="firefly firefly-two">✦</span><span class="firefly firefly-three">✦</span><div class="episode-label">✦ EPISODE 01 <span>The missing rainbow</span></div></section>`;
  if (progress.rainbow)
    document
      .querySelector(".adventure-world")
      .classList.add("rainbow-restored");
  const soundControl = document.createElement("button");
  soundControl.className = "map-sound";
  soundControl.id = "world-sound";
  soundControl.textContent = sound ? "♫ Sound on" : "♪ Sound off";
  soundControl.setAttribute("aria-label", "Toggle sound");
  header.querySelector(".header-right").prepend(soundControl);
  soundControl.onclick = () => {
    sound = !sound;
    if (!sound) stopVoice();
    render();
  };
  document.querySelector("#begin-episode").onclick = () => startEpisode(0);
  document
    .querySelectorAll("[data-mission]")
    .forEach((b) => (b.onclick = () => startEpisode(+b.dataset.mission)));
  document.querySelector("#pip-talk").onclick = () => {
    speak(
      "Hi explorer! I am Pip! The rainbow needs our help. First the garden, then the river, then the castle! Let us go!",
    );
    document.querySelector(".world-pip").classList.remove("pip-hop");
    void document.querySelector(".world-pip").offsetWidth;
    document.querySelector(".world-pip").classList.add("pip-hop");
  };
  document.querySelector(".critter-butterfly").onclick = () => {
    document.querySelector("#pip-line").textContent =
      "Bella says: butterfly begins with B! Can you say B with us?";
    speak("Hi! I am Bella. Butterfly begins with B! Can you say B?");
  };
  document.querySelector(".critter-bird").onclick = () => {
    document.querySelector("#pip-line").textContent =
      "Sunny says: tweet, tweet! Meet me at the river for a listening game!";
    speak("Tweet tweet! I am Sunny! Let us listen for letters at the river!");
  };
  document.querySelector(".section-title h3").innerHTML =
    "A world of <em>what if?</em>";
  document.querySelector(".section-title>span").textContent =
    "PICK YOUR KIND OF MAGIC";
  document.querySelector(".growth h3").textContent =
    progress.stars >= 10 ? "Meet your brave explorer." : "You grow. Pip glows.";
  document.querySelectorAll(".activity-card").forEach((card) => {
    card.onpointermove = (e) => {
      if (
        e.pointerType === "touch" ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const r = card.getBoundingClientRect();
      card.style.setProperty(
        "--tilt-x",
        ((e.clientY - r.top) / r.height - 0.5) * -5 + "deg",
      );
      card.style.setProperty(
        "--tilt-y",
        ((e.clientX - r.left) / r.width - 0.5) * 5 + "deg",
      );
    };
    card.onpointerleave = () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };
  });
  const world = document.querySelector(".adventure-world");
  world.addEventListener("click", (e) => {
    if (
      e.target.closest("button") ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = world.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement("span");
      dot.className = "touch-spark";
      dot.textContent = "✦";
      dot.style.cssText = `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;--angle:${i * 72}deg`;
      world.append(dot);
      setTimeout(() => dot.remove(), 800);
    }
  });
}
const scenes = [
  {
    title: "The garden gate is stuck!",
    text: "Look! An apple is blocking the gate. Which letter does apple start with? Point to it so we can go through!",
    object: "🍎",
    answer: "A",
    choices: ["A", "B", "C"],
    place: "ALPHABET GARDEN",
    win: "A is for apple! The gate is open. One rainbow color is back!",
    color: "#ff9c8d",
  },
  {
    title: "What is the river whispering?",
    text: "Shhh! The river is saying a letter. Listen with me, then choose the letter you hear.",
    object: "🌊",
    answer: "B",
    choices: ["D", "B", "P"],
    place: "WHISPERING RIVER",
    win: "You heard B! The river made us a bridge. Another rainbow color!",
    color: "#91d9ff",
  },
  {
    title: "One last spell for the castle!",
    text: "We made it! The castle needs a sun to light up the rainbow. What letter does sun start with?",
    object: "☀️",
    answer: "S",
    choices: ["M", "C", "S"],
    place: "RAINBOW CASTLE",
    win: "S is for sun! You brought back the rainbow! We did it together!",
    color: "#ffe16d",
  },
];
function startEpisode(step) {
  episodeStep = step;
  const scene = scenes[step];
  shell(
    `<div class="episode-scene scene-${step}"><div class="episode-hud"><span>THE MISSING RAINBOW</span><span>${[0, 1, 2].map((i) => `<i class="${i <= step ? "lit" : ""}">✦</i>`).join("")}</span></div><div class="scene-place">${scene.place}</div><h2>${scene.title}</h2><div class="scene-prop">${scene.object}</div><div class="episode-pip">${fox()}</div><div class="episode-dialogue"><span>PIP</span><p>${scene.text}</p><button id="repeat-pip" aria-label="Hear Pip’s instructions again">♫ Hear Pip</button></div>${step === 1 ? '<button class="river-listen" id="river-listen">♫ Listen to the river</button>' : ""}<div class="episode-answers">${scene.choices.map((c) => `<button data-episode-answer="${c}" aria-label="Letter ${c}">${c}</button>`).join("")}</div><p class="episode-feedback" role="status">Take your time. We’re a team! ♡</p></div>`,
  );
  document.querySelector("dialog").classList.add("episode-dialog");
  document.querySelector("#repeat-pip").onclick = () => speak(scene.text);
  if (step === 1)
    document.querySelector("#river-listen").onclick = () =>
      speak("B. B. Can you find B?");
  speak(scene.text);
  let locked = false;
  document.querySelectorAll("[data-episode-answer]").forEach(
    (b) =>
      (b.onclick = () => {
        if (locked) return;
        if (b.dataset.episodeAnswer !== scene.answer) {
          b.classList.add("try-again");
          setTimeout(() => b.classList.remove("try-again"), 500);
          document.querySelector(".episode-feedback").textContent =
            "Almost! Let’s try another one together.";
          speak("Almost! Let us try another one together.");
          return;
        }
        locked = true;
        b.classList.add("episode-correct");
        document.querySelector(".episode-feedback").textContent =
          "Yes! You found it!";
        speak(scene.win);
        progress.stars++;
        if (!progress.done.includes(letters.indexOf(scene.answer)))
          progress.done.push(letters.indexOf(scene.answer));
        localStorage.setItem("letterwood", JSON.stringify(progress));
        setTimeout(() => {
          if (b.isConnected && document.querySelector("dialog").open)
            episodeWin(step);
        }, 900);
      }),
  );
}
function episodeWin(step) {
  if (step === 2) {
    progress.rainbow = true;
    localStorage.setItem("letterwood", JSON.stringify(progress));
  }
  const scene = scenes[step];
  shell(
    `<div class="episode-win"><div class="confetti">${Array.from({ length: 24 }, (_, i) => `<i style="--n:${i};--confetti:${["#ff8fa4", "#ffe16d", "#8de2d7", "#ac91ed"][i % 4]}">✦</i>`).join("")}</div><div class="win-rainbow">🌈</div><span class="eyebrow">${step === 2 ? "EPISODE COMPLETE!" : "RAINBOW MAGIC RESTORED!"}</span><h2>${step === 2 ? "We did it, explorer!" : "Teamwork makes magic!"}</h2><div class="win-pip">${fox()}</div><p>${scene.win}</p><div class="reward-count">✦ ${progress.stars} magic stars</div><button class="primary" id="next-scene">${step === 2 ? "Back to our world ♡" : "On to " + (step === 0 ? "the river" : "the castle") + "! ➜"}</button></div>`,
  );
  document.querySelector("dialog").classList.add("episode-dialog");
  document.querySelector("#next-scene").onclick = () => {
    if (step < 2) startEpisode(step + 1);
    else {
      document.querySelector("dialog").close();
      episodeStep = -1;
      render();
      document
        .querySelector(".adventure-world")
        .classList.add("rainbow-restored");
      speak(
        "Look at that rainbow! Thank you, explorer. You are a wonderful friend!",
      );
    }
  };
}
render();
startPip();
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopVoice();
});
document.addEventListener("cancel", stopVoice, true);
