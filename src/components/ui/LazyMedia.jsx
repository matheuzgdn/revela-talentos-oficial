import React from 'react';

function useInViewOnce({ rootMargin = '320px 0px', disabled = false } = {}) {
  const ref = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(disabled);

  React.useEffect(() => {
    if (disabled || isVisible) {
      setIsVisible(true);
      return undefined;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [disabled, isVisible, rootMargin]);

  return { ref, isVisible };
}

export function LazySection({
  children,
  className,
  style,
  minHeight,
  placeholder,
  rootMargin = '420px 0px',
}) {
  const { ref, isVisible } = useInViewOnce({ rootMargin });

  return (
    <div
      ref={ref}
      className={className}
      style={
        isVisible
          ? style
          : {
              ...style,
              minHeight,
            }
      }
    >
      {isVisible ? children : placeholder || null}
    </div>
  );
}

export function LazyImage({
  src,
  alt,
  className,
  style,
  eager = false,
  loading,
  rootMargin = '320px 0px',
  ...props
}) {
  const { ref, isVisible } = useInViewOnce({ rootMargin, disabled: eager });

  if (!isVisible) {
    return <div ref={ref} className={className} style={style} aria-hidden="true" />;
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading || 'eager'}
      decoding="async"
      {...props}
    />
  );
}

export function LazyVideo({
  src,
  className,
  style,
  eager = false,
  rootMargin = '320px 0px',
  preload,
  children,
  autoPlay,
  ...props
}) {
  const { ref, isVisible } = useInViewOnce({ rootMargin, disabled: eager });

  React.useEffect(() => {
    const node = ref.current;
    if (!isVisible || !node || !autoPlay || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          const playPromise = node.play();
          if (playPromise?.catch) playPromise.catch(() => {});
        } else {
          node.pause();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [autoPlay, isVisible]);

  if (!isVisible) {
    return <div ref={ref} className={className} style={style} aria-hidden="true" />;
  }

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      autoPlay={autoPlay}
      preload={preload || (eager || autoPlay ? 'metadata' : 'none')}
      {...props}
    >
      {children || <source src={src} type="video/mp4" />}
    </video>
  );
}
