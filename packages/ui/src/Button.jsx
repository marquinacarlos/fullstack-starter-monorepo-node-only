const variants = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
  secondary: 'border border-border bg-card text-foreground hover:bg-background',
  danger: 'bg-danger text-primary-foreground hover:opacity-90',
};

// min-h-11 = 44px touch target on phones; smaller from the sm breakpoint.
export function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 text-base font-medium disabled:opacity-50 sm:min-h-9 sm:text-sm ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
