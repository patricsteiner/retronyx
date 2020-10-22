# OnyxRetro

A fresh app for collaborative, agile retrospectives.

[onyxretro.web.app](https://onyxretro.web.app)

![deploy](https://github.com/patricsteiner/retronyx/workflows/deploy/badge.svg)

## Get Started

1. Install ionic `npm install -g @ionic/cli`
2. Install dependencies `npm install`
3. Run the app `ionic serve`

## TODO

- [x] Reduce DB reads (e.g. readmodel for public boards, or just remove public boards)
- [x] Avoid empty strings as titles/names
- [x] Disallow deletion of a board (because there is no (and there shall not be) login/RBAC) --> Assume it to be well-behaved (inside a board)
- [x] Nicer "no board selected" page
- [x] Add timestamps to items (cuz why not) --> nvm, use positions instead, becuase cannot rely on client timestamps (and server timestamps are slower)
- [ ] improve like visibility
- [ ] database rules (i.e. deny delete)
- [x] Split the board items to its own subcollection -> non-transactional DB writes are faster and do not necessarily require cloud functions
- [x] Remove service worker/PWA capabilities. Or at least assure new versions are fetched on time
- [x] Implement a service/store for optimistic db writes and cached reads (currently rather ugly workaround in the code, marked as TODO)

## Potential features

- [ ] Action items (or make better use of the flags?)
- [ ] Item editing (should do "split board items in own subcollection" first)
- [ ] Add/remove cards
- [ ] Presence (show which users are online)
- [ ] Readiness (users can click "done", requires presence)
- [ ] Click/hover on a user to highlight his items
- [ ] Login/Permissions?
- [ ] Teams (i.e. board belongs to a team, requires login)
- [ ] I18N (currently only english is supported)
