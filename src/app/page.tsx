import { ResourceList } from "@/features/resources/ResourceList";
import { Counter } from "@/components/Counter";

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
        <Counter />
      </header>
      
      <section>
        <ResourceList />
      </section>
    </div>
  );
}
