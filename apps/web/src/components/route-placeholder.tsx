type RoutePlaceholderProps = {
  route: string;
};

export function RoutePlaceholder({ route }: RoutePlaceholderProps) {
  return (
    <main className="min-h-screen bg-radar-bg px-4 py-8 text-radar-navy sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center">
        <div className="rounded-lg border border-radar-border bg-white p-6 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-radar-cyan">
            RADAR PREKETEK
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Placeholder RADAR
          </h1>
          <p className="mt-3 text-sm font-semibold text-radar-muted">
            Route: <span className="font-black text-radar-navy">{route}</span>
          </p>
          <p className="mt-4 text-sm leading-6 text-radar-muted">
            Halaman ini disiapkan untuk MVP demo dan belum mengimplementasikan fitur lengkap.
          </p>
        </div>
      </section>
    </main>
  );
}
