/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// tslint:disable:no-console

// NOTE: this is the safety worker, copied and pasted in this file so service workers that are already installed will be removed.
// angular.json assets were adjusted so this file is copied to www
// see also https://angular.io/guide/service-worker-devops#safety-worker

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  self.registration.unregister().then(() => {
    console.log('NGSW Safety Worker - unregistered old service worker');
  });
});
