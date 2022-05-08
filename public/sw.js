self.addEventListener('fetch', function (event) {
	if (event.request.destination !== 'images') return;
	if (!('caches' in window)) return;
	console.log('[SW] Caching Image!')
  event.respondWith(
    caches.open('images').then(async function(cache) {
      const response = await cache.match(event.request);
			return response || fetch(event.request).then(function (response_1) {
				cache.put(event.request, response_1.clone());
				return response_1;
			});
    })
  );
});
