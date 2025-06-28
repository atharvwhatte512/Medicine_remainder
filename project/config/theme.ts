import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#FF6B6B',
  primaryGradient: ['#FF6B6B', '#FF9B6B'],
  secondary: '#FFD166',
  secondaryGradient: ['#FFD166', '#FFE799'],
  background: '#F5F5F5',
  textDark: '#333333',
  textLight: '#FFFFFF',
  // Additional utility colors
  error: '#FF4444',
  success: '#4CAF50',
  warning: '#FFA000',
  info: '#2196F3',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textDark,
  },
  body: {
    fontSize: 16,
    color: colors.textDark,
  },
  caption: {
    fontSize: 14,
    color: colors.textDark,
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.textLight,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.textLight,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: spacing.sm,
  },
}); 