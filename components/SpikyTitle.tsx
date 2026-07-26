import { Nosifer } from "next/font/google";

const nosifer = Nosifer({
  weight: "400",
  subsets: ["latin"],
});

export function SpikyTitle() {
  return (
    <h1
      className={`${nosifer.className} spiky-title text-center text-4xl tracking-wide text-red-500 sm:text-6xl md:text-7xl`}
    >
      DRAGONS 3D
    </h1>
  );
}
