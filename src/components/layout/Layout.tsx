import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function Layout({
  children,
  title,
  subtitle,
}: LayoutProps) {
  return (
    <div className="flex-1 min-h-screen bg-slate-50">

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="h-16 px-5 lg:px-8 flex items-center">

          {/* Mobile Menu Space */}
          <div className="lg:hidden w-12 flex-shrink-0"></div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

        </div>
      </header>

      {/* Page */}
      <main className="max-w-7xl mx-auto px-5 py-6 lg:px-8">
        {children}
      </main>

    </div>
  );
}