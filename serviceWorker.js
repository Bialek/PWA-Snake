const STATIC_ASSETS = [
  '/PWA-Snake/',
  '/PWA-Snake/assets/style/style.css',
  '/PWA-Snake/assets/style/style.css.map',
  '/PWA-Snake/assets/script/snake.js',
];

const APP_PREFIX = 'Snake';
const VERSION = '1.4';
const CACHE_NAME = `${APP_PREFIX}_${VERSION}`;

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        return request;
      } else {
        return fetch(e.request);
      }
    })
  );
});

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      const cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheWhitelist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
