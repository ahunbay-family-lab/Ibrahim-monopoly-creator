import { KaplanShell } from "@/components/kaplan/KaplanShell";
import { MonopolyLobby } from "@/components/monopoly/MonopolyLobby";
import { MONOPOLY_PRODUCT } from "@/lib/kaplan/theme";

export default function MonopolyPage() {
  return (
    <KaplanShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Play Online", href: "/monopoly" },
        { label: "Create or Join Game" },
      ]}
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h1 className="text-2xl font-bold text-kaplan-royal sm:text-3xl">
              Play {MONOPOLY_PRODUCT.title} Online
            </h1>
            <p className="mt-3 text-kaplan-gray-dark">
              Create a game room and share your code with friends, or join an
              existing game. Play the classic property trading game from
              anywhere in the world!
            </p>

            <div className="mt-6 product-card-border p-5">
              <h2 className="font-bold text-kaplan-royal">How to Play Online</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-kaplan-gray-dark">
                <li>Create a game and share your 6-letter room code</li>
                <li>Friends join with the code (2–4 players online)</li>
                <li>The host starts when everyone is ready</li>
                <li>Roll dice, buy properties, and collect rent!</li>
              </ol>
            </div>

            <div className="mt-6 product-card-border p-5">
              <h2 className="font-bold text-kaplan-royal">Product Highlights</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-kaplan-gray-dark">
                {MONOPOLY_PRODUCT.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="product-card-border p-6 sm:p-8">
            <h2 className="mb-6 text-center text-xl font-bold text-kaplan-royal">
              Start or Join a Game
            </h2>
            <MonopolyLobby />
          </section>
        </div>
      </div>
    </KaplanShell>
  );
}
