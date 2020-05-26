workbox.routing.registerRoute(
  /.*\.mp3/,
  new workbox.strategies.CacheFirst({
    plugins: [
      new workbox["workbox-cacheable-response"].CacheableResponsePlugin({
        statuses: [200],
      }),
      new workbox.rangeRequests.RangeRequestsPlugin(),
    ],
  }),
  "GET"
);
