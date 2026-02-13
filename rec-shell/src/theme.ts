import { createTheme, rem } from '@mantine/core';

/**
 * Tema global para mejorar la experiencia en móvil.
 * - Espaciados y radios consistentes
 * - Breakpoints estándar
 */
export const theme = createTheme({
  breakpoints: {
    xs: '36em', // ~576px
    sm: '48em', // ~768px
    md: '62em', // ~992px
    lg: '75em', // ~1200px
    xl: '88em', // ~1408px
  },

  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(20),
    xl: rem(24),
  },

  radius: {
    xs: rem(6),
    sm: rem(8),
    md: rem(10),
    lg: rem(12),
    xl: rem(16),
  },

  components: {
    Button: { defaultProps: { radius: 'md' } },
    Card: { defaultProps: { radius: 'md' } },
  },
});
