import { useEffect } from 'react';
import ReactNotification, { store } from 'react-notifications-component';
import { Alert as BAlert } from 'react-bootstrap';

export function addMessage({ title, message, type }) {
  store.addNotification({
    title: title || '',
    message: message || '',
    type: type || 'info',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
}

function Notification() {
  return <ReactNotification />;
}

/**
 * @deprecated Use `Notification` instead of this
 */
function Alert({ alert, setAlert, message }) {
  // On componentDidMount set the timer
  useEffect(() => {
    if (alert) {
      const timeId = setTimeout(() => {
        // After 5 seconds set the show value to false
        setAlert(false);
      }, 5000);
      return () => {
        clearTimeout(timeId);
      };
    }
  }, [alert, setAlert]);

  return (
    <BAlert
      className="mt-3 pb-0"
      variant={message.type}
      onClose={() => setAlert(false)}
      dismissible>
      <p>{message.msg}</p>
    </BAlert>
  );
}

export default Notification;
