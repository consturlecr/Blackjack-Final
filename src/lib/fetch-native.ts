// Native fetch wrapper to avoid polyfill assignment issues
const fetchNative = typeof window !== 'undefined' ? window.fetch.bind(window) : undefined;
export default fetchNative;
export const fetch = fetchNative;
export const Request = typeof window !== 'undefined' ? window.Request : undefined;
export const Response = typeof window !== 'undefined' ? window.Response : undefined;
export const Headers = typeof window !== 'undefined' ? window.Headers : undefined;
