import { useState } from 'react';

import { Container } from 'react-bootstrap';
import { Notification } from '../components';

import Aside from './Aside';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout(props) {
  const {
    loggedIn,
    doLogout,
    userRole,
    userId,
    dirtyVT,
    setDirtyVT,
    virtualTime,
    openBasketOffCanvas,
    setOpenBasketOffCanvas,
  } = props;

  const [toggled, setToggled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = (value) => {
    setCollapsed(value);
  };

  const handleToggle = () => {
    setToggled(!toggled);
  };

  const AsideProps = {
    toggled,
    collapsed,
    userRole,
    handleToggle,
    handleCollapse,
    dirtyVT,
    setDirtyVT,
    virtualTime,
  };

  return (
    <Container className="d-flex text-dark min-vh-100" fluid="true">
      <Notification />
      <Navbar
        loggedIn={loggedIn}
        doLogout={doLogout}
        userRole={userRole}
        userId={userId}
        virtualTime={virtualTime}
        openBasketOffCanvas={openBasketOffCanvas}
        setOpenBasketOffCanvas={setOpenBasketOffCanvas}
        handleToggle={handleToggle}
      />
      <Aside {...AsideProps} />

      <main className="main-view">{props.children}</main>
      <Footer />
    </Container>
  );
}

export default Layout;
