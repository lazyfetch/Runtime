import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-sm text-zinc-400">{label}</label>}
    <input
      className={`bg-zinc-800 border ${error ? 'border-red-500' : 'border-zinc-600'} text-white rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
);

export default Input;
