import Hanko from "@/components/yotei/Hanko";
import ThemeToggle from "@/components/ThemeToggle";
import { siteConfig } from "@/lib/seo";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const socials = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/devayu/", icon: Linkedin },
  { name: "GitHub", href: siteConfig.links.github, icon: Github },
  { name: "X", href: siteConfig.links.twitter, icon: Twitter },
];

const Navbar = () => {
  return (
    <header className="relative z-20 flex items-center justify-between gap-4">
      <Link href="/" className="group flex items-center gap-3" aria-label="Back to the start">
        <Hanko className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-6 group-hover:scale-110" />
        <span className="font-mincho text-lg font-bold tracking-tight">
          devayu
        </span>
      </Link>

      <nav className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/∅"
          className="hidden rounded-full px-3 py-2 text-sm text-ink-soft transition-colors hover:text-crimson sm:block"
        >
          Fragments
        </Link>
        {socials.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="grid size-9 place-items-center rounded-full text-ink-soft transition-[color,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:text-crimson"
          >
            <Icon className="size-[18px]" strokeWidth={1.6} />
          </Link>
        ))}
        <ThemeToggle className="ml-1" />
      </nav>
    </header>
  );
};

export default Navbar;
