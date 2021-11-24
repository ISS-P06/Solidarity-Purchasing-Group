const axios = require('axios');

export const api_getProducts = async () => {
  try {
    const res = await axios.get('/api/products');
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status === 500) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in getting all the products');
    }
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
    if (err.response.status === 500) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in getting all the orders');
    }
  }
};

export default api_getOrders;

export const api_getClientOrders = async (clientId) => {
  try {
    const res = await axios.get('/api/clients/'+clientId+'/orders');
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status === 500) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in getting all the client orders');
    }
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
    if (err.response.status === 500) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in getting the order review');
    }
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
    if (err.response.status === 500) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in getting the order review');
    }
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
    if (err.response.status === 422 || err.response.status === 503) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in delivering the order');
    }
  }
};

export const api_getClientsList = async () => {
  try {
    const res = await axios.get('/api/clients');
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status === 500) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in getting the clients');
    }
  }
};

export const api_addOrder = async (orderClient) => {
  try {
    const res = await axios.post('/api/orders', orderClient);
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status === 500) {
      throw new Error(err.response.data);
    } else if (err.response.status === 422) {
      throw new Error('Sorry, there was an error in the data');
    } else {
      throw new Error('Sorry, there was an error in adding the order');
    }
  }
};

export const api_addTopUpClient = async ({ id, amount }) => {
  try {
    await axios.put('/api/clients/topup', { amount, id });
  } catch (err) {
    if (err.response.status === 500) {
      throw new Error(err.response.data);
    } else if (err.response.status === 422) {
      throw new Error('Sorry, there was an error in the data');
    } else {
      throw new Error('Sorry, there was an error in adding the order');
    }
  }
};

export async function insertClient(client) {
  let res;
  try {
    res = await axios.post('/api/insert_client', client);
  } catch (err) {
    console.log(err);
    throw new Error(res.data.message);
    //throw err;
  }
}

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
    const res = await axios.put('/api/time', { time: dateTime });
    return res;
  } catch (error) {
    //alert("Error in api_setTime()");
    //console.log(error.message);
    throw new Error(error.message);
  }
};

// --- Login/Logout APIs
// Login API
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
      throw new Error('Sorry, there was an error in logging in');
    }
  }
};

// Logout API
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

// Get user info API
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
      throw new Error('Sorry, there was an error in logging in');
    }
  }
};

export const api_getBasket = async (userId) => {
  try {
    const res = await axios.get('/api/client/' + userId + '/basket');
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status === 500) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in getting the basket');
    }
  }
};

export const api_buyNow = async (userId) => {
  try {
    const res = await axios.put('/api/client/' + userId + '/basket/buy', {});
    if (res.data) {
      return res.data;
    } else {
      throw new Error(res.data.message);
    }
  } catch (err) {
    if (err.response.status === 500) {
      throw new Error(err.response.data);
    } else {
      throw new Error('Sorry, there was an error in buying');
    }
  }
};

