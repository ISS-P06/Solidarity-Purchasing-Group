import { Row, Col, Container, Card } from 'react-bootstrap';
import { api_computeHomepageStats } from "../../Api";
import { useState, useEffect } from 'react';
import { addMessage } from "../Message";
import { BsCalendarRangeFill, BsFillPersonFill, BsCalendarFill } from 'react-icons/bs';
import { GiFruitBowl, GiFruitTree } from 'react-icons/gi';
import { FaRegListAlt } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

function ManagerHomePage() {
    const [clients, setClients] = useState("");
    const [farmers, setFarmers] = useState("");
    const [shopEmployees, setShopEmployees] = useState("");
    const [managers, setManagers] = useState("");
    const [orders, setOrders] = useState("");
    const [suppliers, setSuppliers] = useState("");
    const [products, setProducts] = useState("");
    const history = useHistory();

    useEffect(() => {
        api_computeHomepageStats()
            .then((response) => {
                setClients(response.userStats.client);
                setFarmers(response.userStats.farmer);
                setShopEmployees(response.userStats.shop_employee);
                setManagers(response.userStats.manager);
                setOrders(response.numOrders);
                setSuppliers(response.numFarmers);
                setProducts(response.numProducts);
            })
            .catch((error) => {
                addMessage({ message: 'An error occurred during the homepage stats generation', type: 'danger' });
            });
    }, []);

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={10}>
                    <h1 style={{ color: "#27511D" }}>Welcome to SPG manager area</h1>
                </Col>
                <h3>From here you can monitor the whole business status</h3>
                <Row className="justify-content-center">
                    <Col xs={12} xl={6}>
                        <h2 className="pt-3" style={{ color: "#27511D" }}>Users stats:</h2>
                        <Card bg="light" text="black" className="shadow p-2" >
                            <div style={{ textAlign: "left" }}>
                                <BsFillPersonFill className="stat-icon" />
                                <span className="p-3">Number of clients</span>
                                <span className="p-3" style={{ float: "right", fontSize: "18px" }}>{clients}</span>
                            </div>
                        </Card>
                        <Card bg="light" text="black" className="shadow p-2" >
                            <div style={{ textAlign: "left" }}>
                                <BsFillPersonFill className="stat-icon" />
                                <span className="p-3">Number of farmers</span>
                                <span className="p-3" style={{ float: "right", fontSize: "18px" }}>{farmers}</span>
                            </div>
                        </Card>
                        <Card bg="light" text="black" className="shadow p-2" >
                            <div style={{ textAlign: "left" }}>
                                <BsFillPersonFill className="stat-icon" />
                                <span className="p-3">Number of shop employees</span>
                                <span className="p-3" style={{ float: "right", fontSize: "18px" }}>{shopEmployees}</span>
                            </div>
                        </Card>
                        <Card bg="light" text="black" className="shadow p-2" >
                            <div style={{ textAlign: "left" }}>
                                <BsFillPersonFill className="stat-icon" />
                                <span className="p-3">Number of managers</span>
                                <span className="p-3" style={{ float: "right", fontSize: "18px" }}>{managers}</span>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={12} xl={6}>
                        <h2 className="pt-3" style={{ color: "#27511D" }}>Orders stats:</h2>
                        <Card bg="light" text="black" className="shadow p-2" >
                            <div style={{ textAlign: "left" }}>
                                <FaRegListAlt className="stat-icon" />
                                <span className="p-3">Orders created this week</span>
                                <span className="p-3" style={{ float: "right", fontSize: "18px" }}>{orders}</span>
                            </div>
                        </Card>
                        <Card bg="light" text="black" className="shadow p-2" >
                            <div style={{ textAlign: "left" }}>
                                <GiFruitBowl className="stat-icon" />
                                <span className="p-3">Products confirmed this week </span>
                                <span className="p-3" style={{ float: "right", fontSize: "18px" }}>{products}</span>
                            </div>
                        </Card>
                        <Card bg="light" text="black" className="shadow p-2" >
                            <div style={{ textAlign: "left" }}>
                                <GiFruitTree className="stat-icon" />
                                <span className="p-3">Suppliers of this week </span>
                                <span className="p-3" style={{ float: "right", fontSize: "18px" }}>{suppliers}</span>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <h2 className="pt-3" style={{ color: "#27511D" }}>Features:</h2>
                <Row className="justify-content-center">
                    <Col xs={12} lg={6}>
                        <Card bg="light" text="black" className="shadow p-3 d-flex flex-row" style={{ cursor: "pointer" }}
                            onClick={() => { history.push('/manager/report/weekly'); }} >
                            <div>
                                <BsCalendarRangeFill className="feature-icon" />
                            </div>
                            <div className="d-flex flex-column">
                                <h5 style={{ display: 'flex', justifyContent: 'left', paddingLeft: '20px' }}>Weekly reports</h5>
                                <div style={{ textAlign: 'left', paddingLeft: '20px' }}>Generate here weekly reports for delivered and undelivered orders and food</div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={12} lg={6}>
                        <Card bg="light" text="black" className="shadow p-3 d-flex flex-row" style={{ cursor: "pointer" }}
                            onClick={() => { history.push('/manager/report/monthly'); }} >
                            <div>
                                <BsCalendarFill className="feature-icon" />
                            </div>
                            <div className="d-flex flex-column">
                                <h5 style={{ display: 'flex', justifyContent: 'left', paddingLeft: '20px' }}>Monthly reports</h5>
                                <div style={{ textAlign: 'left', paddingLeft: '20px' }}>Generate here monthly reports for delivered and undelivered orders and food</div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Row>
        </Container>
    );
}

export default ManagerHomePage;
