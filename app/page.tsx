import { DragonRoster } from "@/components/dragons/DragonRoster";

export default function Home() {
  return (
    <div className="relative min-h-full flex-1 bg-gradient-to-br from-indigo-950 via-violet-900 to-orange-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -right-16 top-32 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 py-12 sm:py-16">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">
            Ahunbay Family Lab
          </p>
          <h1 className="animate-wiggle bg-gradient-to-r from-amber-200 via-orange-300 to-rose-300 bg-clip-text text-5xl font-extrabold text-transparent sm:text-7xl">
            Dragons 3D
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-violet-100 sm:text-xl">
            Ten realistic dragon tribes brought to life in 3D. Spin them around,
            study every scale and wing, and get ready to name your heroes!
          </p>
        </header>

        <div className="w-full rounded-3xl bg-white/10 p-6 shadow-2xl ring-1 ring-white/20 backdrop-blur-md sm:p-10">
          <DragonRoster />
        </div>
      </main>
    </div>
  );
}
