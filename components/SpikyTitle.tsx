import { Metal_Mania } from "next/font/google";

const metalMania = Metal_Mania({
  weight: "400",
  subsets: ["latin"],
});

export function SpikyTitle() {
  return (
    <h1
      className={`${metalMania.className} spiky-metal-title text-center text-5xl sm:text-7xl md:text-8xl`}
    >
      DRAGONS 3D
    </h1>
  );
}
