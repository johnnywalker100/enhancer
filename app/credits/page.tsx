'use client';

import { Navigation, Footer } from '@/components/Navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Sparkles, 
  Check, 
  Zap, 
  Crown,
  Star,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
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
    credits: 10,
    price: 9.99,
    pricePerCredit: 0.999,
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      '10 photo enhancements',
      'Full quality downloads',
      'All presets included',
      'Standard processing',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    credits: 50,
    price: 39.99,
    pricePerCredit: 0.799,
    popular: true,
    badge: 'Most Popular',
    savings: 'Save 20%',
    icon: <Zap className="w-6 h-6" />,
    features: [
      '50 photo enhancements',
      'Full quality downloads',
      'All presets included',
      'Priority processing',
      'Email support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    credits: 200,
    price: 119.99,
    pricePerCredit: 0.599,
    badge: 'Best Value',
    savings: 'Save 40%',
    icon: <Crown className="w-6 h-6" />,
    features: [
      '200 photo enhancements',
      'Full quality downloads',
      'All presets included',
      'Fastest processing',
      'Priority email support',
      'Bulk processing',
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
        <section className="container pt-20 pb-12 md:pt-32 md:pb-16">
          <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/25">
                <Star className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-6 leading-[1.1]">
              Choose Your Credits
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
              Select a credit package that fits your needs. Each credit enhances one photo.
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
                    "relative p-6 md:p-8 transition-all duration-300 hover:shadow-xl",
                    pkg.popular && "border-primary border-2 shadow-lg scale-105 md:scale-110"
                  )}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-white px-4 py-1 text-xs font-semibold shadow-md">
                        {pkg.badge}
                      </Badge>
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
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {pkg.credits} credits • ${pkg.pricePerCredit.toFixed(2)}/credit
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={isProcessing && selectedPackage === pkg.id}
                    className={cn(
                      "w-full h-12 text-base font-semibold rounded-full transition-all duration-200 inline-flex items-center justify-center gap-2",
                      pkg.popular
                        ? "bg-black text-white hover:bg-black/90 shadow-lg"
                        : "bg-secondary text-foreground hover:bg-secondary/80 border-2 border-border"
                    )}
                  >
                    {isProcessing && selectedPackage === pkg.id ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Purchase Credits
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </Card>
              ))}
            </div>

            {/* FAQ / Info Section */}
            <div className="mt-16 md:mt-20 text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                How Credits Work
              </h2>
              <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-6 mt-8">
                <div className="p-6 rounded-xl bg-secondary/30 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Purchase Credits
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a package that fits your needs
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
                    Each enhancement uses one credit
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-secondary/30 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Never Expire
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your credits never expire
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                All purchases are secure and processed through industry-standard payment providers.
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
