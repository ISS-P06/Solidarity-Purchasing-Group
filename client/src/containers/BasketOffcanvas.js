import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Offcanvas } from 'react-bootstrap';
import { BsBasket2} from 'react-icons/bs';
import Basket from '../components/order/Basket';

export function BasketOffcanvas({userId, virtualTime}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button  
        style={{background: '#f71'}} 
        onClick={handleShow}
        ><BsBasket2 size={30} />
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{fontSize: 25}}>Basket</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
         <Basket userId={userId} virtualTime={virtualTime}/>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}