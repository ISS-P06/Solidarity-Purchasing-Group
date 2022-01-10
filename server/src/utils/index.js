import VTC from './vtc';
import SYS from './system';
import * as mailerUtil from './mailer';
import * as passportUtil from './passport';
import * as formatterUtil from './format';

const isLoggedIn = passportUtil.isLoggedIn;
const isLoggedIn_Employee = passportUtil.isLoggedIn_Employee;
const isLoggedIn_Client = passportUtil.isLoggedIn_Client;
const isLoggedIn_Farmer = passportUtil.isLoggedIn_Farmer;
const isLoggedIn_Manager = passportUtil.isLoggedIn_Manager;
const isLoggedIn_ShopEmployeeOrClient = passportUtil.isLoggedIn_ShopEmployeeOrClient;

export { VTC, SYS, mailerUtil, passportUtil, formatterUtil, 
    isLoggedIn, isLoggedIn_Employee, isLoggedIn_Client, isLoggedIn_Farmer, isLoggedIn_Manager , isLoggedIn_ShopEmployeeOrClient};
