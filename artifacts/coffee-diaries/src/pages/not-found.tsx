export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-bold text-primary dark:text-primary-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">This page seems to have evaporated.</p>
        <a href="/" className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
          Return Home
        </a>
      </div>
    </div>
  );
}
