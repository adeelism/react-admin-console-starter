export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span role="status" className="spinner">
      {label}…
    </span>
  );
}
