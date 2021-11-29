import { Redirect } from 'react-router-dom';

function RedirectUser(props) {
    const userRole = props.userRole;
  
    const renderSwitch = (role) => {
      switch (role) {
        case 'shop_employee':
          return <Redirect to="/employee" />;
        case 'client':
          return <Redirect to="/client" />;
        case 'farmer':
          return <Redirect to="/farmer" />;
        default:
          return <Redirect to="/" />;
      }
    };
  
    return renderSwitch(userRole);
}

export default RedirectUser;
