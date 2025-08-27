import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative px-6 md:px-12 lg:px-24 py-8 mt-16 border-t border-border/20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left side - Copyright */}
        <div className="text-sm text-muted-foreground font-hanken-grotesk">
          © {new Date().getFullYear()} Ayush Maurya. All rights reserved.
        </div>

        {/* Right side - Links */}
        <div className="flex items-center gap-6 text-sm font-hanken-grotesk">
          <Link
            href="mailto:ayushmaurya36@gmail.com"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>
          <Link
            href="https://github.com/devayu/devayu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Source
          </Link>
          <Link
            href="/∅"
            className="text-muted-foreground/20 hover:text-primary/60 transition-all duration-700 hover:scale-125 cursor-pointer select-none font-mono"
          >
            <span className="text-lg opacity-30 hover:opacity-80 transition-all duration-500 hover:rotate-180 inline-block">
              ⟐⧚∅
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
