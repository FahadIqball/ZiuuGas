import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from './useTheme';
import { ThemeColors } from '../enums/colors';

type StylesFactory<T extends StyleSheet.NamedStyles<T>> = (colors: ThemeColors) => T;

export const useStyles = <T extends StyleSheet.NamedStyles<T>>(factory: StylesFactory<T>): T => {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [colors, factory]);
};
