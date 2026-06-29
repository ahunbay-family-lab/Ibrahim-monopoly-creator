import Link from "next/link";
import { MonopolyLobby } from "@/components/monopoly/MonopolyLobby";

export default function MonopolyPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-300 via-green-200 to-teal-200 px-6 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="animate-float absolute left-[10%] top-[15%] text-4xl opacity-60">
          🏠
        </span>
        <span className="animate-float absolute right-[12%] top-[20%] text-3xl opacity-60 [animation-delay:0.5s]">
          💵
        </span>
        <span className="animate-float absolute bottom-[20%] left-[15%] text-3xl opacity-60 [animation-delay:1s]">
          🎲
        </span>
        <span className="animate-float absolute bottom-[25%] right-[10%] text-4xl opacity-60 [animation-delay:1.5s]">
          🚂
        </span>
      </div>

      <main className="relative z-10 flex w-full max-w-lg flex-col items-center gap-8 text-center">
        <header className="space-y-3">
          <Link
            href="/"
            className="text-sm font-semibold text-emerald-800 hover:underline"
          >
            ← Back to Home
          </Link>
          <h1 className="animate-wiggle text-4xl font-extrabold text-emerald-950 sm:text-5xl">
            🎲 Online Monopoly
          </h1>
          <p className="text-lg text-emerald-800">
            Create a room, share the code with friends, and play together from
            anywhere in the world!
          </p>
        </header>

        <MonopolyLobby />

        <section className="rounded-2xl bg-white/60 px-6 py-4 text-left text-sm text-emerald-800">
          <h2 className="mb-2 font-bold">How to play</h2>
          <ol className="list-inside list-decimal space-y-1">
            <li>Create a game and share your 6-letter room code</li>
            <li>Friends join with the code (2–4 players)</li>
            <li>The host starts the game when everyone is ready</li>
            <li>Roll dice, buy properties, and collect rent!</li>
          </ol>
        </section>
      </main>
    </div>
  );
}
