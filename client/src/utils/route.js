import { Route, Redirect } from 'react-router-dom';

/**
 * Dictionary of default path of the roles
 */
const rolesPathRedirect = {
  shop_employee: '/employee',
  client: '/client',
  farmer: '/farmer',
};

/**
 * Get home route of the user
 * @param {string} role
 * @returns {string}
 */
export function getUserRoute(role) {
  return rolesPathRedirect[role] || '';
}

/**
 * Wrapper of `Route` component that automatically redirect
 * the user based on its role
 */
export function RedirectRoute({
  component,
  path,
  role,
  redirect,
  exact = false,
  condition = true,
}) {
  const redirectRoute = getUserRoute(role);

  return (
    <Route exact={exact} path={path}>
      {condition ? component : redirect || <Redirect to={redirectRoute} />}
    </Route>
  );
}
