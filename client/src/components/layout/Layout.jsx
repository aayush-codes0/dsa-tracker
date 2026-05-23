import Sidebar from './Sidebar';

/**
 * Layout wrapper — sidebar + scrollable main content area.
 * Adjusts padding for mobile top-bar (h-14) and bottom-nav (h-16).
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark-950">
      <Sidebar />
      {/* Main content — offset by sidebar width on desktop, top/bottom bars on mobile */}
      <main className="lg:ml-64 pt-14 pb-16 lg:pt-0 lg:pb-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
