import { Row, Container, Col } from "react-bootstrap"
import "../styles/Footer.css";

const Footer = () => {
    return (
        <Container>
            <Row className="footer">
                <Col>
                    <h5 className="footerText">&copy;Solidarity Purchase Group</h5>
                </Col>
            </Row>
        </Container>
    );
};
export default Footer;
