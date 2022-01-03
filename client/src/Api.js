const axios = require('axios');

/**
 * function for managing error
 * @param status of the response
 * @param message of error
 */
function manageError(status, message = "") {
    if (status === 500) {
        throw new Error("Sorry, there is a problem with the server. Try later..");
    } else if (status === 422) {
        throw new Error('Sorry, there was an error in the data');
    } else {
        throw new Error(message);
    }
}

/**
 *  GET products
 *  @return products: [{id,name,description,category,name,price,quantity,unit, ref_farmer, farm_name}]
 */
export const api_getProducts = async () => {
    try {
        const res = await axios.get('/api/products');
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in getting all the products')
    }
};

/**
 *  GET products
 *  @return products: [{id,name,description,unit}]
 */
export const api_getFarmerProducts = async (farmerId) => {
    try {
        const res = await axios.get('/api/farmer/' + farmerId + '/products');
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in getting all the products')
    }
};

/**
 *  GET supplied products by a farmer for the next week
 *  @return products: [{id,name,price,quantity,unit}]
 */
export const api_getSupplyFarmerProducts = async (farmerId) => {
    try {
        const res = await axios.get('/api/farmer/' + farmerId + '/products/supplied');
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in getting all the products')
    }
};

/**
 *  POST product quantity available the next week
 *  @param supplyProduct: [{productID, quantity, price}]
 */
export const api_addAvailableProductQuantity = async (supplyProduct) => {
    try {
        const res = await axios.post('/api/farmer/products/available', supplyProduct);
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in adding product quantity available the next week')
    }
};

/**
 *  DELETE product with {productID}quantity available the next week
 *  @param productID: id of the supplied product quantity to remove
 */
export const api_removeAvailableProductQuantity = async (productID) => {
    try {
        const res = await axios.delete('/api/farmer/products/available', {data: {productID}});
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in removing product quantity available the next week')
    }
};


export const api_getOrders = async () => {
    try {
        const res = await axios.get('/api/orders');
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, ('Sorry, there was an error in getting all the orders'))
    }
};


export const api_getClientOrders = async (clientId) => {
    try {
        const res = await axios.get('/api/clients/' + clientId + '/orders');
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, ('Sorry, there was an error in getting all the client orders'))
    }
};

export const api_getOrderReview = async (orderId) => {
    try {
        const res = await axios.get('/api/orders/' + orderId);
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, ('Sorry, there was an error in getting the order review'))
    }
};

export const api_getClientOrderReview = async (clientId, orderId) => {
    try {
        const res = await axios.get('/api/clients/' + clientId + '/orders/' + orderId);
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, ('Sorry, there was an error in getting the order review'))
    }
};

export const api_doDelivery = async (orderId) => {
    try {
        const res = await axios.post('/api/orders/' + orderId + '/deliver', {
            orderId: orderId,
        });
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, ('Sorry, there was an error in delivering the order'))
    }
};

/**
 * GET the list of clients
 * @returns res.data: [{id,name,surname,address,balance,mail,phone}]
 */

export const api_getClientsList = async () => {
    try {
        const res = await axios.get('/api/clients');
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in getting the clients');
    }
};

/**
 * Add an order of a client
 * @param orderClient: {clientID: client.id, order: order}
 * @returns res.data: id of the order added
 */
export const api_addOrder = async (orderClient) => {
    try {
        const res = await axios.post('/api/orders', orderClient);
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, "Sorry, there was an error in adding the order");
    }
};

/**
 * Top up client wallet.
 *
 * This api is avaiable only for a user logged as `employee`.
 *
 * @param {{id: number, amount: number}} args
 * @param id - Id of the user we want to top up
 * @param amount - Top up amount
 * @returns {Promise<*>} Response object of the api call
 */
export const api_addTopUpClient = async ({id, amount}) => {
    try {
        const res = await axios.put('/api/clients/topup', {amount, id});
        if (res.status !== 200) {
            throw new Error(res.status);
        }
    } catch (err) {
        manageError(err, "Sorry, there was an error in top up client's wallet");
    }
};


/** Time API */

/**
 * Api used to get the current virtual time and date from backend.
 *
 * @returns {any} res.data
 *  - res.data.currentTime: dayjs.Dayjs object to represents the current virtual time and date.
 *  - res.data.day: string object to represents the current day of the week associated to the currentTime.
 */
export const api_getTime = async () => {
    try {
        const res = await axios.get('/api/time');
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        if (err.response.status === 500) {
            throw new Error(err.response.data);
        }
    }
};

/**
 * Api used to send the current virtual time and date to the backend.
 *
 * @param {string} dateTime
 *  - dateTime is an ISODate string.
 * @returns {any}
 *  - the returned status of the put request made by axios.
 */
export const api_setTime = async (dateTime) => {
    try {
        return await axios.put('/api/time', {time: dateTime});
    } catch (error) {
        throw new Error(error.message);
    }
};

/** User API */

/**
 * Registration of the user
 * @param user
 * */
export async function insertUser(user) {
    try {
        return await axios.post('/api/register_user', user);
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in registering the user')
    }
}


/** Login
 * @param credentials: {username,password}
 * @return res.data: information about the user
 */

export const api_login = async (credentials) => {
    try {
        const res = await axios.post('/api/sessions', {
            username: credentials.username,
            password: credentials.password,
        });
        if (res.data.username) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        if (err.response.status === 401) {
            throw new Error(err.response.data);
        } else {
            manageError(err.response.status, 'Sorry, there was an error in logging in');
        }
    }
};

/**
 * Logout
 */
export const api_logout = async () => {
    try {
        return await axios.delete('/api/sessions/current')
    } catch (err) {
        throw new Error("Sorry, there is a problem with the logout. Try later..");
    }
};

/**
 * Get user info
 */
export const api_getUserInfo = async () => {
    try {
        const res = await axios.get('/api/sessions/current');
        if (res.data.id) {
            return res.data;
        } else {
            throw res.data.message;
        }
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        } else if (err.response.data.error) {
            throw new Error(err.response.data.error);
        } else {
            throw new Error('Sorry, there was an error in getting user data');
        }
    }
};
// --- --- --- //

/** Basket APIs */
export const api_getBasket = async (userId) => {
    try {
        const res = await axios.get('/api/client/' + userId + '/basket');
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in getting the basket');
    }
};

export const api_buyNow = async (userId) => {
    try {
        const res = await axios.post('/api/client/' + userId + '/basket/buy', {});
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in buying');
    }
};

/**
 * remove the product with productId from the basket
 * @param userId: id of the basket's user
 * @param productId: id of the product to remove
 * @returns {Promise<*>}
 */
export const api_removeProductFromBasket = async (userId, productId) => {
    try {
        const res = await axios.post('/api/client/' + userId + '/basket/remove', {productId});
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in removing a product from basket');
    }
};

export const api_addProductToBasket = async (userId, productId, reservedQuantity) => {
    try {
        const res = await axios.post('/api/client/' + userId + '/basket/add', {productId, reservedQuantity});
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in adding to the basket');
    }
};

/**
 * insert new product description from the farmer side
 * @param description: object that carries product name , product description, category, unit and farmer reference in db
 * @returns {Promise<*>}
 */
export async function api_insertProductDescription(description) {
    try {
        const res = await axios.post('/api/insert_product_description', description);
        if (res.data)
            return res.data;
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error with description insertion');
    }
}

/**
 * Schedule bag delivery
 * @param orderId: ID of the order
 * @param delivery: information about the delivery {typeDelivery: home|store, address, date, startTime, endTime}
 */
export const api_scheduleDelivery = async (orderId, delivery) => {
    try {
        const res = await axios.post('/api/orders/' + orderId + '/deliver/schedule', delivery);
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in scheduling bad delivery');
    }
};

// Manager APIs

/**
 * Generate a weekly report of unretrieved food
 * @param date: the start date
 */
export const api_generateWeeklyReport = async (date) => {
    try {
        const res = await axios.post('/api/manager/report/weekly', { date });
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in generating the weekly report');
    }
};

/**
 * Generate a monthly report of unretrieved food
 * @param date: the start date
 */
export const api_generateMonthlyReport = async (date) => {
    try {
        const res = await axios.post('/api/manager/report/monthly', { date });
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, 'Sorry, there was an error in generating the monthly report');
    }
};

/**
 * Compute statistics for the manager's homepage.
 * @returns {object} An object with the following structure:
 * {
 *      userStats: {
 *          [role]: [number of users with that role]
 *      },
 *      numOrders: [number of orders made this week],
 *      numFarmers: [number of farmers who reported supplies for this week],
 *      numProducts: [number of products supplied by farmers for this week]
 * }
 */
export const api_computeHomepageStats = async () => {
    try {
        const res = await axios.get('/api/manager/stats');
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        manageError(err.response.status, "Sorry, there was an error in computing statistics.");
    }
};
/**
 * TODO: api to get information on the suspension state of an user
 * @param userId: ID of the logged user
 * @returns {boolean} true if the user is suspended, false otherwise
 */
export const api_isUserSuspended = async() => {
    return true;
}
