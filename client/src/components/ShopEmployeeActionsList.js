import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const actionsList = { clientsList: 1, enterNewClient: 2, browsePoducts: 3, handOutProduct: 4, walletTopUp: 5 };
function ShopEmployeeActionsList(props) {

  const { setMessage } = props;
  
  const [activeAction, setActiveAction] = useState(actionsList.enterClientOrder);
  return (
    <ListGroup defaultActiveKey={actionsList.enterClientOrder} variant='flush'>
    
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

   
        
      
    
    </ListGroup>
  );
}

export default ShopEmployeeActionsList;

