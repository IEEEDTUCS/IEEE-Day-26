export default function FAQ() {
  return (
    <section id="faq" className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-t border-white/5 bg-ink py-28 sm:py-36">
      <div className="absolute left-[-15%] top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-electric/[.04] blur-[120px]" />
      <div data-reveal className="relative z-10 mx-auto w-full max-w-[1440px] px-6 text-center sm:px-10 lg:px-16">
        <p className="mb-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-electric">
          <span className="h-px w-8 bg-electric" /> Section
        </p>
        <h2 className="text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
          Frequently Asked <span className="text-electric">Questions</span>
        </h2>
      </div>
    </section>
  );
}
