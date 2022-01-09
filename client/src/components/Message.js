import { useEffect } from 'react';
import ReactNotification, { store } from 'react-notifications-component';
import { Alert as BAlert } from 'react-bootstrap';

/**
 * Top level function for toast notifications
 *
 * @param {object} args
 * @param {string} args.title - Tile of the notification [default='']
 * @param {string} args.message - Body of the notification [default='']
 * @param {string} args.type - Color of the notification [default='success']
 */
export function addMessage({ title, message, type }) {
  store.addNotification({
    title: title || '',
    message: message || '',
    type: type || 'success',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    width: 300,
    dismiss: {
      duration: 3000,
      onScreen: true,
      pauseOnHover: true,
      showIcon: true,
    },
  });
}

function Notification() {
  return <ReactNotification />;
}

/**
 * @deprecated Use `Notification` instead of this
 */ 
// eslint-disable-next-line
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
