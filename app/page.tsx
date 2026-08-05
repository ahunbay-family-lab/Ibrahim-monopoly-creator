import { DragonViewer } from "@/components/dragons/DragonViewer";
import { SpikyTitle } from "@/components/SpikyTitle";

export default function Home() {
  return (
    <div className="dragon-collage-bg relative min-h-dvh flex-1 overflow-hidden">
      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-6">
        <SpikyTitle />
        <DragonViewer />
      </main>
    </div>
  );
}
