/** Pure helper, safe to import from Client Components — no SDK, no env reads. */
export function mediaProxyUrl(key: string) {
  return `/api/media/${key}`;
}
