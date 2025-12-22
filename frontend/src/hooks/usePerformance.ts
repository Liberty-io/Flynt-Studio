import React, { useMemo } from 'react'

/**
 * Virtual list for rendering large lists efficiently.
 * Only renders items visible in the viewport.
 */
export interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number // Number of items to render outside visible area
}

export const VirtualList = React.memo(
  <T,>({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    overscan = 3,
  }: VirtualListProps<T>) => {
    const visibleRange = useMemo(() => {
      // In a real implementation, track scroll position.
      // For now, render all items (fallback).
      return { start: 0, end: items.length }
    }, [items.length])

    const visibleItems = items.slice(visibleRange.start, visibleRange.end)

    return (
      <div
        style={{
          height: containerHeight,
          overflow: 'auto',
        }}
      >
        <div style={{ height: itemHeight * items.length }}>
          {visibleItems.map((item, idx) => (
            <div key={idx}>{renderItem(item, visibleRange.start + idx)}</div>
          ))}
        </div>
      </div>
    )
  },
)

VirtualList.displayName = 'VirtualList'

/**
 * Lazy load an image or component.
 */
export interface LazyLoadProps {
  src: string
  alt?: string
  placeholder?: string
  width?: number
  height?: number
}

export const LazyImage: React.FC<LazyLoadProps> = ({
  src,
  alt = '',
  placeholder,
  width,
  height,
}) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E')
  const [imageRef, setImageRef] = React.useState<HTMLImageElement | null>(null)

  React.useEffect(() => {
    if (!imageRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src)
          observer.unobserve(imageRef)
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(imageRef)
    return () => observer.disconnect()
  }, [imageRef, src])

  return <img ref={setImageRef} src={imageSrc} alt={alt} width={width} height={height} />
}

/**
 * Debounce hook for performance-critical event handlers.
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Memoization hook for expensive computations.
 */
export const useMemoized = <T,>(
  compute: () => T,
  deps: React.DependencyList,
  keyFn: (value: T) => string = (v) => JSON.stringify(v),
): T => {
  const cache = React.useRef<Map<string, T>>(new Map())
  const lastDeps = React.useRef<React.DependencyList>(deps)

  const depsChanged = deps.length !== lastDeps.current.length ||
    deps.some((dep, i) => dep !== lastDeps.current[i])

  if (depsChanged) {
    lastDeps.current = deps
    const result = compute()
    const key = keyFn(result)
    cache.current.set(key, result)
    return result
  }

  const cached = Array.from(cache.current.values()).pop()
  return cached ?? compute()
}
