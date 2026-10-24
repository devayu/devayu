import Navbar from "@/components/Navbar";
import YoteiScene from "@/components/yotei/YoteiScene";
import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="relative h-[100svh] min-h-[620px] overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, var(--sky-top), var(--sky-mid) 45%, var(--sky-bottom) 75%)",
      }}
    >
      <YoteiScene />
      <div className="relative z-10 px-6 pt-5 md:px-12 md:pt-8 lg:px-24">
        <Navbar />
        <div className="mt-[12vh] max-w-lg">
          <h1 className="ink-in font-mincho text-[clamp(4rem,14vw,9rem)] font-extrabold leading-none">
            404
          </h1>
          <p className="ink-in mt-3 text-lg text-ink-soft" style={{ animationDelay: "0.2s" }}>
            This trail doesn&apos;t lead anywhere. The page may have moved, or
            the link has a typo.
          </p>
          <Link
            href="/"
            className="ink-in mt-6 inline-flex h-12 items-center rounded-full bg-crimson px-6 font-medium text-paper transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:scale-95"
            style={{ animationDelay: "0.4s" }}
          >
            Back to the home page
          </Link>
        </div>
      </div>
    </section>
  );
}
