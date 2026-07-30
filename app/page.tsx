import { DragonViewer } from "@/components/dragons/DragonViewer";
import { SpikyTitle } from "@/components/SpikyTitle";

export default function Home() {
  return (
    <div className="neon-lightning-bg relative min-h-full flex-1 overflow-hidden">
      <div className="lightning-bolt lightning-bolt-1" aria-hidden="true" />
      <div className="lightning-bolt lightning-bolt-2" aria-hidden="true" />
      <div className="lightning-bolt lightning-bolt-3" aria-hidden="true" />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 py-10 sm:py-14">
        <SpikyTitle />
        <DragonViewer />
      </main>
    </div>
  );
}
