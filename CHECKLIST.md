# Checklist for new Projects

When creating a new Flox project, you should (at the very least) complete the following changes that are
application-specific:

## Root
- [ ] Adapt `.env` with database name
- [ ] Adapt `sonar-project.properties` with project key & organization

## Frontend
- [ ] Adapt `frontend/.env` with app name, AWS user pool & e-mail sender
- [ ] Set up `frontend/flox.config.json` according to your application's needs
- [ ] In `frontend/src/data/ENUM.ts`, add the list of user roles within your application.
- [ ] In `frontend/src/boot/router.boot.ts`, add the application specific paths for each user role's default view
- [ ] In `frontend/src/router/routes.ts`, add the application's routes
- [ ] In `frontend/src/flox/modules/auth/services/user.service.ts`, add any non-standard attributes your users need
- [ ] In `frontend/src/flox/modules/auth/services/user.service.ts`, in `loginSuccess()`, choose the correct route to redirect to.
- [ ] In `frontend/src/flox/modules/auth/services/user.service.ts`, in `loginSuccess()`, choose the correct route to redirect to.

## Backend
- [ ] Adapt `backend/.env` with database name, AWS keys & buckets
- [ ] Set up `backend/flox.config.json` according to your application's needs
- [ ] In `backend/src/flox/modules/file/file.resolver.ts`, add appropriate guards for private files depending on your application
