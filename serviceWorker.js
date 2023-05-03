const STATIC_ASSETS = [
  '/PWA-Snake/',
  '/PWA-Snake/assets/',
  '/PWA-Snake/assets/icons/',
  '/PWA-Snake/assets/style/style.css',
  '/PWA-Snake/assets/script/snake.js',
];

const APP_PREFIX = 'Snake';
const VERSION = '2.0';
const CACHE_NAME = `${APP_PREFIX}_${VERSION}`;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Zwraca odpowiedź z pamięci podręcznej, jeśli jest dostępna
      if (response) {
        return response;
      }

      // Jeśli odpowiedź nie jest dostępna w pamięci podręcznej, próbuje ją pobrać z sieci
      return fetch(event.request)
        .then(response => {
          // Jeśli pobieranie jest udane, to dodaje odpowiedź do pamięci podręcznej i zwraca odpowiedź do przeglądarki
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(error => {
          // Jeśli pobieranie nie jest udane, to zwraca odpowiedź offline, jeśli jest dostępna
          return caches.match('/offline.html');
        });
    })
  );
});
