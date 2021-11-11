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
        if (err.response.status == 500) {
            throw new Error(err.response.data);
        } else {
            throw new Error('Sorry, there was an error in getting all the products');
        }
    }
};

export const api_getClientsList = async () => {
    try {
        const res = await axios.get('/api/clients');
        if (res.data) {
            console.log(res.data);
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        if (err.response.status == 500) {
            throw new Error(err.response.data);
        } else {
            throw new Error('Sorry, there was an error in getting the clients');
        }
    }
};

export const api_addOrder= async (order) => {
    try {
        const res = await axios.post('/api/orders', order);
        if (res.data) {
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        if (err.response.status == 500) {
            throw new Error(err.response.data);
        } else {
            throw new Error('Sorry, there was an error in adding the order');
        }
    }
};