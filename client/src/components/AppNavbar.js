import { Navbar } from "react-bootstrap";
import VirtualClock from "./VirtualClock";

function AppNavbar(props) {
  return (
    <Navbar expand="md" bg="primary">
      <Navbar.Brand className="text-light px-4 my-auto ml-md-0">
        <h3>Solidarity Purchasing Group</h3>
      </Navbar.Brand>

      {/* TODO Button on the extreme right */}
      <Navbar.Brand className="mx-auto mb-3">
        <VirtualClock />
      </Navbar.Brand>
    </Navbar>
  );
}

export default AppNavbar;
