import React from 'react';

import { useLocalStorage } from '../../../hooks';

export type ThemeContextType = {
  theme: 'dark' | 'light';
  change: (options: ThemeContextHandlerType) => void;
};

type ThemeContextHandlerType = {
  theme: 'dark' | 'light';
};

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'light',
  change: () => {},
});

const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { value, setValue } = useLocalStorage<ThemeContextType['theme']>('theme', {
    initialValue: 'light',
  });

  const change = React.useCallback(
    ({ theme }: ThemeContextHandlerType) => {
      setValue(theme);
    },
    [setValue]
  );

  // Dark Mode
  React.useEffect(() => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (value === 'dark' || (!value && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // // Whenever the user explicitly chooses light mode
    // localStorage.theme = 'light';

    // // Whenever the user explicitly chooses dark mode
    // localStorage.theme = 'dark';

    // // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem('theme');
  }, [change, value]);

  return <ThemeContext.Provider value={{ theme: value, change }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
