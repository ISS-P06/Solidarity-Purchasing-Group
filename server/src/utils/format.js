'use strict';

/**
 * ---
 * This file contains utility functions for formatting.
 * ---
 */

const errorFormatter = ({location, msg, param, value, nestedErrors}) => {
    // Format express-validate errors as strings
    return `${location}[${param}]: ${msg}`;
};

export { errorFormatter };