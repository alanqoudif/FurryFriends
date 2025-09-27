import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const Theme = {
  // Common Styles
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  
  screen: {
    flex: 1,
    backgroundColor: Colors.secondaryBackground,
  },
  
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  
  // Text Styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 16,
  },
  
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  
  bodyText: {
    fontSize: 16,
    color: Colors.secondaryText,
    lineHeight: 24,
  },
  
  label: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 8,
  },
  
  // Button Styles
  primaryButton: {
    backgroundColor: Colors.primaryAccent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  primaryButtonText: {
    color: '#FFFFFF', // White text for purple buttons
    fontSize: 16,
    fontWeight: '600',
  },
  
  secondaryButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  
  secondaryButtonText: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Input Styles
  input: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.primaryText,
  },
  
  // Status Styles
  success: {
    color: Colors.successColor,
  },
  
  error: {
    color: Colors.errorColor,
  },
  
  // Glass Morphism
  glassCard: {
    backgroundColor: Colors.glassBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

export default Theme;
