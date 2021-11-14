import { useState } from "react";
/* import { ListGroup } from "react-bootstrap"; */

import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { ProSidebar, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import { FaTachometerAlt, FaGem, FaList, FaGithub, FaRegLaughWink, FaHeart, FaBars } from 'react-icons/fa';

const actionsList = { clientsList: 1, enterNewClient: 2, browsePoducts: 3, handOutProduct: 4, walletTopUp: 5 };
/*function ShopEmployeeActionsList(props) {


  const [activeAction, setActiveAction] = useState(actionsList.enterClientOrder);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    {/* <ListGroup defaultActiveKey={actionsList.enterClientOrder} variant='flush'>


      <ListGroup.Item
        id={actionsList.enterNewClient}
        action
        active={activeAction === actionsList.enterNewClient}
        onClick={() => {
          setActiveAction(actionsList.enterNewClient);
        }}>
        Enter a new client
      </ListGroup.Item>


      <ListGroup.Item
        id={actionsList.clientsList}
        action
        active={activeAction === actionsList.clientsList}
        onClick={() => {
          setActiveAction(actionsList.clientsList);
        }}>
        Show the list of clients
      </ListGroup.Item>


    </ListGroup> */
function ShopEmployeeActionsList(props) {
  const {toggled, collapsed, handleCollapsedChanged, handleToggleSidebar, setMessage}={props}
  const [activeAction, setActiveAction] = useState(actionsList.enterClientOrder);



  return (
  
      <ProSidebar collapsed={collapsed} toggled={toggled} onToggle={handleToggleSidebar}>
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
          >
            SIDEBAR
          </div>
        </SidebarHeader>

        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem
              icon={<FaTachometerAlt />}
              suffix={<span className="badge red">NEW</span>}
            >
        
            </MenuItem>
            <MenuItem icon={<FaGem />}> AHAHA</MenuItem>
          </Menu>
        </SidebarContent>


        <SidebarFooter style={{ textAlign: 'center' }}>
          <div
            className="sidebar-btn-wrapper"
            style={{
              padding: '20px 24px',
            }}
          >
            <a
              href="https://github.com/azouaoui-med/react-pro-sidebar"
              target="_blank"
              className="sidebar-btn"
              rel="noopener noreferrer"
            >
              <FaGithub />
              <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                viw
              </span>
            </a>
          </div>
        </SidebarFooter>

      </ProSidebar>

  )
}

export default ShopEmployeeActionsList;

