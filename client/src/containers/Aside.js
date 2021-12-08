import { Link } from 'react-router-dom';
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import { BsFillPersonPlusFill, BsList, BsFillCartPlusFill } from 'react-icons/bs';
import { GiFruitBowl, GiFruitTree } from 'react-icons/gi';
import { VirtualClock } from '../components';
import { FaRegListAlt } from 'react-icons/fa';

// todo add collaspse change

/**
 * Sidebar component.
 *
 * Contains list of different routes (`Menu`) for each user role,
 * useful for easy navigation throw the app.
 *
 *
 * @param {object}  props  - Component props.
 * @param {boolean} props.collapsed - If true the sidebar is in a tiny version.
 * @param {boolean} props.toggled - If true the sidebar is hidden and a button appears.
 * @param {funciton} props.handleToggle - Handle the action on toggle button.
 * @param {function} props.handleCollapse - Handle the action on collapse button.
 * @param {string} props.userRole - Role of the user, defined on login.
 * @param {function} props.setDirtyVT - Handle the `VirtualClock` change.
 * @param {boolean} props.dirtyVT - `VirtualClock parameter for reload.
 * @param {Date} props.virtualTime - Current time.
 */
function Aside({
  collapsed,
  toggled,
  handleToggle,
  handleCollapse,
  userRole,
  setDirtyVT,
  dirtyVT,
  virtualTime,
}) {
  /**
   * Dictionary for selection of the the menu, based on its role
   */
  const roleMenu = {
    shop_employee: <EmployeeMenu />,
    client: <ClientMenu />,
    farmer: <FarmerMenu />,
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
      <SidebarContent className="pro-sidebar">
        {roleMenu[userRole]}
        {/* todo aggiustare posizione virtual clock */}
        <VirtualClock virtualTime={virtualTime} setDirtyVT={setDirtyVT} dirtyVT={dirtyVT} />
      </SidebarContent>
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

function ClientMenu() {
  return (
    <Menu iconShape="circle">
      <MenuItem icon={<BsFillCartPlusFill />}>
        <Link className="text-light" to="/client/products">
          Add products to basket
        </Link>
      </MenuItem>
      <MenuItem icon={<FaRegListAlt />}>
        <Link className="text-light" to="/client/orders">
          Browse order history list
        </Link>
      </MenuItem>
    </Menu>
  );
}

function FarmerMenu() {
    return (
        <Menu iconShape="circle">
            <MenuItem icon={<GiFruitTree />}>
                <Link className="text-light" to="/farmer/supply">
                    Report expected products
                </Link>
            </MenuItem>
            <MenuItem icon={<GiFruitBowl />}>
                <Link className="text-light" to="/farmer/products">
                    Browse products on sale
                </Link>
            </MenuItem>
        </Menu>
    );
}

export default Aside;
