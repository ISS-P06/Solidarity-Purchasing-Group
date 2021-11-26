import { Route, Redirect } from 'react-router-dom';

/**
 * Dictionary of default path of the roles
 */
const rolesPathRedirect = {
  shop_employee: '/employee',
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
export function RedirectRoute({ component, path, role, redirect, condition = true }) {
  const defaultRedirect = redirect || <Redirect to={getUserRoute(role)} />;

  return <Route path={path}>{condition ? component : defaultRedirect}</Route>;
}
