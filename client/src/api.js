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
        throw new Error('Sorry, there was an error in getting all the services');
      }
    }
  };