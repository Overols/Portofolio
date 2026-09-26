export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="font-heading font-extrabold text-7xl bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent-2))] bg-clip-text text-transparent">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Page not found</h2>
          <p className="text-muted-foreground leading-relaxed">
            The page you're looking for doesn't exist.
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-foreground text-background text-sm font-semibold px-5 py-2.5 hover:bg-foreground/90 transition-colors"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
