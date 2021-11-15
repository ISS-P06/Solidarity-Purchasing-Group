import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";

import { BsFillPersonPlusFill, BsList, BsPlusCircle } from "react-icons/bs";
import { GiFruitBowl } from "react-icons/gi";
import { Link, useParams, useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";

function ShopEmployeeActionsList({ collapsed, toggled, handleToggleSidebar }) {
  const actionsList = {
    insertClient: "insert-client",
    showClient: "show-clients",
  };
  const history = useHistory();

  return (
    <ProSidebar
      image={false}
      rtl={false}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
      style={{
        height: "300px",
      }}
    >
      <SidebarHeader>
        <div
          style={{
            padding: "24px",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: 14,
            letterSpacing: "1px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          className="pro-sidebar"
        >
          Shop employee
        </div>
      </SidebarHeader>

      <SidebarContent className="pro-sidebar">
        <Menu iconShape="circle">
          <MenuItem
            icon={<BsFillPersonPlusFill />}
            onClick={() => {
              history.push("insert-client");
            }}
          >
            Enter a new client
          </MenuItem>
          <MenuItem
            icon={<BsList />}
            onClick={() => {
              history.push("show-clients");
            }}
          >
            Show clients
          </MenuItem>
          <MenuItem
            icon={<GiFruitBowl />}
            onClick={() => {
              history.push("browse-products");
            }}
          >
            Browse Products
          </MenuItem>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
}

export default ShopEmployeeActionsList;
