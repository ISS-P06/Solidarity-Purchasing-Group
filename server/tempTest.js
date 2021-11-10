import {insertClient, listProducts} from "./dao";

insertClient('salem' , 'abouzaid' ,'111111111' , 'via torino' , 'sabozaid@gm.com', 32).
then(res => console.log('succeeded')).catch(err=> console.log(err))

// listProducts().then(res=> console.log(res)).catch(err => console.log(err))