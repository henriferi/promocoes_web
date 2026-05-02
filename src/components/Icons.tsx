import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 21s-6.7-4.35-9.33-8.1C-0.67 8.22 1.5 3 6.17 3c2.2 0 4.01 1.18 5 3 0.99-1.82 2.8-3 5-3C20.83 3 23 8.22 21.33 12.9 18.7 16.65 12 21 12 21Z" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M5 8h14l-1.1 11.5a2 2 0 0 1-1.99 1.5H8.09A2 2 0 0 1 6.1 19.5L5 8Z" />
      <path d="M9 9V7a3 3 0 1 1 6 0v2" />
    </svg>
  );
}

export function FireIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12.1 2.4c.4 3-1.2 4.7-2.6 6.2-1.4 1.5-2.7 2.9-2.7 5.3a5.2 5.2 0 0 0 10.4 0c0-2.2-.8-3.8-2.1-5.3-.9-1.1-1.8-2.3-1.7-4.2-.7.5-1 1.4-1.3 2Z" />
      <path d="M10.3 13.9a2.2 2.2 0 1 0 4.4 0c0-1-.5-1.7-1.1-2.3-.4-.5-.9-.9-.9-1.7-.8.5-2.4 1.7-2.4 4Z" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
      <path d="m18.5 13 0.7 2.3 2.3 0.7-2.3 0.7-0.7 2.3-0.7-2.3-2.3-0.7 2.3-0.7 0.7-2.3Z" />
      <path d="m5.5 14 0.9 2.8L9.2 17l-2.8 0.9-0.9 2.8-0.9-2.8L1.8 17l2.8-0.9 0.9-2.8Z" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
