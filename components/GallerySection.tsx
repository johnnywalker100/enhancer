"use client"

import Image from "next/image"

export function GallerySection() {
    const images = [
        {
            src: "/gallery/g-1.png",
            alt: "Red Nike shoe professional product photography",
        },
        {
            src: "/gallery/g-2.png",
            alt: "Red shoe professional studio lighting",
        },
        {
            src: "/gallery/g-3.png",
            alt: "Black and white portrait photography",
        },
        {
            src: "/gallery/g-4.png",
            alt: "Red shoe professional studio lighting",
        },
        {
            src: "/gallery/g-5.png",
            alt: "Person wearing yellow jacket fashion photography",
        },
    ]

    return (
        <section className="w-full bg-background py-8 md:py-10 overflow-hidden">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 md:-mx-10">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                        >
                            <Image
                                src={image.src || "/placeholder.svg"}
                                alt={image.alt}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                priority={index < 2}
                            />
                            {/* Subtle blur gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none"></div>
                        </div>
                    ))}
                </div>

                <div
                    className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mt-5 opacity-30 blur-sm md:-mx-10"
                    style={{
                        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 70%)",
                        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 70%)",
                    }}
                >
                    {images.map((image, index) => (
                        <div
                            key={`reflection-${index}`}
                            className="relative aspect-square rounded-2xl overflow-hidden"
                        >
                            <Image
                                src={image.src}
                                alt=""
                                width={300}
                                height={300}
                                className="w-full h-full object-cover -scale-y-100"
                                aria-hidden="true"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
