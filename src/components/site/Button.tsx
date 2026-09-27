import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from './icons/Icon';

type Variant = 'primary' | 'night' | 'violet' | 'ghost';
type Common = { variant: Variant; size?: 'md' | 'lg'; icon?: IconName; iconEnd?: IconName };

const cls = (variant: Variant, size: 'md' | 'lg', extra?: string) =>
  [`btn-${variant}`, size === 'lg' ? 'btn-lg' : null, extra].filter(Boolean).join(' ');

/** §3.4 button styles. WP0b owns the CSS. */
export function Button({ variant, size = 'md', icon, iconEnd, className, children, type = 'button', ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cls(variant, size, className)} {...rest}>
      {icon ? <Icon name={icon} filled /> : null}
      {children}
      {iconEnd ? <Icon name={iconEnd} /> : null}
    </button>
  );
}

export function ButtonLink({ variant, size = 'md', icon, iconEnd, className, children, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a className={cls(variant, size, className)} {...rest}>
      {icon ? <Icon name={icon} filled /> : null}
      {children}
      {iconEnd ? <Icon name={iconEnd} /> : null}
    </a>
  );
}
