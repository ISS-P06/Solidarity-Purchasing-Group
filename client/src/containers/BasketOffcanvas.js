import { Button, Offcanvas } from 'react-bootstrap';
import { BsBasket2} from 'react-icons/bs';
import Basket from '../components/order/Basket';

export default function BasketOffcanvas({userId, virtualTime, show, setShow}) {
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" data-testid="basket-button"
        onClick={handleShow}
        ><BsBasket2 size={26} />
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{fontSize: 25}}>Basket</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
         <Basket userId={userId} virtualTime={virtualTime} handleClose={handleClose}/>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}