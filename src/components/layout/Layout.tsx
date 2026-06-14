import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function Layout({ children, title, subtitle }: LayoutProps) {
  return (
    <div className="flex-1 min-h-screen bg-slate-50/50">
      <header className="bg-white border-b border-slate-200 px-6 lg:px-8 py-5">
        <div className="lg:hidden w-8" />
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </header>
      <main className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
