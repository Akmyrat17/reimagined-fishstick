
export function makeSlug(text: string): string {
    if (!text) return 'untitled';

    // normalize Unicode (accents, diacritics)
    let slug = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

    // lowercase
    slug = slug.toLowerCase();

    // replace spaces, underscores, multiple dashes with a single dash
    slug = slug.replace(/[\s_]+/g, '-');

    // remove all non-alphanumeric, non-dash characters
    slug = slug.replace(/[^a-z0-9-]/g, '');

    // collapse multiple consecutive dashes
    slug = slug.replace(/-+/g, '-');

    // trim leading/trailing dashes
    slug = slug.replace(/^-+|-+$/g, '');

    // fallback if slug is empty
    if (!slug) slug = 'untitled';

    return slug;
}
