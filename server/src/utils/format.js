'use strict';

/**
 * ---
 * This file contains utility functions for formatting.
 * ---
 */

export const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format express-validate errors as strings
  return `${location}[${param}]: ${msg}`;
};
