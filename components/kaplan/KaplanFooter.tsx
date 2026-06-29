export function KaplanFooter() {
  return (
    <footer className="mt-auto border-t border-kaplan-gray-light bg-kaplan-sky">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="font-bold text-kaplan-royal">Kaplan Early Learning</p>
            <p className="mt-1 text-sm text-kaplan-gray-dark">
              Transforming lives through play since 1951.
            </p>
          </div>
          <div>
            <p className="font-bold text-kaplan-royal">Customer Service</p>
            <ul className="mt-1 space-y-1 text-sm text-kaplan-gray-dark">
              <li>Order Tracking</li>
              <li>Returns</li>
              <li>Gift Cards</li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-kaplan-royal">Resources</p>
            <ul className="mt-1 space-y-1 text-sm text-kaplan-gray-dark">
              <li>Request a Catalog</li>
              <li>Classroom FloorPlanner</li>
              <li>Learning Center</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-kaplan-gray-light pt-4 text-center text-xs text-kaplan-gray-dark">
          MONOPOLY® is a trademark of Hasbro. Online game built for educational play.
        </p>
      </div>
    </footer>
  );
}
