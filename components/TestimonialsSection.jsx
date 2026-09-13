const testimonials = [
  {
    initials: "KS",
    name: "Ketan Shankar",
    quote: "IEEE DTU became one of the defining parts of my college journey. The community gave me opportunities to take initiative, learn from incredible peers and seniors, and grow both as an engineer and as an individual.",
  },
  {
    initials: "KA",
    name: "Khobaib Akmal",
    quote: "Joining IEEE was a canon event. I found the confidence to lead events, represent DTU, collaborate as a team, and build connections that stayed with me long after my term ended.",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative overflow-hidden bg-[#070d19] py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1100px] px-6 sm:px-10">
        <div data-reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-6 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-electric"><span className="h-px w-8 bg-electric" /> From the community <span className="h-px w-8 bg-electric" /></p>
          <h2 className="text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">Built together, <span className="text-electric">remembered forever.</span></h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article data-reveal key={testimonial.name} className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#101d35] via-panel to-[#08101e] p-7 transition duration-500 hover:border-electric/45 hover:shadow-[0_0_34px_rgba(32,217,255,.1)] sm:p-9">
              <div className="absolute right-7 top-5 text-6xl leading-none text-electric/30">“</div>
              <div className="relative flex h-full flex-col justify-between gap-8">
                <p className="text-base leading-7 text-white/80 sm:text-lg sm:leading-8">{testimonial.quote}</p>
                <div className="flex items-center gap-3 border-t border-white/10 pt-5"><div className="grid h-10 w-10 place-items-center rounded-full border border-electric/45 bg-ink text-xs font-bold text-electric">{testimonial.initials}</div><div><p className="text-sm font-bold text-white">{testimonial.name}</p><p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">IEEE DTU Alumni</p></div></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
