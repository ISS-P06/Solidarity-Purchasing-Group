import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Col, Container } from 'react-bootstrap';
import AppNavbar from './components/AppNavbar';

function App() {
  return (
    <Container className="App bg-light text-dark p-0 m-0 min-vh-100" fluid>
       <AppNavbar  />
    </Container>
  );
}

export default App;
