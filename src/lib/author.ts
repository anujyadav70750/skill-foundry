export const SKILL_FOUNDRY_AUTHOR_ID = 'skill-foundry';

export function authorPath(authorId: string) {
  return authorId === SKILL_FOUNDRY_AUTHOR_ID ? '/author/' : '/authors/' + encodeURIComponent(authorId) + '/';
}

export function authorCategorySlug(category: string) {
  return String(category || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'other';
}
