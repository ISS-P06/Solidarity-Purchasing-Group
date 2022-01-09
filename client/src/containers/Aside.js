import { Link } from 'react-router-dom';
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import {
  BsFillPersonPlusFill,
  BsList,
  BsFillCartPlusFill,
  BsCalendarRangeFill,
  BsCalendarFill,
} from 'react-icons/bs';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { GiFruitBowl, GiFruitTree } from 'react-icons/gi';
import { FaRegListAlt } from 'react-icons/fa';

import { VirtualClock } from '../components';

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
    shop_employee: <EmployeeMenu collapsed={collapsed} />,
    client: <ClientMenu collapsed={collapsed} />,
    farmer: <FarmerMenu collapsed={collapsed} />,
    manager: <ManagerMenu collapsed={collapsed} />,
  };

  const handleClose = () => {
    handleToggle(false);
  };

  return !userRole ? null : (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggle}
      style={{
        marginTop: '58px',
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
          <CollapseArrow collapsed={collapsed} handleCollapse={handleCollapse} />

          {collapsed ? null : userRole.replace('_', ' ')}
        </div>
      </SidebarHeader>
      <SidebarContent className="pro-sidebar" onClick={handleClose}>
        {roleMenu[userRole]}
        <hr />
        <VirtualClock
          virtualTime={virtualTime}
          setDirtyVT={setDirtyVT}
          dirtyVT={dirtyVT}
          collapsed={collapsed}
        />
      </SidebarContent>
    </ProSidebar>
  );
}
function CollapseArrow({ collapsed, handleCollapse }) {
  const Arrow = collapsed ? IoIosArrowForward : IoIosArrowBack;
  return <Arrow className="collapse-arrow" size={22} onClick={() => handleCollapse(!collapsed)} />;
}

function CollapsableLink(props) {
  const { className, to, collapsed } = props;

  return (
    <Link className={className} to={to}>
      {collapsed ? null : props.children}
    </Link>
  );
}

function EmployeeMenu({ collapsed }) {
  return (
    <Menu iconShape="circle">
      <MenuItem icon={<BsFillPersonPlusFill />}>
        <CollapsableLink collapsed={collapsed} className="text-light" to="/employee/register">
          Enter a new client
        </CollapsableLink>
      </MenuItem>
      <MenuItem icon={<BsList />}>
        <CollapsableLink collapsed={collapsed} className="text-light" to="/employee/clients">
          Show clients
        </CollapsableLink>
      </MenuItem>
      <MenuItem icon={<GiFruitBowl />}>
        <CollapsableLink collapsed={collapsed} className="text-light" to="/employee/products">
          Browse Products
        </CollapsableLink>
      </MenuItem>
      <MenuItem icon={<BsList />}>
        <CollapsableLink collapsed={collapsed} className="text-light" to="/employee/orders">
          Browse Orders
        </CollapsableLink>
      </MenuItem>
    </Menu>
  );
}

function ClientMenu({ collapsed }) {
  return (
    <Menu iconShape="circle">
      <MenuItem icon={<BsFillCartPlusFill />}>
        <CollapsableLink collapsed={collapsed} className="text-light" to="/client/products">
          Add products to basket
        </CollapsableLink>
      </MenuItem>
      <MenuItem icon={<FaRegListAlt />}>
        <CollapsableLink collapsed={collapsed} className="text-light" to="/client/orders">
          Browse order history list
        </CollapsableLink>
      </MenuItem>
    </Menu>
  );
}

function FarmerMenu({ collapsed }) {
  return (
    <Menu iconShape="circle">
      <MenuItem icon={<GiFruitTree />}>
        <CollapsableLink collapsed={collapsed} className="text-light" to="/farmer/supply">
          Report expected products
        </CollapsableLink>
      </MenuItem>
      <MenuItem icon={<GiFruitBowl />}>
        <CollapsableLink collapsed={collapsed} className="text-light" to="/farmer/products">
          Browse my products
        </CollapsableLink>
      </MenuItem>
    </Menu>
  );
}

function ManagerMenu({ collapsed }) {
  return (
    <Menu iconShape="circle">
      <MenuItem icon={<BsCalendarRangeFill />}>
        <CollapsableLink collapsed={collapsed} className="text-light" to="/manager/report/weekly">
          Weekly reports
        </CollapsableLink>
      </MenuItem>
      <MenuItem icon={<BsCalendarFill />}>
        <CollapsableLink collapsed={collapsed} className="text-light" to="/manager/report/monthly">
          Monthly reports
        </CollapsableLink>
      </MenuItem>
    </Menu>
  );
}

export default Aside;
