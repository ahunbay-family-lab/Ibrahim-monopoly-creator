import { KaplanFooter } from "./KaplanFooter";
import { KaplanHeader } from "./KaplanHeader";

type KaplanShellProps = {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
};

export function KaplanShell({ children, breadcrumbs }: KaplanShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <KaplanHeader />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="border-b border-kaplan-gray-light bg-white"
        >
          <ol className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-3 text-sm text-kaplan-gray-dark">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-2">
                {index > 0 && <span className="text-kaplan-gray">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-kaplan-royal">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="font-semibold text-kaplan-royal">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <main className="flex-1">{children}</main>
      <KaplanFooter />
    </div>
  );
}
