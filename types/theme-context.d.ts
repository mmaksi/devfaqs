import React, { Dispatch, SetStateAction } from 'react';

// Define the theme types
export type Mode = 'light' | 'dark' | 'system';

// Define the theme context
export interface ThemeContextType {
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}
