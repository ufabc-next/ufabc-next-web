/**
 * Used by v-avatar (Vuetify component) to pass the initials of the username
 * @param alias - user email without 'aluno@ufabc.edu.br'
 * @returns - user initials with two characteres
 */
export default function (alias: string): string {
  if (!alias) return '';

  const aliasSpllited = alias.split('.');
  if (aliasSpllited.length > 1) {
    return alias[0] + aliasSpllited[1][0];
  }

  return alias[0] + alias[1];
}
