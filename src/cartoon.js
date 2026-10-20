// Original, consistent cartoon props. Vector artwork stays crisp at every screen size.
const ink = "#25213d";
const drawings = {
  apple: `<path d="M87 55Q106 31 117 23" fill="none" stroke="#6e422b" stroke-width="12"/><path d="M109 45Q138 11 159 35Q141 60 109 45Z" fill="#86dc62"/><path d="M103 65C32 18 16 104 47 147Q67 183 103 165Q143 188 166 144C198 82 159 32 103 65Z" fill="url(#paint)"/><path d="M59 83Q45 103 56 121" fill="none" stroke="#ffb8aa" stroke-width="10"/><ellipse cx="85" cy="117" rx="5" ry="8" fill="${ink}"/><ellipse cx="130" cy="117" rx="5" ry="8" fill="${ink}"/><path d="M98 137Q108 145 118 135" fill="none" stroke-width="4"/>`,
  garden: `<path d="M28 162V75L105 27L182 75V162Z" fill="#a683ff"/><path d="M15 80L105 17L195 80" fill="none" stroke-width="12"/><path d="M57 164V85H151V164" fill="#fff5bc"/><path d="M103 85V162" fill="none"/><path d="M67 121L79 96L92 121M72 112H87" fill="none" stroke="#e8686a" stroke-width="5"/><text x="113" y="123" font-size="35" font-family="sans-serif" font-weight="900" fill="#7653b9" stroke="none">b</text><path d="M22 163H188" stroke-width="12"/><path d="M20 159V118M185 158V121" stroke="#428657"/><g fill="#ffca45"><circle cx="20" cy="108" r="17"/><circle cx="185" cy="112" r="16"/></g><g fill="#f6884d"><circle cx="20" cy="108" r="6"/><circle cx="185" cy="112" r="5"/></g>`,
  river: `<path d="M14 151Q30 95 72 111Q90 30 143 47Q194 63 174 105Q157 128 127 105Q155 100 142 85Q114 74 104 126Q136 115 157 133Q178 143 192 122V173H14Z" fill="url(#paint)"/><path d="M72 111Q90 30 143 47Q181 58 181 85Q165 65 153 76Q146 63 131 75Q113 71 104 96" fill="#fffef0"/><path d="M25 145Q58 124 84 148Q105 161 132 143Q153 130 177 146" fill="none" stroke="#b6f9ff" stroke-width="7"/><circle cx="51" cy="84" r="8" fill="#82e2ff"/><circle cx="29" cy="105" r="4" fill="#82e2ff"/>`,
  castle: `<path d="M34 168V79H70V168M140 168V79H177V168" fill="#beabff"/><path d="M23 79L52 27L82 79ZM127 79L158 27L189 79Z" fill="#ff78ad"/><path d="M63 168V100H149V168" fill="#e4d4ff"/><path d="M72 102V86H88V100H99V86H115V100H127V86H142V103" fill="#e4d4ff"/><path d="M90 168V141Q105 119 122 141V168" fill="#ffe078"/><path d="M52 27V9L76 18L52 25M158 27V9L181 18L158 25" fill="#ffcb4b"/><path d="M43 110H60M150 110H167" stroke-width="8"/><path d="M24 173H187" stroke-width="11"/>`,
  bird: `<path d="M58 95Q14 65 30 128L67 139" fill="#ffbc43"/><path d="M147 98Q191 67 178 130L148 143" fill="#ffbc43"/><ellipse cx="104" cy="106" rx="58" ry="65" fill="url(#paint)"/><path d="M87 42Q75 12 98 21L107 42Q119 7 130 23L123 45" fill="#ffd95d"/><ellipse cx="87" cy="94" rx="6" ry="10" fill="${ink}"/><ellipse cx="126" cy="94" rx="6" ry="10" fill="${ink}"/><path d="M94 112L108 123L122 111Z" fill="#f58a39"/><path d="M80 171V184H66M129 171V184H143" fill="none" stroke-width="8"/><ellipse cx="105" cy="145" rx="25" ry="17" fill="#fff3b2" stroke="none"/>`,
  butterfly: `<path d="M99 93Q34 8 22 62Q7 103 78 118Q13 123 42 160Q70 185 103 122M111 94Q178 10 190 62Q205 104 134 118Q202 123 171 163Q142 186 108 122" fill="#b18bff"/><path d="M98 91Q62 55 46 71Q37 89 77 100M126 100Q164 52 172 74" fill="none" stroke="#f8cf63" stroke-width="14"/><path d="M103 92L89 71M111 92L125 72" fill="none"/><ellipse cx="106" cy="117" rx="12" ry="37" fill="#594582"/><circle cx="106" cy="93" r="16" fill="#ffcf62"/><path d="M101 94H102M111 94H112" stroke-width="4"/>`,
  sun: `<g fill="#ffc848"><path d="M105 8L119 34H91ZM105 194L91 167H119ZM10 103L38 89V116ZM199 103L170 116V89ZM37 35L68 44L47 66ZM174 35L165 66L143 44ZM36 173L47 143L68 165ZM175 174L145 165L165 143Z"/></g><circle cx="105" cy="103" r="59" fill="url(#paint)"/><ellipse cx="85" cy="98" rx="5" ry="8" fill="${ink}"/><ellipse cx="125" cy="98" rx="5" ry="8" fill="${ink}"/><path d="M87 119Q105 137 125 117" fill="none" stroke-width="5"/><path d="M65 80Q79 57 105 58" fill="none" stroke="#fff5bb" stroke-width="8"/>`,
};
let count = 0;
export function cartoon(name) {
  const id = "cartoon-" + count++;
  const colors =
    name === "river"
      ? ["#77eaff", "#2ca4e3"]
      : name === "apple"
        ? ["#ff8d6a", "#ed485a"]
        : ["#fff090", "#ffbf3b"];
  return `<svg class="cartoon-art art-${name}" viewBox="0 0 210 205" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs><g stroke="${ink}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">${(drawings[name] || drawings.sun).replaceAll("url(#paint)", `url(#${id})`)}</g></svg>`;
}
export function installCartoonWorld() {
  document
    .querySelectorAll(".stop-building")
    .forEach(
      (el, i) => (el.innerHTML = cartoon(["garden", "river", "castle"][i])),
    );
  const replacements = [
    [".critter-butterfly", "butterfly"],
    [".critter-bird", "bird"],
    [".sound-creature", "bird"],
    [".apple", "apple"],
  ];
  for (const [selector, name] of replacements)
    document
      .querySelectorAll(selector)
      .forEach((el) => (el.innerHTML = cartoon(name)));
  const world = document.querySelector(".adventure-world");
  if (!world) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let raf;
  world.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || reduce.matches) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = world.getBoundingClientRect();
      world.style.setProperty(
        "--depth-x",
        ((e.clientX - r.left) / r.width - 0.5).toFixed(3),
      );
      world.style.setProperty(
        "--depth-y",
        ((e.clientY - r.top) / r.height - 0.5).toFixed(3),
      );
    });
  });
  world.addEventListener("pointerleave", () => {
    cancelAnimationFrame(raf);
    world.style.setProperty("--depth-x", 0);
    world.style.setProperty("--depth-y", 0);
  });
}
