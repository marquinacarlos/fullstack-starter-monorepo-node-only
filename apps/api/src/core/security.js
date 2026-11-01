// Placeholder: this template has NO authentication on purpose.
// Add your auth middleware here (sessions, JWT, API keys) and mount it in app.js
// before the routes that need protection.
export function requireAuth(_req, _res, next) {
  next();
}
