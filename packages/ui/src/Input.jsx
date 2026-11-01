// text-base = 16px on phones (avoids the iOS zoom on focus); smaller from the sm breakpoint.
export function Input({ className = '', ...props }) {
  return (
    <input
      className={`min-h-11 w-full rounded-md border border-border bg-card px-3 text-base sm:min-h-9 sm:text-sm ${className}`}
      {...props}
    />
  );
}
