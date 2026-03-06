'use client';

import dynamic from 'next/dynamic';

// Konva relies heavily on window and standard DOM objects that don't exist during SSR.
// We dynamically import the wrapper and disable SSR.
const CanvasStageDynamic = dynamic(
  () => import('../components/canvas/CanvasStage'),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <CanvasStageDynamic />
    </main>
  );
}
