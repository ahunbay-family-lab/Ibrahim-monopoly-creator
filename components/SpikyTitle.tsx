import { Metal_Mania } from "next/font/google";

const metalMania = Metal_Mania({
  weight: "400",
  subsets: ["latin"],
});

export function SpikyTitle() {
  return (
    <h1
      className={`${metalMania.className} spiky-metal-title text-center text-4xl sm:text-6xl md:text-8xl`}
    >
      WINGS OF FIRE
    </h1>
  );
}
