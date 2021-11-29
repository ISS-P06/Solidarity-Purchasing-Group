import { useEffect } from "react";
import { api_getUserInfo } from "../../Api";
import { Button, Col, Image, Row, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import img from "(../../../public/img/client/vegetables-g380a038fb_640.jpg";
import orderImg from "(../../../public/img/client/space-4967335_1280.png";
import { Link } from "react-bootstrap-icons";

{/*Pixabay License*/
}


function ClientHomePage(props) {
    const { user } = props;
    const history = useHistory();
    return (
        <Row>
            <h1 className="mt-3 mb-3" style={{ color: "#27511D" }}>Welcome on Solidarity Purchase
                Group, {user && user.name} {user && user.surname}  !</h1> {/*Todo update with the name of the user*/}
            <h4 className="mt-3 mb-3">Your current balance is {user && user.balance} € </h4> {/*Todo update with the real balance*/}
            <h3 className="pt-5">What would you like to do?</h3>
            <h4 className="pb-5"> Choose one of the options below by clicking on the images! </h4>
            <Row className="justify-content-center pt-2">
                <Col xs={12} lg={6} className="ml-auto">
                    <Container>
                        <Row>
                            <Col className="polaroid justify-content-center p-0">
                                <Button style={{ background: "#fff" }} onClick={() => {
                                    history.push('/employee/products'); {/*Todo update with the correct path*/ }
                                }}>
                                    <Image src={img} style={{ width: "100%", paddingTop: "20px" }}></Image>
                                    <Row class="containerImage"><h3>Add products to my basket</h3></Row>
                                </Button>
                            </Col>
                            <Col className="polaroid justify-content-center p-0">
                                <Button style={{ background: "#fff" }} onClick={() => {
                                    history.push('/client/orders'); {/*Todo update with the correct path*/ }
                                }}>
                                    <Image src={orderImg} style={{ width: "100%", paddingTop: "20px" }}></Image>
                                    <Row class="containerImage"><h3>Browse my order history list</h3></Row>
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Row>


    )
        ;
}

export default ClientHomePage;
