import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', loading, children, className = '', disabled, ...props }) => {
  const base = 'px-4 py-2 rounded-md font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-zinc-700 text-white hover:bg-zinc-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-zinc-300 hover:bg-zinc-700',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? <span className="animate-spin mr-2">⏳</span> : null}
      {children}
    </button>
  );
};

export default Button;
