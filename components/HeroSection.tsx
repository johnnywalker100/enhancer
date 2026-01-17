import { Button } from "@/components/ui/Button"

export function HeroSection() {
    return (
        <section className="w-full bg-background pt-16 pb-20 md:pt-24 md:pb-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Heading */}
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-2 text-balance leading-[1.05] tracking-[-0.06em]">
                    Turn any photos
                </h1>

                <h2 className="font-serif text-4xl md:text-5xl font-light italic text-primary mb-6 text-balance">
                    into studio shots.
                </h2>

                {/* Description */}
                <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                    AI-powered product enhancement that preserves details, adds professional lighting, and removes backgrounds.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Button
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 font-semibold text-sm"

                    >
                        <a href="#demo">Try for free</a>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full px-8 font-semibold border border-foreground text-foreground hover:bg-muted/50 bg-transparent text-sm"
                    >
                        <a href="#process">See how it works</a>
                    </Button>
                </div>
            </div>
        </section>
    )
}
