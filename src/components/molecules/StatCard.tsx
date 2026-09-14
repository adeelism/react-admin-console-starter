import type { Icon } from '@phosphor-icons/react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: Icon;
}

export function StatCard({ label, value, icon: IconComponent }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <IconComponent size={18} weight="duotone" className="text-accent" aria-hidden />
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-text">{value}</p>
    </div>
  );
}
