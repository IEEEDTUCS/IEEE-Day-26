import Image from "next/image";

const council = [
  ["rudit_madaan.jpg", "Rudit Madaan", "Chairperson", "https://www.instagram.com/rudit_madaan/", "https://www.linkedin.com/in/rudit-madaan/"],
  ["bhavit_jain.jpg", "Bhavit Jain", "Vice Chairperson", "https://www.instagram.com/jainbhavit2018/", "https://www.linkedin.com/in/jainbhavit2018/"],
  ["jitendra_kumar_singh.jpg", "Jitendra Kumar Singh", "General Secretary", "https://www.instagram.com/18jitendra_/", "https://www.linkedin.com/in/jitendra-kumar-singh-878b2a286/"],
  ["dhruv_chiripal.jpg", "Dhruv Chiripal", "Joint Secretary", "https://www.instagram.com/dhruv.chiripal/", "https://www.linkedin.com/in/dhruv-chiripal/"],
  ["aditya_tiwari.jpg", "Aditya Tiwari", "Joint Secretary", "https://www.instagram.com/adityatiwari_in/", "https://www.linkedin.com/in/aditya-tiwari-784517279/"],
  ["ashutosh_kumar_mishra.webp", "Ashutosh Kumar Mishra", "Treasurer", "https://www.instagram.com/ashutosh_mishr_/", "https://www.linkedin.com/in/ashutosh-mishra-3843953ab/"],
  ["mridul_mor.jpeg", "Mridul Mor", "Webmaster", "https://www.instagram.com/_mridul_mor/", "https://www.linkedin.com/in/mridul-mor/"],
  ["jahan_sharma.jpeg", "Jahan Sharma", "Chairperson, CS", null, "https://www.linkedin.com/in/jahansharma/"],
  ["unnat_agarwal.jpg", "Unnat Agarwal", "Vice Chairperson, CS", "https://www.instagram.com/_unnat_7779/", "https://www.linkedin.com/in/unnat7779/"],
  ["shashwat_jha.jpg", "Shashwat Jha", "Chairperson, PES-IAS", null, "https://www.linkedin.com/in/shashwatjha26/"],
  ["shreyans_jain.jpeg", "Shreyans Jain", "Vice Chairperson, PES-IAS", "https://www.instagram.com/shreyansj28/", "https://www.linkedin.com/in/shreyans-jain-7925a7326/"],
  ["srijoni_das.jpeg", "Srijoni Das", "Chairperson, CASS", "https://www.instagram.com/srijo8031/", "https://www.linkedin.com/in/srijoni-das-13a8b1280/"],
  ["sneha_meerwal.jpeg", "Sneha Meerwal", "Vice Chairperson, CASS", "https://www.instagram.com/snehameerwal/", "https://www.linkedin.com/in/sneha-meerwal-38926a300/"],
  ["shraddha_singh.jpeg", "Shraddha Singh", "Chairperson, WIE", "https://www.instagram.com/shraddha_singh05/", "https://www.linkedin.com/in/shraddha-singh-29b3a528a/"],
  ["roshan_beja.jpg", "Roshan Beja", "Vice Chairperson, WIE", "https://www.instagram.com/roshan_beja/", "https://www.linkedin.com/in/roshankumarbeja/"],
  ["mridul_mor.jpeg", "Mridul Mor", "Head of Membership Development", "https://www.instagram.com/_mridul_mor/", "https://www.linkedin.com/in/mridul-mor/"],
  ["bhavya_agarwal.jpg", "Bhavya Agarwal", "Head of Corporate Affairs", "https://www.instagram.com/bhavyaa.ag/", "https://www.linkedin.com/in/bhavya-agarwal-6733262a3/"],
  ["yuvraj_malik.jpeg", "Yuvraj Malik", "Head of Hospitality", "https://www.instagram.com/yuvrajmalik2005/", "https://www.linkedin.com/in/yuvrajmalik2005/"],
  ["harshit_shakya.jpeg", "Harshit Shakya", "Head of Logistics", "https://www.instagram.com/harshitshakya50/", "https://www.linkedin.com/in/harshit-shakya-2b65b7288/"],
  ["abhinay_sahai.jpg", "Abhinay Sahai", "Head of Public Relations", "https://www.instagram.com/abhinay_sahai_/", "https://www.linkedin.com/in/abhinay-sahai-30790628b/"],
  ["himanshu_yadav.jpeg", "Himanshu Yadav", "Head of Publications", "https://www.instagram.com/himanshu.yadv_/", "https://www.linkedin.com/in/him-y/"],
  ["tarush_sonakya.jpg", "Tarush Sonakya", "Head of Technical Affairs", "https://www.instagram.com/anonimbus31337/", "https://www.linkedin.com/in/tarush-sonakya/"],
];

function SocialLink({ href, label, children }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-ink/40 text-[10px] font-bold text-white transition hover:border-electric hover:bg-electric hover:text-ink">
      {children}
    </a>
  );
}

export default function CouncilSection() {
  return (
    <section id="council" className="relative overflow-hidden bg-[#070d19] py-24 sm:py-32">
      <div className="absolute left-[-12%] top-1/4 h-[420px] w-[420px] rounded-full bg-electric/[.05] blur-[120px]" />
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="mb-12 flex items-end justify-between gap-8">
          <div>
            <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-electric">
              <span className="h-px w-8 bg-electric" /> The people behind the work
            </p>
            <h2 className="max-w-2xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
              Meet the <span className="text-electric">council.</span>
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-xs leading-5 text-muted sm:block">The students carrying this year&apos;s ideas from first spark to final build.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {council.map(([image, name, position, instagram, linkedin]) => (
            <article key={`${name}-${position}`} className="group relative min-h-[340px] overflow-hidden rounded-xl border border-white/10 bg-panel transition duration-500 hover:-translate-y-1 hover:border-electric/50 hover:shadow-[0_0_36px_rgba(32,217,255,.14)]">
              <Image
                src={`/images/council/${image}`}
                alt={name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-center transition duration-700 group-hover:scale-105 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-[#050914]/30 to-transparent" />
              <div className="absolute inset-x-5 bottom-5">
                <div className="mb-4 h-px w-full bg-white/20" />
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white">{name}</h3>
                    <p className="mt-1 text-[10px] font-semibold uppercase leading-4 tracking-[0.12em] text-signal">{position}</p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <SocialLink href={instagram} label={`${name} on Instagram`}>ig</SocialLink>
                    <SocialLink href={linkedin} label={`${name} on LinkedIn`}>in</SocialLink>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
