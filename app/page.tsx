import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center bg-gradient-to-br from-violet-200 via-fuchsia-100 to-orange-100 px-6 py-12">
      <main className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-10 text-center">
        <header className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-700">
            Ahunbay Family Lab
          </p>
          <h1 className="animate-wiggle text-4xl font-extrabold text-indigo-900 sm:text-6xl">
            Online Monopoly
          </h1>
          <p className="text-lg text-indigo-800 sm:text-xl">
            Play the classic board game with friends anywhere in the world!
          </p>
        </header>

        <Link
          href="/monopoly"
          className="animate-pop min-h-11 rounded-2xl bg-emerald-600 px-10 py-4 text-xl font-bold text-white shadow-lg transition hover:bg-emerald-700 hover:shadow-xl"
        >
          🎲 Play Monopoly
        </Link>

        <section className="grid w-full gap-4 sm:grid-cols-3">
          <FeatureCard emoji="🌍" title="Play Online" text="Join from any device with a room code" />
          <FeatureCard emoji="👥" title="2–4 Players" text="Invite friends and family to your game" />
          <FeatureCard emoji="🏠" title="Buy & Rent" text="Roll dice, buy properties, collect rent" />
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white/70 p-5 shadow">
      <span className="text-3xl">{emoji}</span>
      <h2 className="mt-2 font-bold text-indigo-900">{title}</h2>
      <p className="mt-1 text-sm text-indigo-700">{text}</p>
    </div>
  );
}
