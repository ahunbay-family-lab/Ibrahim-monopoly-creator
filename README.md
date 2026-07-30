# Wings of Fire

Meet **ten dragon tribes in 3D** — built in the [Ahunbay Family Lab](https://github.com/ahunbay-family-lab).

One full-size dragon fills the screen at a time. **Click and drag it** (or swipe on a
touchscreen) to spin it around, scroll to zoom in, and tap a tribe button to swap dragons.

---

## What is this?

A 3D showcase of the Wings of Fire dragon tribes, featuring ten unique tribes:

- **SkyWing** — fiery red with blazing wings
- **MudWing** — thick brown armor and a powerful build
- **SeaWing** — deep blue with glowing markings
- **RainWing** — rainbow scales that shimmer
- **SandWing** — pale gold with a venomous tail barb
- **NightWing** — midnight black with starry wings
- **LeafWing** — leaf-shaped wings and jungle green
- **IceWing** — shimmering ice with sharp spikes
- **HiveWing** — yellow and black stripes
- **SilkWing** — butterfly wings and antennae

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
├── lib/dragons/                    # Dragon character data and types
└── styles/globals.css              # Global styles
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
