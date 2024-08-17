import React from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface ButtonType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Button({ children, className = '', disabled, ...rest }: ButtonType) {
  return (
    <button
      className={classNames(
        `${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } bg-white border border-gray-300 font-medium inline-flex items-center px-4 py-2 relative rounded-md text-gray-700 text-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:dark-gray-900`,
        className
      )}
      type="button"
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PageButton({ active, children, className = '', disabled, ...rest }: ButtonType) {
  return (
    <button
      type="button"
      className={classNames(
        `border ${
          active
            ? 'bg-primary-500 border border-primary-500 text-gray-100'
            : disabled
            ? 'border-gray-300 bg-gray-200 cursor-not-allowed text-gray-500 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300'
            : 'border-gray-300 bg-white cursor-pointer text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:dark-gray-900'
        } font-medium inline-flex items-center p-2 relative text-sm`,
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SortIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={classNames('w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100', className)}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 320 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
    </svg>
  );
}

export function SortUpIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={classNames('w-4 h-4 text-gray-400', className)}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 320 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
    </svg>
  );
}

export function SortDownIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={classNames('w-4 h-4 text-gray-400', className)}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 320 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
    </svg>
  );
}
