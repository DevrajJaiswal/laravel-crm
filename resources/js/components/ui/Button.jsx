import { Link } from 'react-router-dom';
import { forwardRef } from 'react';

const variantClasses = {
    primary: 'bg-slate-950 text-white hover:bg-slate-800 border border-slate-950 shadow-sm',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200',
    dark: 'bg-slate-950 text-white hover:bg-slate-800 border border-slate-950 shadow-sm',
    danger: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent',
};

const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
};

function buildClasses({ variant, size, className }) {
    return [
        'inline-flex cursor-pointer items-center justify-center rounded-2xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        className,
    ].join(' ');
}

const Button = forwardRef(function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    to,
    href,
    type = 'button',
    children,
    ...props
}, ref) {
    const classes = buildClasses({ variant, size, className });

    if (to) {
        return <Link ref={ref} to={to} className={classes} {...props}>{children}</Link>;
    }

    if (href) {
        return <a ref={ref} href={href} className={classes} {...props}>{children}</a>;
    }

    return (
        <button ref={ref} type={type} className={classes} {...props}>
            {children}
        </button>
    );
});

export default Button;
