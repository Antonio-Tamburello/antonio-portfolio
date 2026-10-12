'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState, type KeyboardEvent, type WheelEvent } from 'react';

type ScreenshotGalleryProps = {
  images: string[];
  title: string;
};

/**
 * Grid of screenshots. Clicking one opens a full-screen viewer on the same page:
 * swipe or scroll sideways (touch, trackpad or mouse wheel), use the arrows or
 * ← →, close with Esc or the X.
 */
export function ScreenshotGallery({ images, title }: ScreenshotGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wheelLock = useRef(false);
  const [index, setIndex] = useState(0);

  const scrollToSlide = (i: number, behavior: 'smooth' | 'instant' = 'smooth') => {
    const track = trackRef.current;
    if (!track) return;
    const target = Math.max(0, Math.min(images.length - 1, i));
    track.scrollTo({ left: target * track.clientWidth, behavior });
  };

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
    // wait for the dialog to be laid out, then jump to the clicked image
    requestAnimationFrame(() => scrollToSlide(i, 'instant'));
  };
  const close = () => dialogRef.current?.close();

  // Keep the counter in sync while the user swipes
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollToSlide(index + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollToSlide(index - 1);
    }
  };

  // A vertical mouse wheel moves one image at a time (trackpads already scroll sideways)
  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || wheelLock.current) return;
    wheelLock.current = true;
    scrollToSlide(index + (event.deltaY > 0 ? 1 : -1));
    setTimeout(() => (wheelLock.current = false), 450);
  };

  if (images.length === 0) return null;

  const navButton =
    'flex size-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 disabled:opacity-30';

  return (
    <>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => open(i)}
            aria-label={`Open screenshot ${i + 1} of ${images.length}`}
            className="group relative block aspect-video cursor-zoom-in overflow-hidden rounded-[28px] border border-border bg-card"
          >
            <Image
              src={src}
              alt={`${title} screenshot ${i + 1}`}
              fill
              sizes="(min-width: 640px) 600px, 100vw"
              className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onKeyDown={onKeyDown}
        aria-label={`${title} screenshots`}
        className="m-0 h-dvh max-h-none w-dvw max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-black/90"
      >
        {/* Horizontal track: one image per screen, snaps while swiping */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          onWheel={onWheel}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <div
              key={src}
              onClick={(event) => event.target === event.currentTarget && close()}
              className="relative h-full w-full shrink-0 snap-center px-4 pb-24 pt-20 sm:px-16"
            >
              <div className="relative h-full w-full">
                <Image
                  src={src}
                  alt={`${title} screenshot ${i + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  loading={Math.abs(i - index) <= 1 ? 'eager' : 'lazy'}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="fixed inset-x-0 bottom-6 flex items-center justify-center gap-3 text-white">
          <button
            type="button"
            onClick={() => scrollToSlide(index - 1)}
            disabled={index === 0}
            aria-label="Previous screenshot"
            className={navButton}
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="min-w-16 text-center font-mono text-sm" aria-live="polite">
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={() => scrollToSlide(index + 1)}
            disabled={index === images.length - 1}
            aria-label="Next screenshot"
            className={navButton}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className={`fixed right-5 top-5 ${navButton}`}
        >
          <X className="size-5" />
        </button>
      </dialog>
    </>
  );
}
