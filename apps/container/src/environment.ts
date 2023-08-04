const apiVersion = 'v1';

export const API_URL = (() => {
  const URL = window.location.href;

  // if (URL.includes('localhost')) {
  //   return `http://localhost:8011/${apiVersion}`;
  // }

  if (URL.includes('192.168')) {
    return URL.replace(/:\d+.*/, ':8011/v1');
  }

  return `https://api.ufabcnext.com/${apiVersion}`;
})();
