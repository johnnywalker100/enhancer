"use client"

import { useCallback, useRef, useState } from "react"

export function AppPreviewSection() {
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = useCallback((file: File) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            setPreview(event.target?.result as string)
        }
        reader.readAsDataURL(file)
    }, [])

    const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }, [handleFileSelect])

    const openFilePicker = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    return (
        <section id="app-preview" className="w-full bg-gradient-to-b from-white via-[#f6f1ff] to-white py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">Try it now</h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Upload a product photo and see the transformation
                    </p>
                </div>

                <div className="rounded-3xl border-4 border-[#cbb9ff] bg-white overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Left Sidebar - Settings Panel */}
                        <div className="space-y-6 p-8 bg-white border-r border-border/50">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                    <span className="text-primary-foreground text-xs font-bold">E</span>
                                </div>
                                <span className="font-semibold text-foreground text-sm">Enhancer</span>
                            </div>

                            {/* Personal Info Section */}
                            <div>
                                <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Personal info</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Upload a photo. High quality results. 2x upscaling. All photos require cropping.
                                </p>
                            </div>

                            {/* Background Color Section */}
                            <div className="pt-4 border-t border-border">
                                <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Background Color</p>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Create the background color of your product photo.
                                </p>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs cursor-pointer hover:text-foreground transition">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border border-border" />
                                        <span className="text-muted-foreground">Create the background yourself</span>
                                    </label>
                                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary">
                                        <option>White</option>
                                        <option>Custom</option>
                                    </select>
                                </div>
                            </div>

                            {/* Look & Finish Section */}
                            <div className="pt-4 border-t border-border space-y-3">
                                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Look & Finish</p>
                                <p className="text-xs text-muted-foreground">
                                    Lighting for products. Perfect shadows and branding.
                                </p>
                                <div className="space-y-2">
                                    <label className="flex items-start gap-2 text-xs cursor-pointer hover:text-foreground transition">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border border-border mt-0.5" />
                                        <span className="text-muted-foreground">
                                            Contact Shadows (Suitable)
                                            <span className="block text-[11px] text-muted-foreground/80">
                                                Adds a soft shadow under the product.
                                            </span>
                                        </span>
                                    </label>
                                    <label className="flex items-start gap-2 text-xs cursor-pointer hover:text-foreground transition">
                                        <input type="checkbox" className="w-4 h-4 rounded border border-border mt-0.5" />
                                        <span className="text-muted-foreground">
                                            Floating Logo (Drop Shadow)
                                            <span className="block text-[11px] text-muted-foreground/80">
                                                Makes the product appear like it’s on a floating surface.
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Premium Options */}
                            <div className="pt-4 border-t border-border space-y-2">
                                <label className="flex items-start gap-2 text-xs cursor-pointer hover:text-foreground transition">
                                    <input type="checkbox" className="w-4 h-4 rounded border border-border mt-0.5" />
                                    <span className="text-muted-foreground">
                                        Premium Lighting & Contrast
                                        <span className="block text-[11px] text-muted-foreground/80">
                                            Add extra lighting and contrast for a high-end look.
                                        </span>
                                    </span>
                                </label>
                            </div>

                            {/* Listing Ready */}
                            <div className="pt-4 border-t border-border space-y-2">
                                <label className="flex items-start gap-2 text-xs cursor-pointer hover:text-foreground transition">
                                    <input type="checkbox" className="w-4 h-4 rounded border border-border mt-0.5" />
                                    <span className="text-muted-foreground">
                                        Listing Ready
                                        <span className="block text-[11px] text-muted-foreground/80">
                                            Optimized for marketplace listings.
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Right Content Area - Image Upload */}
                        <div className="flex flex-col justify-center min-h-96 p-8 bg-white">
                            <div className="mb-6">
                                <p className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wide">Personal info</p>
                                <p className="text-xs text-muted-foreground">JPEG, PNG or WebP • Max 10 MB</p>
                            </div>
                            <div
                                className="w-full h-full flex items-center justify-center border-2 border-dashed border-border/40 rounded-xl cursor-pointer"
                                role="button"
                                tabIndex={0}
                                onClick={openFilePicker}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault()
                                        openFilePicker()
                                    }
                                }}
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Uploaded preview"
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                ) : (
                                    <div className="text-center space-y-3">
                                        <div className="flex justify-center">
                                            <svg
                                                className="w-12 h-12 text-muted-foreground"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <button
                                            type="button"
                                            className="text-xs font-medium text-foreground"
                                            onClick={openFilePicker}
                                        >
                                            Drop your product image here
                                        </button>
                                        <p className="text-xs text-muted-foreground">or browse to upload</p>
                                        <p className="text-[11px] text-muted-foreground">
                                            JPG, PNG or WebP • Max 4 MB • Large images are compressed
                                        </p>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileInput}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
