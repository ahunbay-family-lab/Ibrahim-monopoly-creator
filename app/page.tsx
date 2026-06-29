import Link from "next/link";
import Image from "next/image";
import { KaplanShell } from "@/components/kaplan/KaplanShell";
import { MONOPOLY_PRODUCT } from "@/lib/kaplan/theme";

export default function Home() {
  return (
    <KaplanShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Games & Puzzles", href: "/" },
        { label: MONOPOLY_PRODUCT.title },
      ]}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="product-card-border p-4">
            <div className="relative aspect-square overflow-hidden rounded bg-kaplan-sky">
              <Image
                src={MONOPOLY_PRODUCT.image}
                alt={MONOPOLY_PRODUCT.title}
                fill
                className="object-contain p-4"
                priority
                unoptimized
              />
            </div>
            <p className="mt-3 text-center text-xs text-kaplan-gray-dark">
              In Stock &amp; Ready to Ship
            </p>
          </div>

          <div className="product-buy-box">
            <h1 className="text-2xl font-bold text-kaplan-royal sm:text-3xl">
              {MONOPOLY_PRODUCT.title}
            </h1>

            <p className="mt-2 text-sm text-kaplan-gray-dark">
              Item: <span className="font-semibold">{MONOPOLY_PRODUCT.id}</span>
            </p>

            <p className="mt-4 text-3xl font-bold text-kaplan-royal">
              {MONOPOLY_PRODUCT.price}
            </p>

            <div className="mt-3">
              <span className="badge-in-stock">In Stock</span>
            </div>

            <section className="mt-6">
              <h2 className="text-lg font-bold text-kaplan-royal">
                Product Highlights
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-kaplan-gray-dark">
                {MONOPOLY_PRODUCT.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-[176px_1fr]">
              <div className="flex items-center justify-center rounded-full border border-kaplan-gray-light bg-white px-4 py-3 text-center font-semibold text-kaplan-royal">
                Play Free
              </div>
              <Link href="/monopoly" className="btn-kaplan-action w-full">
                Play Online Now
              </Link>
            </div>

            <p className="mt-4 text-sm text-kaplan-gray-dark">
              Or{" "}
              <Link href="/monopoly" className="font-semibold text-kaplan-blue hover:underline">
                join a friend&apos;s game
              </Link>{" "}
              with a room code.
            </p>
          </div>
        </div>

        <section className="mt-12 border-t border-kaplan-gray-light py-10">
          <h2 className="text-2xl font-bold text-kaplan-royal">
            About This Product
          </h2>

          <div className="mt-4 rounded border border-kaplan-yellow bg-yellow-50 p-4">
            <p className="text-sm font-semibold text-kaplan-gray-dark">
              Warning: Choking Hazard - Small Parts. Not for children under 3
              years.
            </p>
          </div>

          <p className="mt-4 text-kaplan-gray-dark">
            <span className="font-semibold">{MONOPOLY_PRODUCT.ageRange}.</span>{" "}
            {MONOPOLY_PRODUCT.description}
          </p>

          <h3 className="mt-8 text-xl font-bold text-kaplan-royal">Features</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-kaplan-gray-dark">
            {MONOPOLY_PRODUCT.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="border-t border-kaplan-gray-light py-10">
          <h2 className="text-2xl font-bold text-kaplan-royal">Reviews</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <ReviewCard
              title="Great order, would buy again!"
              author="A Teacher"
              text="I received the games in a timely manner. I would order from this company again."
            />
            <ReviewCard
              title="Great game to make learning fun and engaging!"
              author="Mr. J"
              text="Monopoly is such a great way to teach very important financial concepts in a very fun and engaging way!"
            />
          </div>
        </section>
      </div>
    </KaplanShell>
  );
}

function ReviewCard({
  title,
  author,
  text,
}: {
  title: string;
  author: string;
  text: string;
}) {
  return (
    <article className="product-card-border p-5">
      <div className="flex gap-1 text-kaplan-yellow">
        {"★★★★★".split("").map((star, i) => (
          <span key={i}>{star}</span>
        ))}
      </div>
      <h3 className="mt-2 text-lg font-bold text-kaplan-royal">{title}</h3>
      <p className="mt-2 text-sm text-kaplan-gray-dark">{text}</p>
      <p className="mt-3 text-sm font-semibold text-kaplan-royal">{author}</p>
    </article>
  );
}
