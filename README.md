# Wings of Fire

Meet **ten dragon tribes in 3D** — built in the [Ahunbay Family Lab](https://github.com/ahunbay-family-lab).

One full-size dragon fills the screen at a time. **Click and drag it** (or swipe on a
touchscreen) to spin it around, scroll to zoom in, and tap a tribe button to swap dragons.

---

## What is this?

A 3D showcase of the Wings of Fire dragon tribes. Each tribe is built out of simple 3D
shapes (a body, neck, head, four legs, a tail, and wings) with its own body build,
wing style, and special features — so every dragon actually looks different, not just
a different color on the same model:

- **SkyWing** — lean and fiery red, with jagged bat-style wings
- **MudWing** — bulky brown body built low to the ground
- **SeaWing** — glowing blue markings on its wings
- **RainWing** — rainbow-bright wings on a slim green body
- **SandWing** — pale gold with a venomous tail barb
- **NightWing** — midnight-toned with glowing starry wings
- **LeafWing** — slim body with a second pair of leaf-shaped wings
- **IceWing** — icy blue with sharp spikes down its spine
- **HiveWing** — yellow and black with narrow insect wings
- **SilkWing** — purple with antennae and rounded butterfly wings

Built with Next.js, TypeScript, React, Three.js, and Tailwind CSS.

---

## Getting Started

### What you need

- [Node.js](https://nodejs.org/) (version 18 or newer)
- [Git](https://git-scm.com/)

### Run locally

```bash
git clone https://github.com/ahunbay-family-lab/kids-app-template.git
cd kids-app-template
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then click and drag the dragon to spin it!

### Useful commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start the app locally |
| `npm run build` | Build for production |
| `npm run lint` | Check code for problems |

---

## Project Structure

```
/
├── app/
│   └── page.tsx                    # Home page with the full-size dragon viewer
├── components/dragons/             # 3D dragon UI components
├── lib/dragons/
│   ├── characters.ts               # Each tribe's name, colors, and body traits
│   ├── buildDragonBody.ts          # Builds a dragon's 3D body out of simple shapes
│   ├── wingShape.ts                # The four wing outline styles
│   └── geometryHelpers.ts          # Small 3D building blocks (segments, joints...)
└── styles/globals.css              # Global styles
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
