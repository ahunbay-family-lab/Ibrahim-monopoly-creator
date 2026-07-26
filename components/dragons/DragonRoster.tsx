import { DRAGON_CHARACTERS } from "@/lib/dragons/characters";
import { DragonCard } from "@/components/dragons/DragonCard";

export function DragonRoster() {
  return (
    <section className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {DRAGON_CHARACTERS.map((dragon) => (
        <DragonCard key={dragon.id} dragon={dragon} />
      ))}
    </section>
  );
}
