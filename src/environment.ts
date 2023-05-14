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

// /**
//  * The code above is "paused" because the original code has
//  * 'HOME_URL' used in the registration page in the development environment.
//  * For now, I've made occasional changes to make the "apiVersion" variable
//  * compatible, but in the future this may also be rewritten
//  *
//  * I just kept the libraries because I have no idea of the impact of this
//  * on the system as a whole, but I already suggest removal in
//  * later features and rewriting in native apis or .env.{enviroment} file
//  * like: https://cli.vuejs.org/guide/mode-and-env.html
//  */

// import url from 'url';
// import urljoin from 'url-join';

function APILocation() {
  const URL = window.location.href;
  const apiVersion = 'v1';

  if (URL.includes('localhost')) {
    return `http://localhost:8011/${apiVersion}`;
  } else if (URL.includes('192.168')) {
    return URL.replace(/:\d+.*/, `:8011/${apiVersion}`);
  } else if (URL.includes('test.ufabcnext.com')) {
    return `https://ufabc-matricula-test.cdd.naoseiprogramar.com.br/${apiVersion}`;
  } else {
    return `https://api.ufabcnext.com/${apiVersion}`;
  }

  // I took a closer look at the 'url' library and the nodeJS documentation, and perhaps these lines of code are not needed.
  // const parsedURL = url.parse(URL, false, true);
  // return urljoin(parsedURL.protocol, parsedURL.host, `/${apiVersion}`);
}

export default {
  API_URL: APILocation(),
};
