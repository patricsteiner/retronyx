# OnyxRetro

A fresh app for collaborative agile retrospectives.

[onyxretro.web.app](https://onyxretro.web.app)

![deploy](https://github.com/patricsteiner/retronyx/workflows/deploy/badge.svg)

## TODO

- [ ] I18N (currently only german is supported)
- [ ] Reduce DB reads (e.g. readmodel for public boards, or just remove public boards)
- [ ] Avoid empty strings as titles/names
- [ ] Disallow deletion of a board (because there is no (and there shall not be) login/RBAC) --> Assume it to be well-behaved (inside a board)
- [ ] Nicer "no board selected" page
- [ ] Add timestamps to items (cuz why not)
- [ ] Maybe split the board items to its own subcollection -> non-transactional DB writes are faster and do not necessarily require cloud functions
- [ ] Maybe remove service worker/PWA capabilities. Or at least assure new versions are fetched on time
- [ ] Maybe implement a service/store for optimistic db writes and cached reads

## Potential features
- [ ] Presence (show which users are online)
- [ ] Item editing (should do "split board items in own subcollection" first)
- [ ] Add/remove cards
- [ ] Click/hover on a user to highlight his items


