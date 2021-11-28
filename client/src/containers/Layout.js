import { useState } from 'react';

import { Container, Button } from 'react-bootstrap';
import { Notification } from '../components';
import { FaBars } from 'react-icons/fa';

import Aside from './Aside';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout(props) {
  const { loggedIn, doLogout, userRole } = props;

  const [toggled, setToggled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = (checked) => {
    setCollapsed(checked);
  };

  const handleToggle = (value) => {
    setToggled(value);
  };

  const AsideProps = { toggled, collapsed, userRole, handleCollapse };

  return (
    <Container className="d-flex text-dark min-vh-100" fluid="true">
      <Notification />
      <Navbar loggedIn={loggedIn} doLogout={doLogout} userRole={userRole} />
      <Aside {...AsideProps} />

      {/* This button shows up when the sidebar is hidden */}
      <Button as={FaBars} className="aside-toggle" onClick={() => handleToggle(true)}>
        <FaBars />
      </Button>

      <main className="main-view">{props.children}</main>
      <Footer />
    </Container>
  );
}

export default Layout;
