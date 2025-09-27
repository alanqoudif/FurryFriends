// Theme Color Palettes
export const DarkColors = {
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

export const LightColors = {
  // Background Colors
  primaryBackground: '#FFFFFF',      // Main app background (white)
  secondaryBackground: '#F8F9FA',    // Screen backgrounds
  cardBackground: '#FFFFFF',         // Card/container backgrounds
  tabBarBackground: '#FFFFFF',       // Bottom tab bar background
  
  // Text Colors
  primaryText: '#1A1A2E',            // Main headings and important text
  secondaryText: '#6C757D',          // Secondary text and labels
  accentText: '#8A2BE2',             // Accent text (blue-purple)
  
  // Accent Colors
  primaryAccent: '#8A2BE2',          // Main accent color (blue-purple)
  successColor: '#28A745',           // Success/positive indicators
  errorColor: '#DC3545',             // Error/negative indicators
  
  // Interactive Elements
  activeTabBackground: 'rgba(138, 43, 226, 0.1)',
  inactiveTabBackground: 'transparent',
  
  // Glass Morphism
  glassBackground: 'rgba(255, 255, 255, 0.9)',
  glassBorder: 'rgba(0, 0, 0, 0.1)',
  glassHighlight: 'rgba(0, 0, 0, 0.05)',
  
  // Shadows
  shadowColor: '#000000',
  shadowOpacity: 0.1,
  shadowRadius: 8,
  
  // Status Bar
  statusBarStyle: 'dark' as const,
  statusBarBackground: '#FFFFFF',
};

// Default export for backward compatibility (light theme)
export const Colors = LightColors;

export default Colors;
