/** The key a block carries in the DOM (`data-search-key`) and the index lists it under. */
export const slug = (text: string): string =>
  text
    .replace(/&quot;/g, '"')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** The attribute name the search reads to find a block on the page. */
export const SEARCH_KEY_ATTR = 'data-search-key'
/** Set on the block(s) the current search points at: drawn with a green border. */
export const SEARCH_HIT_ATTR = 'data-search-hit'
