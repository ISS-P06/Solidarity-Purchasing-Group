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
 *  @return products: [{id,name,description,category,name,price,quantity,unit}]
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

export const api_setTime = async (dateTime) => {
    try {
        const res = await axios.put('/api/time', {time: dateTime});
        return res;
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
    let res;
    try {
        res = await axios.post('/api/register_user', user);
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
        let res = await axios.post('/api/sessions', {
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
export const api_logout = () => {
    axios
        .delete('/api/sessions/current')
        .then((res) => {
            // ...
        })
        .catch((res) => {
            // ...
        });
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
        const res = await axios.delete('/api/client/' + userId + '/basket/remove', {data: {productId}});
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


