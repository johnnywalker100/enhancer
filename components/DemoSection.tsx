"use client"

import { Button } from "@/components/ui/Button"
import Image from "next/image"

export function DemoSection() {
    return (
        <section id="demo" className="w-full bg-gradient-to-b from-white via-[#f6f1ff] to-white py-20 md:py-28">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">See it in action</h2>
                    <p className="text-sm md:text-base text-muted-foreground">Real example of enhancement</p>
                </div>

                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white border-4 border-[#cbb9ff] mb-10 shadow-2xl">
                    <Image
                        src="/car.png"
                        alt="Before and after car photo enhancement demonstration"
                        width={1280}
                        height={720}
                        className="w-full h-full object-cover"
                        priority
                    />

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {/* Vertical divider line */}
                        <div className="w-1.5 h-3/5 bg-gradient-to-b from-primary/30 via-primary/80 to-primary/30 shadow-lg rounded-full"></div>
                        {/* Center slider dot */}
                        <div className="absolute w-5 h-5 bg-primary rounded-full border-3 border-white shadow-xl flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 font-semibold text-sm transition-all duration-200"
                    >
                        <a href="#app-preview">Try with your photo</a>
                    </Button>
                </div>
            </div>
        </section>
    )
}
