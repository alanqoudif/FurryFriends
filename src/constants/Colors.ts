// Dark Theme Color Palette
export const Colors = {
  // Background Colors
  primaryBackground: '#1A1A2E',      // Main app background (darkest)
  secondaryBackground: '#2C2C4A',    // Screen backgrounds
  cardBackground: '#363658',         // Card/container backgrounds
  tabBarBackground: '#363658',       // Bottom tab bar background
  
  // Text Colors
  primaryText: '#FFFFFF',            // Main headings and important text
  secondaryText: '#CCCCCC',          // Secondary text and labels
  accentText: '#8A2BE2',             // Accent text (blue-purple)
  
  // Accent Colors
  primaryAccent: '#8A2BE2',          // Main accent color (blue-purple)
  successColor: '#4CAF50',           // Success/positive indicators
  errorColor: '#F44336',             // Error/negative indicators
  
  // Interactive Elements
  activeTabBackground: 'rgba(138, 43, 226, 0.3)',
  inactiveTabBackground: 'transparent',
  
  // Glass Morphism
  glassBackground: 'rgba(54, 54, 88, 0.8)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassHighlight: 'rgba(255, 255, 255, 0.2)',
  
  // Shadows
  shadowColor: '#000000',
  shadowOpacity: 0.3,
  shadowRadius: 12,
  
  // Status Bar
  statusBarStyle: 'light' as const,
  statusBarBackground: '#2C2C4A',
};

export default Colors;
