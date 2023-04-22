// const apiVersion = 'v1';

// export const API_URL = (() => {
//   const URL = window.location.href;

//   if (URL.includes('localhost')) {
//     return `http://localhost:8011/${apiVersion}`;
//   }

//   if (URL.includes('192.168')) {
//     return URL.replace(/:\d+.*/, ':8011/v1');
//   }

//   return `https://api.ufabcnext.com/${apiVersion}`;
// })();

/**
 * The code above is "paused" because the original code has
 * 'HOME_URL' used in the registration page in the development environment.
 * For now, I've made occasional changes to make the "apiVersion" variable
 * compatible, but in the future this may also be rewritten
 *
 * I just kept the libraries because I have no idea of the impact of this
 * on the system as a whole, but I already suggest removal in
 * later features and rewriting in native apis or .env.{enviroment} file
 * like: https://cli.vuejs.org/guide/mode-and-env.html
 */

import url from 'url';
import urljoin from 'url-join';

function APILocation() {
  const URL = window.location.href;
  const apiVersion = 'v1';

  if (URL.includes('localhost')) {
    return `http://localhost:8011/${apiVersion}`;
  }

  if (URL.includes('192.168')) {
    return URL.replace(/:\d+.*/, `:8011/${apiVersion}`);
  }

  if (URL.includes('test.ufabcnext.com')) {
    return `https://ufabc-matricula-test.cdd.naoseiprogramar.com.br/${apiVersion}`;
  }

  if (URL.includes(`ufabcnext.com`)) {
    return `https://api.ufabcnext.com/${apiVersion}`;
  }

  const parsedURL = url.parse(URL, false, true);
  return urljoin(parsedURL.protocol, parsedURL.host, `/${apiVersion}`);
}

function HomeLocation() {
  const URL = window.location.href;

  if (URL.indexOf('localhost') > 0) {
    return 'http://localhost:7000';
  }

  if (URL.indexOf('ufabcnext.com') >= 0) {
    return 'https://ufabcnext.com';
  }
}

export default {
  API_URL: APILocation(),
  HOME_URL: HomeLocation(),
};
