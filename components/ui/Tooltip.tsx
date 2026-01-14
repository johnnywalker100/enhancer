'use client';

import * as React from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ content, children, side = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), 200);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent',
  };

  return (
    <span 
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <span
          role="tooltip"
          className={`
            absolute z-50 ${positionStyles[side]}
            px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg
            shadow-lg whitespace-nowrap
            animate-in fade-in-0 zoom-in-95 duration-100
            ${className}
          `}
        >
          {content}
          <span 
            className={`
              absolute w-0 h-0 border-4
              ${arrowStyles[side]}
            `}
          />
        </span>
      )}
    </span>
  );
}

interface TooltipIconProps {
  content: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function TooltipIcon({ content, side = 'top' }: TooltipIconProps) {
  return (
    <Tooltip content={content} side={side}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-xs"
        aria-label="More information"
      >
        ?
      </button>
    </Tooltip>
  );
}
