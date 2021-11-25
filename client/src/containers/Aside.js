import { useHistory } from 'react-router-dom';
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

function ShopEmployeeActionsList({ collapsed, toggled, handleToggleSidebar }) {
  const history = useHistory();

  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
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
          Shop employee
        </div>
      </SidebarHeader>

      <SidebarContent className="pro-sidebar">
        <Menu iconShape="circle">
          <MenuItem
            icon={<BsFillPersonPlusFill />}
            onClick={() => {
              history.push('/employee/register');
            }}>
            Enter a new client
          </MenuItem>
          <MenuItem
            icon={<BsList />}
            onClick={() => {
              history.push('/employee/clients');
            }}>
            Show clients
          </MenuItem>
          <MenuItem
            icon={<GiFruitBowl />}
            onClick={() => {
              history.push('/employee/products');
            }}>
            Browse Products
          </MenuItem>
          <MenuItem
            icon={<BsList />}
            onClick={() => {
              history.push('/employee/orders');
            }}>
            Browse Orders
          </MenuItem>
        </Menu>
        <SidebarFooter>
          {/* todo aggiustare posizione virtual clock */}
          <VirtualClock />
        </SidebarFooter>
      </SidebarContent>
    </ProSidebar>
  );
}

export default ShopEmployeeActionsList;
