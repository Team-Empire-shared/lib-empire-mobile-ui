export function DynamicallyInjectedByGestureHandler<T>(object: T): T {
  return object;
}
export function ConditionallyIgnoredEventHandlers<T>(value: T): T | void {
  return value;
}
