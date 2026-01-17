import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">E</span>
              </div>
              <span className="font-semibold text-foreground text-sm">Enhancer</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xs leading-relaxed">
              AI-powered product enhancement that preserves details, adds professional lighting, and removes backgrounds.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-xs md:text-sm">Menu</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/credits" className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition">
                  Credits
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-xs md:text-sm">Info</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition">
                  Demos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-xs md:text-sm">
              Join Our Newsletter to get regular updates
            </h4>
            <p className="text-xs text-muted-foreground mb-4">Subscribe our newsletter to get more free resources</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 transition flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7m0 0l-7 7m7-7H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
          <p>Copyright © 2024 Enhancer. All rights reserved.</p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground transition">
              Terms of Use
            </Link>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Link href="#" aria-label="Facebook" className="hover:text-foreground transition">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" aria-label="Instagram" className="hover:text-foreground transition">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" aria-label="Twitter" className="hover:text-foreground transition">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="hover:text-foreground transition">
                <Linkedin className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
