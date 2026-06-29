# Online Monopoly

Play **Monopoly online** with friends anywhere in the world — built in the [Ahunbay Family Lab](https://github.com/ahunbay-family-lab).

Create a game room, share a 6-letter code, and play together in your browser!

---

## What is this?

An online multiplayer Monopoly game where you can:

- **Create a room** and invite friends with a shareable code
- **Join from anywhere** — phones, tablets, or laptops
- **Play classic Monopoly** — roll dice, buy properties, pay rent, and win!

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

Open [http://localhost:3000](http://localhost:3000) and click **Play Monopoly**.

### Useful commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start the app locally |
| `npm run build` | Build for production |
| `npm run lint` | Check code for problems |

---

## How to Play

1. Go to **Play Monopoly** on the home page
2. **Create a game** and enter your name
3. Share the **6-letter room code** with friends
4. Friends click **Join Game** and enter the code
5. When 2–4 players are ready, the **host starts the game**
6. Take turns rolling dice, buying properties, and collecting rent!

### Game rules (simplified)

- Everyone starts with **$1,500**
- Pass **GO** to collect **$200**
- Land on an unowned property? You can **buy it** or pass
- Land on someone else's property? **Pay rent**
- Run out of money? You're **bankrupt** — last player standing wins!

---

## Project Structure

```
/
├── app/
│   ├── page.tsx                    # Home page
│   ├── monopoly/page.tsx           # Lobby (create/join)
│   ├── monopoly/[roomId]/page.tsx  # Game room
│   └── api/monopoly/               # Game API routes
├── components/monopoly/            # Game UI components
├── lib/monopoly/                   # Board, rules, game logic
└── styles/globals.css              # Global styles
```

---

## Deploying to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Click **Deploy**

Vercel detects Next.js automatically.

> **Note:** Game rooms are stored in server memory. For a production app with many players, you'd eventually want a database (like Redis or Supabase) so rooms persist across server restarts.

---

## For AI Assistants

Share [AGENTS.md](./AGENTS.md) with your AI coding tool so it follows Family Lab conventions.

---

## License

[MIT License](./LICENSE)

**Happy building!** 🎲
