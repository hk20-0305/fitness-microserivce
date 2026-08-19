export const authConfig = {
  clientId: 'fitness-app',
  authorizationEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/token',
  logoutEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/logout',
  logoutRedirect: 'http://localhost:5173',
  redirectUri: 'http://localhost:5173',
  scope: 'openid profile email',
  autoLogin: false,
  onRefreshTokenExpire: (event) => event.logIn(),
}
