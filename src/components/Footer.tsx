import WorldSwitch from "@/components/worlds/WorldSwitch";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* the mountain, small and far away now */}
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
        className="mx-auto block h-24 w-full max-w-3xl text-ink/10"
      >
        <path
          d="M300 120 C 420 100 520 50 580 22 L 620 22 C 680 50 780 100 900 120 Z"
          fill="currentColor"
        />
        <path
          d="M560 34 C 570 28 578 24 585 22 L 615 22 C 624 25 632 30 640 36 L 628 44 L 618 36 L 606 50 L 596 38 L 584 48 L 574 38 Z"
          fill="var(--paper)"
          opacity="0.9"
        />
      </svg>
      <div className="border-t border-line px-6 pb-24 pt-8 md:px-12 lg:px-24">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-ink-soft md:flex-row">
          <p>© {new Date().getFullYear()} Ayush Maurya</p>
          <div className="flex items-center gap-6">
            <WorldSwitch className="transition-colors hover:text-crimson" />
            <Link
              href="mailto:ayushmaurya36@gmail.com"
              className="transition-colors hover:text-crimson"
            >
              Email me
            </Link>
            <Link
              href="https://github.com/devayu/devayu"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-crimson"
            >
              Source
            </Link>
            <Link
              href="/∅"
              aria-label="Fragments"
              className="inline-block font-mincho text-lg opacity-30 transition-all duration-700 hover:rotate-[360deg] hover:text-crimson hover:opacity-90"
            >
              ∅
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
