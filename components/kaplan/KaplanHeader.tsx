import Link from "next/link";

export function KaplanHeader() {
  return (
    <>
      <div className="bg-kaplan-royal text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 text-xs sm:justify-between sm:text-sm">
          <span className="hidden sm:inline">Kaplan Early Learning Company</span>
          <nav className="flex gap-4">
            <span className="opacity-80">Customer Support</span>
            <span className="opacity-80">Catalogs</span>
            <span className="opacity-80">Quick Order</span>
          </nav>
        </div>
      </div>

      <div className="bg-kaplan-sky py-2 text-center text-sm font-semibold text-kaplan-royal">
        Play MONOPOLY® online with friends — free in your browser!
      </div>

      <header className="border-b border-kaplan-gray-light bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-xl font-bold tracking-tight text-kaplan-royal sm:text-2xl">
              Kaplan
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-kaplan-gray-dark sm:text-xs">
              Early Learning Company
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-kaplan-royal md:flex">
            <Link href="/" className="hover:text-kaplan-blue">
              Shop
            </Link>
            <Link href="/monopoly" className="hover:text-kaplan-blue">
              Play Online
            </Link>
          </nav>

          <Link
            href="/monopoly"
            className="rounded-full bg-kaplan-royal px-4 py-2 text-sm font-semibold text-white hover:bg-kaplan-royal-hover"
          >
            Play Now
          </Link>
        </div>
      </header>
    </>
  );
}
