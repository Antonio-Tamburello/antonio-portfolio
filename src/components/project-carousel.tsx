"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ProjectCarouselProps {
  images: string[];
  alt: string;
}

export function ProjectCarousel({ images, alt }: ProjectCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Mobile detection (solo lato client)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Aggiorna selectedIndex quando cambia la slide attiva
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    // Imposta subito l'indice corretto
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollTo = useCallback((idx: number) => {
    if (emblaApi) emblaApi.scrollTo(idx);
  }, [emblaApi]);

  const imageSizes = isMobile ? "100vw" : "(max-width: 768px) 100vw, 800px";

  return (
    <div className="my-6">
      <div className="embla overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="embla__container flex">
          {images.map((src, idx) => (
            <div
              className="embla__slide min-w-0 flex-[0_0_100%] relative aspect-video mx-2"
              key={src}
            >
              <Image
                src={src}
                alt={alt + ' screenshot ' + (idx + 1)}
                fill
                className="object-cover rounded-xl"
                sizes={imageSizes}
                loading={isMobile ? "lazy" : idx === 0 ? "eager" : "lazy"}
                priority={!isMobile && idx === 0}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 justify-center mt-2">
        {images.map((src, idx) => (
          <button
            key={src}
            className={`relative w-20 h-12 rounded overflow-hidden border-2 ${selectedIndex === idx ? 'border-primary' : 'border-transparent'}`}
            onClick={() => scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            tabIndex={0}
          >
            <Image
              src={src}
              alt={alt + ' thumbnail ' + (idx + 1)}
              fill
              className="object-cover"
              sizes="80px"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
