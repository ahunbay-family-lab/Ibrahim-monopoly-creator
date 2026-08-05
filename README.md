# Wings of Fire

Meet **ten dragon tribes in 3D** — built in the [Ahunbay Family Lab](https://github.com/ahunbay-family-lab).

One full-size 3D dragon fills the screen at a time. It spins gently on its own, and you can
turn it to see any angle: **drag with your mouse or trackpad, swipe on a touchscreen, or
use the arrow keys.** Tap a tribe button to switch to another dragon. Peril, the SkyWing,
has her own full-body model that flies with wings spread, glowing eyes, sharp talons, and
white smoke curling from her nostrils — just like in the books.

---

## What is this?

A 3D showcase of the Wings of Fire dragon tribes, with one dragon displayed at a time:

- **SkyWing** — fiery red
- **MudWing** — thick brown armor
- **SeaWing** — deep blue with glowing markings
- **RainWing** — bright, colorful scales
- **SandWing** — pale gold with a venomous tail barb
- **NightWing** — midnight-toned with glowing starry wings
- **LeafWing** — jungle green
- **IceWing** — icy blue
- **HiveWing** — yellow and black stripes
- **SilkWing** — purple

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

Open [http://localhost:3000](http://localhost:3000), then drag the dragon (or use the
arrow keys) to spin it around!

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
│   └── page.tsx                    # Home page with the full-size 3D dragon viewer
├── components/dragons/             # 3D dragon UI components
├── lib/dragons/
│   ├── characters.ts               # Each tribe's name, colors, and traits
│   ├── model.ts                    # Path to the shared 3D dragon model
│   └── drag.ts                     # Turn-the-dragon control types
├── public/models/dragon.glb        # The shared 3D dragon model (bust)
├── public/models/peril-flying.glb  # Peril's own full-body, flying model
└── styles/globals.css              # Global styles
```

---

## Credits

Peril's flying model (`public/models/peril-flying.glb`) is the "Simple 3D Dragon Model" by
MattBas ([opengameart.org](https://opengameart.org/content/simple-3d-dragon-model)), used
under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

## License

MIT — see [LICENSE](LICENSE) for details. The 3D model credited above keeps its own
CC BY-SA 4.0 license.
