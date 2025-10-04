export type AnalyticsPayload = Record<string, unknown>;

const formatPayload = (payload: AnalyticsPayload) => {
  try {
    return JSON.stringify(payload);
  } catch {
    return '[unserializable payload]';
  }
};

export const trackEvent = (eventName: string, payload: AnalyticsPayload = {}) => {
  const message = `[analytics] ${eventName}`;
  const serialized = formatPayload(payload);
  console.debug(`${message} ${serialized}`);
};
