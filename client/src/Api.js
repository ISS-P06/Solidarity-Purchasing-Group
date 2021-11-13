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


export async function insertClient(client) {
    let res;
    try {
         res = await axios.post('/api/insert_client', client);
    } catch (err) {
        console.log(err);
        throw new Error(res.data.message)
        //throw err;
    }
}

export const api_getTime = async () => {
    try{
        const res = await axios.get('/api/time');
        if(res.data){
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        if(err.response.status === 500){
            throw new Error(err.response.data);
        }
    }
};

export const api_setTime = async (dateTime) => {
    try{
        const res = await axios.put("/api/time", {time : dateTime});
        return res; 
    } catch (error){
        //alert("Error in api_setTime()");
        //console.log(error.message);
        throw new Error(error.message);
    }
}