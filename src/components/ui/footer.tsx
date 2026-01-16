export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted font-mono text-sm">
          © {new Date().getFullYear()} VibeBench. The Gold Standard for AI Code Generation.
        </p>
      </div>
    </footer>
  );
}
