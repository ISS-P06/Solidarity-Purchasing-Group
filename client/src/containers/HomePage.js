import {Carousel, Image, Row, Col, Container} from 'react-bootstrap';
import {BsFillPersonPlusFill, BsBox} from 'react-icons/bs';
import {ImBoxAdd, ImBoxRemove} from 'react-icons/im';
import {RiShoppingBasketFill, RiTelegramLine} from 'react-icons/ri';
import {GiFruitBowl,GiWallet, GiFruitTree} from 'react-icons/gi';
import {MdPendingActions, MdDeliveryDining} from 'react-icons/md';
import {FaTelegramPlane} from 'react-icons/fa';
import {BiStore} from 'react-icons/bi'



function HomePage() {
    const image1 = '/img/homepage/Agriculture.jpg';
    const image2 = '/img/homepage/Strawberry.jpg';
    const image3 = '/img/homepage/Zucchini.jpg';

    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={0} md={10}>


                    <h1 style={{color:"#27511D"}}>Welcome to Solidarity Purchasing Group!</h1>
                    <Carousel className="mt-3 d-none d-md-block" >
                        <Carousel.Item>
                            <Image src={image1} className="img" alt="A non profit organization"
                                   style={{width: "60%", paddingTop: "20px"}}/>
                            <Carousel.Caption>
                                <Container>
                                    <Row>
                                        <Col xs={10} md={{offset: 2, span: 8}}>
                                            <h2 className="pb-2" style={{background: "#839d7c"}}>A non profit
                                                organization</h2>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{offset: 1, span: 10}}>
                                            <p className="pt-2 pb-2"
                                               style={{background: "#839d7c", fontStyle: "italic"}}>Support your own
                                                local farmers with our
                                                app, every purchase helps them grow!</p>
                                        </Col>
                                    </Row>
                                </Container>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <Image src={image2} className="img" alt="Solidarity among clients"
                                   style={{width: "60%", paddingTop: "20px"}}/>
                            <Carousel.Caption>
                                <Container>
                                    <Row>
                                        <Col xs={12} md={{offset: 2, span: 8}}>
                                            <h2 className="pb-2" style={{background: "#839d7c"}}>Solidarity among
                                                clients</h2>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{offset: 1, span: 10}}>
                                            <p className="pt-2 pb-2"
                                               style={{background: "#839d7c", fontStyle: "italic"}}>We believe
                                                collaboration is the key to
                                                reducing food waste</p>
                                        </Col>
                                    </Row>
                                </Container>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <Image src={image3} className="img" alt="Sustainable agriculture"
                                   style={{width: "60%", paddingTop: "20px"}}/>
                            <Carousel.Caption>
                                <Container>
                                    <Row>
                                        <Col xs={12} md={{offset: 2, span: 8}}>
                                            <h2 className="pb-2" style={{background: "#839d7c"}}>Sustainable
                                                agriculture</h2>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{offset: 1, span: 10}}>
                                            <p className="pt-2 pb-2"
                                               style={{background: "#839d7c", fontStyle: "italic"}}>Discover healthy and
                                                seasonal products from
                                                your area</p>
                                        </Col>
                                    </Row>
                                </Container>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Col>
                <h3 className={"mt-5"}>
                    We are a self-organized group of citizens and farmers that try to promote a sustainable and
                    high-quality network of food in order to buy and sell products at a fair price.
                </h3>
                <h1 className="pt-3" style={{color: "#27511D"}}>Check out our new features!</h1>
                <h3 className="m-3 pt-1">Services for clients</h3>
                <Row className="justify-content-center">
                    <Col xs={6} lg={3}>
                        <BsFillPersonPlusFill className="icon"/>
                        <h5>
                            Register
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <GiFruitBowl className="icon"/>
                        <h5>
                            Browse the available products
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <RiShoppingBasketFill className="icon"/>
                        <h5>
                            Add products to basket
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <BsBox className="icon"/>
                        <h5>
                            Browse orders
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <MdDeliveryDining className="icon"/>
                        <h5>
                            Schedule bag delivery
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <BiStore className="icon"/>
                        <h5>
                            Schedule pick-up in store
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <FaTelegramPlane className="icon"/>
                        <h5>
                            Join to telegram channel
                        </h5>
                    </Col>


                </Row>
                <h3 className="m-3 pb-2 pt-2">Services for shop employees</h3>
                <Row className="justify-content-center">
                    <Col xs={6} lg={3}>
                        <BsFillPersonPlusFill className="icon"/>
                        <h5>
                            Enter a new client
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <ImBoxAdd className="icon"/>
                        <h5>
                            Create an order for a client
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <ImBoxRemove className="icon"/>
                        <h5>
                            Hand out products to a client
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <GiWallet className="icon"/>
                        <h5>
                            Top-up a client's wallet
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <MdPendingActions className="icon"/>
                        <h5>
                            Check order in cancellation
                        </h5>
                    </Col>
                </Row>

                <h3 className="m-3 pt-1">Services for farmers</h3>
                <Row className="justify-content-center">
                    <Col xs={6} lg={3}>
                        <GiFruitTree className="icon"/>
                        <h5>
                            Report expected available product amounts
                        </h5>
                    </Col>

                </Row>
            </Row>
        </Container>
    )

}

export default HomePage;
