'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

interface AccordionProps {
  type?: 'single' | 'multiple';
  children: React.ReactNode;
  defaultValue?: string | string[];
  className?: string;
}

export function Accordion({ type = 'single', children, defaultValue, className }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const toggleItem = React.useCallback((value: string) => {
    setOpenItems((prev) => {
      if (type === 'single') {
        return prev.includes(value) ? [] : [value];
      }
      return prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
    });
  }, [type]);

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn('divide-y divide-border/50', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be used within Accordion');
  
  const isOpen = context.openItems.includes(value);

  return (
    <div 
      className={cn('py-1', className)} 
      data-state={isOpen ? 'open' : 'closed'}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            value, 
            isOpen 
          });
        }
        return child;
      })}
    </div>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  value?: string;
  isOpen?: boolean;
}

export function AccordionTrigger({ children, className, value, isOpen }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');

  return (
    <button
      type="button"
      onClick={() => value && context.toggleItem(value)}
      className={cn(
        'flex w-full items-center justify-between py-3 text-sm font-medium',
        'text-left transition-colors hover:text-foreground',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg',
        isOpen ? 'text-foreground' : 'text-muted-foreground',
        className
      )}
      aria-expanded={isOpen}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}

export function AccordionContent({ children, className, isOpen }: AccordionContentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={contentRef}
      className={cn(
        'overflow-hidden transition-all duration-200 ease-out',
        isOpen 
          ? 'animate-in fade-in slide-in-from-top-1 duration-200' 
          : 'hidden',
        className
      )}
      data-state={isOpen ? 'open' : 'closed'}
    >
      <div className="pb-4 pt-0">
        {children}
      </div>
    </div>
  );
}
