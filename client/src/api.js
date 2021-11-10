const axios = require('axios');

export const api_getOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      if (res.data) {
        return res.data;
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      if (err.response.status == 500) {
        throw new Error(err.response.data);
      } else {
        throw new Error('Sorry, there was an error in getting all the orders');
      }
    }
  };

  export default api_getOrders;

  export const api_getOrderReview = async (orderId) => {
    try {
      const res = await axios.get('/api/orders/'+ orderId);
      if (res.data) {
        return res.data;
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      if (err.response.status == 500) {
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
      if (err.response.status == 422 || err.response.status == 503) {
        throw new Error(err.response.data);
      } else {
        throw new Error('Sorry, there was an error in delivering the order');
      }
    }
  };