import { I18nManager } from "react-native";

export const isRTL = I18nManager.isRTL;

export function forceRTL(enable: boolean): void {
  I18nManager.allowRTL(enable);
  I18nManager.forceRTL(enable);
}

// Directional style helpers
export function marginStart(value: number) {
  return isRTL ? { marginRight: value } : { marginLeft: value };
}

export function marginEnd(value: number) {
  return isRTL ? { marginLeft: value } : { marginRight: value };
}

export function paddingStart(value: number) {
  return isRTL ? { paddingRight: value } : { paddingLeft: value };
}

export function paddingEnd(value: number) {
  return isRTL ? { paddingLeft: value } : { paddingRight: value };
}

export function flexRow() {
  return { flexDirection: isRTL ? ("row-reverse" as const) : ("row" as const) };
}

export function textAlign() {
  return { textAlign: isRTL ? ("right" as const) : ("left" as const) };
}

export function absoluteStart(value: number) {
  return isRTL ? { right: value } : { left: value };
}

export function absoluteEnd(value: number) {
  return isRTL ? { left: value } : { right: value };
}
