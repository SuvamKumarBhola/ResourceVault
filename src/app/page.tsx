import { ResourceList } from "@/features/resources/ResourceList";
import { Counter } from "@/components/Counter";
import { ImportBookmarksButton } from "@/features/dashboard/ImportBookmarksButton";

export default function Home() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-display font-bold text-ink leading-tight">
          Your Knowledge <br/>
          <span className="text-blueprint font-medium italic">Vault</span>
        </h1>
        <p className="text-slate text-heading-sm mt-4 max-w-2xl">
          Everything you save is instantly searchable and available offline.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <Counter />
          <ImportBookmarksButton />
        </div>
      </header>
      
      <section>
        <ResourceList />
      </section>
    </div>
  );
}
