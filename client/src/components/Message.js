import ReactNotification from 'react-notifications-component';

import { store } from 'react-notifications-component';
import {useEffect} from "react";

export function addMessage(title,message,type) {
    console.log("add");
    console.log(message);
    console.log(type);
    store.addNotification({
        title: title || "",
        message: message,
        type: type,
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    })
}

function Notification(props) {
    // const { alert, setAlert, message } = props;

    // On componentDidMount set the timer
    // useEffect(() => {
    //   if (alert) {
    //     const timeId = setTimeout(() => {
    //       // After 5 seconds set the show value to false
    //       setAlert(false);
    //     }, 5000);
    //     return () => {
    //       clearTimeout(timeId);
    //     };
    //   }
    // }, [alert, setAlert]);

    useEffect(()=>{

    },[])

    return (
        <ReactNotification/>
        // <Alert
        //   className="mt-3 pb-0"
        //   variant={message.type}
        //   onClose={() => setAlert(false)}
        //   dismissible>
        //   <p>{message.msg}</p>
        // </Alert>
    );

}

export default Notification;
