/**
 * Product Demo Section – showcases the SoftSync platform in action.
 * Step 1: Section shell (heading + container). Animation and UI mockup in later steps.
 */
export function ProductDemoSection() {
  return (
    <section
      id="product-demo"
      className="w-full min-h-screen py-16 md:py-24 bg-white"
      aria-label="Product demo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 text-center mb-4">
          See SoftSync in action
        </h2>
        <p className="text-lg text-neutral-600 text-center max-w-2xl mx-auto mb-12">
          One interface. Every tool. Zero friction.
        </p>
        {/* Mockup container – static UI will go here in Step 2 */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 min-h-[480px] shadow-sm" />
      </div>
    </section>
  );
}
