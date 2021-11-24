import { Carousel, Image, Row, Col, Container } from 'react-bootstrap';
import image1 from './img/homepage/Agriculture.jpg';
import image2 from './img/homepage/Strawberry.jpg';
import image3 from './img/homepage/Zucchini.jpg';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import { ImBoxAdd, ImBoxRemove } from 'react-icons/im';
import { GiWallet } from 'react-icons/gi';
import { RiShoppingBasketFill } from 'react-icons/ri';
import "./HomePage.css"

function HomePage() {


    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={0} md={10}>
                    <Carousel className="mt-3" >
                        <Carousel.Item>
                            <Image src={image1} className="img" alt="A non profit organization" />
                            <Carousel.Caption>
                                <Container>
                                    <Row>
                                        <Col xs={12} md={{ offset: 2, span: 8 }}>
                                            <h2 className="bg-dark pb-2">A non profit organization</h2>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{ offset: 1, span: 10 }}>
                                            <p className="bg-dark pt-2 pb-2">Support your own local farmers with our app, every purchase helps them grow!</p>
                                        </Col>
                                    </Row>
                                </Container>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <Image src={image2} className="img" alt="Solidarity among clients" />
                            <Carousel.Caption>
                                <Container>
                                    <Row>
                                        <Col xs={12} md={{ offset: 2, span: 8 }}>
                                            <h2 className="bg-dark pb-2">Solidarity among clients</h2>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{ offset: 1, span: 10 }}>
                                            <p className="bg-dark pt-2 pb-2">We believe collaboration is the key to reducing food waste</p>
                                        </Col>
                                    </Row>
                                </Container>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <Image src={image3} className="img" alt="First slide" />
                            <Carousel.Caption>
                                <Container>
                                    <Row>
                                        <Col xs={12} md={{ offset: 2, span: 8 }}>
                                            <h2 className="bg-dark pb-2">Sustainable agriculture</h2>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{ offset: 1, span: 10 }}>
                                            <p className="bg-dark pt-2 pb-2">Discover healthy and seasonal products from your area</p>
                                        </Col>
                                    </Row>
                                </Container>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Col>
                <h1 className="mt-4 pb-2">Welcome to SPG!</h1>
                <h3>
                    We are a self-organized group of citizens and farmers that try to promote a sustainable and high-quality network of food in order to buy and sell products at a fair price.
                </h3>
                <h1 className="pt-3">Check out our new features!</h1>
                <h3 className="m-3 pb-2 pt-2">Services for shop employees</h3>
                <Row className="justify-content-center">
                    <Col xs={6} lg={3}>
                        <BsFillPersonPlusFill className="icon" />
                        <h5>
                            Enter a new client
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <ImBoxAdd className="icon" />
                        <h5>
                            Create an order for a client
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <ImBoxRemove className="icon" />
                        <h5>
                            Hand out products to a client
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <GiWallet className="icon" />
                        <h5>
                            Top-up a client's wallet
                        </h5>
                    </Col>
                </Row>
                <h3 className="m-3 pt-1">Services for clients</h3>
                <Row className="justify-content-center">
                    <Col xs={6} lg={3}>
                        <BsFillPersonPlusFill className="icon" />
                        <h5>
                            Register
                        </h5>
                    </Col>
                    <Col xs={6} lg={3}>
                        <RiShoppingBasketFill className="icon" />
                        <h5>
                            Add product to basket
                        </h5>
                    </Col>
                </Row>
            </Row>
        </Container>
    )
        ;
}

export default HomePage;
