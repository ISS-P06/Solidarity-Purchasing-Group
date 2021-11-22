import {Carousel, Image, Row, Col} from 'react-bootstrap';
import image1 from './img/homepage/Agriculture.jpg';
import image2 from './img/homepage/Strawberry.jpg';
import image3 from './img/homepage/Zucchini.jpg';
import {BsFillPersonPlusFill} from 'react-icons/bs';
import {ImBoxAdd, ImBoxRemove} from 'react-icons/im';
import {GiWallet} from 'react-icons/gi';
import {RiShoppingBasketFill} from 'react-icons/ri';
import "./HomePage.css"

function HomePage() {


    return (
        <Row className="justify-content-center">
             <Col xs={0} md={10}>
                <Carousel className="mt-3" >
                    <Carousel.Item>
                        <Image  src={image1} className="img" alt="A non profit organization" />
                        <Carousel.Caption>
                            <h2>A non profit organization</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image src={image2}  className="img" alt="Solidarity among clients" />
                        <Carousel.Caption>
                            <h2>Solidarity among clients</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image  src={image3}  className="img" alt="First slide" />
                        <Carousel.Caption>
                            <h2>Sustainable agriculture</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </Col>
            <h1 className="mt-5">Who we are?</h1>
            <h3>
                <h4> We are a self-organized group of citizens and farmers that try to promote a sustainable and high-quality network of food in order to buy and sell products at a fair price.”</h4>
            </h3>
            <h1 className="m-3">What does we do?</h1>
            <h3 className="m-3">Service for the shop employee</h3>
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
            </Row>
            <h3 className="m-3">Service for a client </h3>
            <Row className="justify-content-center">
                <Col xs={6} lg={3}>
                    <BsFillPersonPlusFill className="icon"/>
                    <h5>
                        Register
                    </h5>
                </Col>
                <Col xs={6} lg={3}>
                        <RiShoppingBasketFill className="icon"/>
                    <h5>
                        Add product to basket
                    </h5>
                </Col>
            </Row>
        </Row>

    )
        ;
}

export default HomePage;
