import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product Photo Enhancer',
  description: 'Enhance your product photos with AI-powered editing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
