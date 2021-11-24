import {useEffect} from "react";
import {api_getUserInfo} from "../../Api";
import {Button, Col, Image, Row} from "react-bootstrap";
import "./ClientHomePage.css";
import {useHistory} from "react-router-dom";
import img from "../../img/clientpage/vegetables-2977888_1280.jpg";
import {Link} from "react-bootstrap-icons";

{/*Pixabay License*/
}


function ClientHomePage(props) {
    const {userId} = props;
    const history = useHistory();
    return (
        <Row>
            <h2 className="mt-3 mb-3">Welcome on Solidarity Purchase
                Group, {userId} !</h2> {/*Todo update with the name of the user*/}
            <h4 className="mt-3 mb-3">Your current balance is 10€</h4> {/*Todo update with the real balance*/}
            <h3 className="pt-5">What would you like to do?</h3>
            <h4 className="pb-5"> Choose one of the options below by clicking on the image! </h4>
            <Row className="justify-content-center pt-2">
                <Col xs={6} lg={4} className="ml-auto">
                        <Row className="polaroid justify-content-center">
                            <Button style={{background:"#fff"}}   onClick={() => {
                                history.push('/employee/products'); {/*Todo update with the correct path*/}
                            }}>
                            <Image src={img} style={{width: "100%", paddingTop: "20px"}}></Image>
                            <Row class="containerImage"><h3> Add products to my basket! </h3></Row>
                            </Button>
                        </Row>

                </Col>
            </Row>
        </Row>


    )
        ;
}

export default ClientHomePage;
