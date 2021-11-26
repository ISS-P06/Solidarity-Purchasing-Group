import { Link } from 'react-router-dom';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from 'react-pro-sidebar';
import { BsFillPersonPlusFill, BsList } from 'react-icons/bs';
import { GiFruitBowl } from 'react-icons/gi';
import { VirtualClock } from '../components';

// todo add collaspse change

function Aside({ collapsed, toggled, handleToggle, handleCollapse, userRole }) {
  const roleMenu = {
    shop_employee: <EmployeeMenu />,
  };

  return !userRole ? null : (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggle}
      style={{
        paddingTop: '66px',
        height: 'auto',
      }}>
      <SidebarHeader>
        <div
          style={{
            padding: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          className="pro-sidebar">
          {userRole.replace('_', ' ')}
        </div>
      </SidebarHeader>
      <SidebarContent className="pro-sidebar">{roleMenu[userRole]}</SidebarContent>
      <SidebarFooter className="pro-sidebar-footer">
        {/* todo aggiustare posizione virtual clock */}
        <VirtualClock />
      </SidebarFooter>
    </ProSidebar>
  );
}

function EmployeeMenu() {
  return (
    <Menu iconShape="circle">
      <MenuItem icon={<BsFillPersonPlusFill />}>
        <Link className="text-light" to="/employee/register">
          Enter a new client
        </Link>
      </MenuItem>
      <MenuItem icon={<BsList />}>
        <Link className="text-light" to="/employee/clients">
          Show clients
        </Link>
      </MenuItem>
      <MenuItem icon={<GiFruitBowl />}>
        <Link className="text-light" to="/employee/products">
          Browse Products
        </Link>
      </MenuItem>
      <MenuItem icon={<BsList />}>
        <Link className="text-light" to="/employee/orders">
          Browse Orders
        </Link>
      </MenuItem>
    </Menu>
  );
}

export default Aside;
