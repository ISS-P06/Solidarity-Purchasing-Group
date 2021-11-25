import { useState } from 'react';

import { Container, Button } from 'react-bootstrap';
import { Notification } from '../components';
import { FaBars } from 'react-icons/fa';

import Aside from './Aside';
import Navbar from './Navbar';

function Layout(props) {
  const { loggedIn, doLogout, userRole } = props;

  const [toggled, setToggled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapsedChange = (checked) => {
    setCollapsed(checked);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <Container className="d-flex text-dark min-vh-100 min-vw-100" fluid="true">
      <Notification />
      <Navbar loggedIn={loggedIn} doLogout={doLogout} userRole={userRole} />
      {/*<Aside toggled={toggled} collapsed={collapsed} handleToggleSidebar={handleToggleSidebar} />*/}

      {/* This button shows up when the sidebar is hidden */}
      <Button as={FaBars} className="aside-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </Button>

      <main className="main-view">{props.children}</main>
    </Container>
  );
}

export default Layout;
