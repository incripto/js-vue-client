let v = 'v' + '0.2.1';

self.addEventListener('install', e => {
    console.log(v + ' installing…');
    self.skipWaiting();
    e.waitUntil(
        caches.open(v).then(c => c.addAll([
            '/',
            '/index.html',
            '/index.js',
            '/index.css',
            '/static/inconsolata.woff2',
            '/static/roboto-cyr.woff2',
            '/static/roboto.woff2',
            '/static/cinzel.woff2',
            '/static/audiowide.woff2',
            '/static/material.ttf',
            '/static/arrow-right.png'
        ])).then(() => {
            console.log(v + ' installed!');
        })
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (![v].includes(key)) {
                    console.log('delete ' + key);
                    return caches.delete(key);
                }
            })
        )).then(() => {
            console.log(v + ' ready!');
        })
    );
});

self.addEventListener('fetch', function(e) {
    //console.log(e.request.url);
    try {
      e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
      );
    } catch (e) {
      console.error(e);
  }
});

self.addEventListener('notificationclick', function(event) {

    event.notification.close();

    event.waitUntil(

    self.clients.matchAll().then(function(clientList) {

        if (clientList.length > 0) {
            return clientList[0].focus();
        };
        
        return self.clients.openWindow('/p2p');
        })
    );
});

/*
self.addEventListener('notificationclick', function(event) {
  //console.log('On notification click: ', event.notification.tag);
  console.log('!!!')
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll().then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == '/' && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow('/');
  }));
});

self.addEventListener('notificationclick', function(event) {
  if (event.notification.tag == 'chat') {
    client.matchAll().then(clients => {
      return clients.find(c => new URL(c.url).pathname.indexOf('/chat/') === 0);
    }).then(client => {
      if (client) {
        client.focus();
      }
      else {
        clients.openWindow('/chat/');
      }
    });
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  );
});

*/
