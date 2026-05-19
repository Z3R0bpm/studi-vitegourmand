"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { getDishTypeLabel } from "../dashboard/dishTypes"
import styles from "./menus.module.css"

export type CarouselSlide = {
  id: number
  title: string
  dishType: string
}

function dishPictureUrl(id: number) {
  return `/api/dishes/${id}/picture`
}

export function DishImageCarousel({
  slides,
  className,
}: {
  slides: CarouselSlide[]
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const carouselClass = [styles.carousel, className].filter(Boolean).join(" ")

  const go = useCallback(
    (delta: number) => {
      if (slides.length === 0) return
      setIndex((current) => (current + delta + slides.length) % slides.length)
    },
    [slides.length],
  )

  useEffect(() => {
    setIndex(0)
  }, [slides])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => go(1), 5000)
    return () => clearInterval(timer)
  }, [slides.length, go])

  if (slides.length === 0) {
    return (
      <div className={carouselClass}>
        <Image
          className={styles.carouselImage}
          src="/next.svg"
          alt="Aucune photo disponible"
          width={400}
          height={260}
          priority
        />
      </div>
    )
  }

  const current = slides[index]

  return (
    <div className={carouselClass}>
      <Image
        key={current.id}
        className={styles.carouselImage}
        src={dishPictureUrl(current.id)}
        alt={current.title}
        width={400}
        height={260}
        unoptimized
        priority={index === 0}
      />

      <div className={styles.carouselCaption}>
        <span className={styles.carouselDishTitle}>{current.title}</span>
        <span className={styles.carouselDishType}>
          {getDishTypeLabel(current.dishType)}
        </span>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.carouselControl} ${styles.carouselPrev}`}
            onClick={() => go(-1)}
            aria-label="Photo précédente">
            ‹
          </button>
          <button
            type="button"
            className={`${styles.carouselControl} ${styles.carouselNext}`}
            onClick={() => go(1)}
            aria-label="Photo suivante">
            ›
          </button>
          <div className={styles.carouselDots} role="tablist" aria-label="Photos du menu">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${slide.title}, photo ${i + 1} sur ${slides.length}`}
                className={`${styles.carouselDot} ${i === index ? styles.carouselDotActive : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
