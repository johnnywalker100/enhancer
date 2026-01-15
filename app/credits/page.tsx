'use client';

import { Navigation, Footer } from '@/components/Navigation';
import { Card } from '@/components/ui/Card';
import { 
  Sparkles, 
  Check, 
  Zap, 
  Crown,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CreditPackage {
  id: string;
  name: string;
  creditsPerMonth: number;
  price: number;
  pricePerCredit: number;
  popular?: boolean;
  badge?: string;
  icon: React.ReactNode;
  features: string[];
  savings?: string;
}

const packages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    creditsPerMonth: 10,
    price: 9.99,
    pricePerCredit: 0.999,
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      '10 credits per month',
      'Full quality downloads',
      'All presets included',
      'Standard processing',
      'Cancel anytime',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    creditsPerMonth: 50,
    price: 39.99,
    pricePerCredit: 0.799,
    popular: true,
    badge: 'Most Popular',
    savings: 'Save 20%',
    icon: <Zap className="w-6 h-6" />,
    features: [
      '50 credits per month',
      'Full quality downloads',
      'All presets included',
      'Priority processing',
      'Email support',
      'Cancel anytime',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    creditsPerMonth: 200,
    price: 119.99,
    pricePerCredit: 0.599,
    badge: 'Best Value',
    savings: 'Save 40%',
    icon: <Crown className="w-6 h-6" />,
    features: [
      '200 credits per month',
      'Full quality downloads',
      'All presets included',
      'Fastest processing',
      'Priority email support',
      'Bulk processing',
      'Cancel anytime',
    ],
  },
];

export default function CreditsPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async (packageId: string) => {
    setSelectedPackage(packageId);
    setIsProcessing(true);

    // TODO: Implement actual payment processing
    // For now, just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Purchase initiated for package:', packageId);
    alert('Payment processing not yet implemented. This will integrate with Stripe or another payment provider.');
    
    setIsProcessing(false);
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container pt-12 pb-8 md:pt-20 md:pb-12">
          <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-6 leading-[1.1]">
              Choose Your Credits
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
              Monthly plans that fit your workflow. Each credit enhances one photo.
            </p>
            
            {/* Current Balance - Placeholder */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Current balance: <span className="font-bold">0 credits</span>
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container pb-20 md:pb-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={cn(
                    "relative p-6 md:p-8 transition-all duration-300 hover:shadow-xl flex flex-col",
                    pkg.popular && "border-primary border-2 shadow-lg scale-105 md:scale-110"
                  )}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-black text-white px-4 py-1.5 text-xs font-semibold shadow-lg rounded-full">
                        {pkg.badge}
                      </div>
                    </div>
                  )}

                  {/* Icon & Name */}
                  <div className="mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                      pkg.popular 
                        ? "bg-primary text-white" 
                        : "bg-secondary text-foreground"
                    )}>
                      {pkg.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {pkg.name}
                    </h3>
                    {pkg.savings && (
                      <p className="text-sm font-medium text-primary">
                        {pkg.savings}
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl md:text-5xl font-bold text-foreground">
                        ${pkg.price}
                      </span>
                      <span className="text-lg text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {pkg.creditsPerMonth} credits/month • ${pkg.pricePerCredit.toFixed(2)}/credit
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={isProcessing && selectedPackage === pkg.id}
                    className={cn(
                      "w-full h-12 text-base font-semibold rounded-full transition-all duration-200 inline-flex items-center justify-center gap-2",
                      "bg-black text-white hover:bg-black/90 shadow-lg",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isProcessing && selectedPackage === pkg.id ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </Card>
              ))}
            </div>

            {/* FAQ / Info Section */}
            <div className="mt-16 md:mt-20 text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                How It Works
              </h2>
              <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-6 mt-8">
                <div className="p-6 rounded-xl bg-secondary/30 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Choose Your Plan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Select a monthly plan that fits your workflow
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-secondary/30 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Enhance Photos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use one credit per photo enhancement
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-secondary/30 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Cancel Anytime
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    No long-term commitment required
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                All subscriptions are secure and processed through industry-standard payment providers.
                <br />
                Need help? <a href="mailto:support@example.com" className="text-primary hover:underline">Contact support</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
