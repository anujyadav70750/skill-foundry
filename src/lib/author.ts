export const SKILL_FOUNDRY_AUTHOR_ID = 'skill-foundry';

export function authorPath(authorId: string) {
  return authorId === SKILL_FOUNDRY_AUTHOR_ID ? '/author/' : '/authors/' + encodeURIComponent(authorId) + '/';
}
