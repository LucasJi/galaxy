import React from 'react';
import { Navbar } from '@components';

export const metadata = {
  title: 'Starry Blog',
  description: 'Display blogs written in Obsidian.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar className="h-[10%]" />
        {children}
      </body>
    </html>
  );
}