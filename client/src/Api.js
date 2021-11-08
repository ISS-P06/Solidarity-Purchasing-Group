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

export const api_getTime = async () => {
    try{
        const res = await axios.get('/api/time');
        if(res.data){
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        if(err.response.status == 500){
            throw new Error(err.response.data);
        }
    }
};

export const api_setTime = async (date, time) => {
    try{
        const date_time = await new Date(date.getFullYear(), date.getMonth(), date.getDate(), time);
        const res = await axios.put("/api/time", date_time.toISOString());
        return res; 
    } catch (error){
        alert("Error in api_setTime()");
    }
}