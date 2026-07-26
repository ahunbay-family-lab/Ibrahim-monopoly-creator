import { DRAGON_CHARACTERS } from "@/lib/dragons/characters";
import { DragonCard } from "@/components/dragons/DragonCard";

export function DragonRoster() {
  return (
    <section className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-indigo-950 sm:text-4xl">
          Meet the Dragons
        </h2>
        <p className="mt-2 text-indigo-700">
          Ten dragon tribes — each with their own look and powers. Names coming soon!
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DRAGON_CHARACTERS.map((dragon) => (
          <DragonCard key={dragon.id} dragon={dragon} />
        ))}
      </div>
    </section>
  );
}
