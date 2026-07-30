# Wings of Fire

Meet **ten dragon tribes in full-body illustrated art** — built in the
[Ahunbay Family Lab](https://github.com/ahunbay-family-lab).

One full-size dragon fills the screen at a time in a Wings-of-Fire-style illustration.
Tap a tribe button to switch to another dragon.

---

## What is this?

A full-body dragon showcase for the Wings of Fire tribes, with one illustrated dragon
displayed at a time:

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

Built with Next.js, TypeScript, React, and Tailwind CSS.

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

Open [http://localhost:3000](http://localhost:3000), then use the tribe buttons to switch dragons.

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
├── components/dragons/             # Dragon viewer UI components
├── lib/dragons/
│   └── characters.ts               # Each tribe's name, art image, and traits
├── public/dragons/                 # Full-body tribe dragon illustrations
└── styles/globals.css              # Global styles
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
