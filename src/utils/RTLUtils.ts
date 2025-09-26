import { I18nManager } from 'react-native';

// RTL Configuration
export const configureRTL = () => {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
};

// RTL Style Helper
export const getRTLStyle = (ltrStyle: any, rtlStyle: any) => {
  return I18nManager.isRTL ? rtlStyle : ltrStyle;
};

// RTL Text Alignment
export const getTextAlign = () => {
  return I18nManager.isRTL ? 'right' : 'left';
};

// RTL Flex Direction
export const getFlexDirection = () => {
  return I18nManager.isRTL ? 'row-reverse' : 'row';
};

// RTL Margin/Padding Helper
export const getRTLMargin = (left: number, right: number) => {
  return I18nManager.isRTL ? { marginLeft: right, marginRight: left } : { marginLeft: left, marginRight: right };
};

export const getRTLPadding = (left: number, right: number) => {
  return I18nManager.isRTL ? { paddingLeft: right, paddingRight: left } : { paddingLeft: left, paddingRight: right };
};

export default {
  configureRTL,
  getRTLStyle,
  getTextAlign,
  getFlexDirection,
  getRTLMargin,
  getRTLPadding,
};
