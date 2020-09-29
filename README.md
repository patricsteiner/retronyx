# OnyxRetro

A fresh app for collaborative agile retrospectives.

[onyxretro.web.app](https://onyxretro.web.app)

![deploy](https://github.com/patricsteiner/retronyx/workflows/deploy/badge.svg)

## TODO

- [ ] I18N (currently only german is supported)
- [ ] Reduce DB reads (e.g. readmodel for public boards, or just remove public boards)
- [ ] Implement a service/store for optimistic db writes and cached reads
- [ ] Avoid empty strings as titles/names
- [ ] Disallow deletion of a board (because there is no (and there shall not be) login/RBAC) --> Assume it to be well-behaved (inside a board)
- [ ] Nicer "no board selected" page
- [ ] Maybe split the board items to its own subcollection -> non-transactional DB writes are faster and do not necessarily require cloud functions
