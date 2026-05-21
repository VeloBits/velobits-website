export default function Home() {
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Velobits
        </span>
        <nav aria-label="Main navigation" />
      </header>

      <main className="flex-1 px-6 py-12" />

      <footer className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400">
        © {new Date().getFullYear()} Velobits | Develop
      </footer>
    </>
  );
}
