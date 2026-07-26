import { DragonRoster } from "@/components/dragons/DragonRoster";
import { SpikyTitle } from "@/components/SpikyTitle";

export default function Home() {
  return (
    <div className="relative min-h-full flex-1 bg-gradient-to-br from-black via-zinc-950 to-red-950">
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-6 py-10 sm:py-14">
        <SpikyTitle />
        <DragonRoster />
      </main>
    </div>
  );
}
