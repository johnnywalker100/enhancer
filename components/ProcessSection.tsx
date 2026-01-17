export function ProcessSection() {
    const steps = [
        {
            number: "1",
            title: "Upload a photo",
            description: "Drop a photo anywhere. We keep all fine details intact.",
        },
        {
            number: "2",
            title: "Choose the finish",
            description: "Pick shadows and lighting style that fits your brand.",
        },
        {
            number: "3",
            title: "Enhance",
            description: "AI generates studio-quality lighting and background.",
        },
        {
            number: "4",
            title: "Download",
            description: "High-resolution PNG ready for any platform.",
        },
    ]

    return (
        <section id="process" className="relative w-full overflow-hidden bg-white py-20 md:py-28">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-[#f4f1ff] via-[#f6f4ff] to-transparent"></div>
                <div className="absolute inset-x-0 top-56 h-44"></div>
            </div>
            <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">Simple process.</h2>
                    <p className="text-sm md:text-base text-muted-foreground">Four steps to professional product photos</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className="w-3 h-3 rounded-full bg-primary mb-6 md:mb-8"></div>

                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-border/50 flex items-center justify-center text-sm font-semibold text-foreground mb-4">
                                {step.number}
                            </div>
                            <div className="bg-[radial-gradient(circle_at_center,rgba(123,97,255,0.12),transparent_100%)]">
                                <h3 className="text-sm md:text-base font-semibold text-foreground mb-2">{step.title}</h3>

                                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-[220px]">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
