import { Button } from "@/components/ui/button";
import { File, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between font-hanken-grotesk">
      <div className="text-lg font-semibold tracking-tight font-space-grotesk">
        devayu<span className="text-primary">.</span>
      </div>

      {/* Desktop nav keeps existing styling */}
      <div className="hidden md:flex items-center gap-2">
        <Link
          href="https://www.linkedin.com/in/devayu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="sm">
            <Linkedin className="w-4 h-4" /> LinkedIn
          </Button>
        </Link>
        <Link
          href="https://github.com/devayu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="sm">
            <Github className="w-4 h-4" /> GitHub
          </Button>
        </Link>
        <Link
          href="https://x.com/idntkno_w"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="sm">
            <Twitter className="w-4 h-4" /> X
          </Button>
        </Link>
        <Link
          href="https://drive.google.com/file/d/1y329yo76Ns09W9BTz951ax5GT2shXNUl/view"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="sm" variant="outline">
            <File className="w-4 h-4" /> CV
          </Button>
        </Link>
      </div>

      {/* Mobile menu uses same button styles inside a sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-48">
            <SheetTitle></SheetTitle>
            <SheetHeader></SheetHeader>
            <div className="mt-6 flex flex-col gap-3 font-hanken-grotesk">
              <Link
                href="https://linkedin.com/in/ayushmaurya-work"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </Button>
              </Link>
              <Link
                href="https://github.com/devayu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Github className="w-4 h-4" /> GitHub
                </Button>
              </Link>
              <Link
                href="https://x.com/idntkno_w"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Twitter className="w-4 h-4" /> X
                </Button>
              </Link>
              <Link
                href="https://drive.google.com/file/d/1y329yo76Ns09W9BTz951ax5GT2shXNUl/view"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start hidden"
                >
                  <File className="w-4 h-4" /> CV
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <File className="w-4 h-4" /> CV
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
