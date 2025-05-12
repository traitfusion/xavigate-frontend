export type Size = 'sm' | 'md' | 'lg';

export type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';

export type LabelPosition = 'top' | 'left';

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithClassName {
  className?: string;
}
