'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';

type CustomThemeProviderProps = ThemeProviderProps & {
  children: React.ReactNode;
};

const CustomThemeContext = React.createContext<{
  colorTheme: string;
  setColorTheme: (theme: string) => void;
} | null>(null);

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  const [colorTheme, _setColorTheme] = React.useState('default');

  React.useEffect(() => {
    const storedTheme = localStorage.getItem('color-theme');
    if (storedTheme) {
      _setColorTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  }, []);

  const setColorTheme = (theme: string) => {
    _setColorTheme(theme);
    localStorage.setItem('color-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <NextThemesProvider {...props}>
      <CustomThemeContext.Provider value={{ colorTheme, setColorTheme }}>
        {children}
      </CustomThemeContext.Provider>
    </NextThemesProvider>
  );
}

export const useTheme = () => {
  const nextThemeContext = useNextTheme();
  const customThemeContext = React.useContext(CustomThemeContext);

  if (customThemeContext === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return { ...nextThemeContext, ...customThemeContext };
};
