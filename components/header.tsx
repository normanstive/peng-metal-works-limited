import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/pmwl-logo.jpg"
            alt="Peng Metal Works Limited"
            width={60}
            height={60}
            className="h-14 w-14 object-contain"
          />
          <div className="hidden sm:block">
            <div className="font-bold text-xl text-primary">PMWL</div>
            <div className="text-xs text-muted-foreground">Peng Metal Works Ltd</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            About
          </Link>
          <Link
            href="#services"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Services
          </Link>
          <Link
            href="#portfolio"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Portfolio
          </Link>
          <Link href="#contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          <Link href="#contact">Request Quote</Link>
        </Button>
      </div>
    </header>
  )
}
