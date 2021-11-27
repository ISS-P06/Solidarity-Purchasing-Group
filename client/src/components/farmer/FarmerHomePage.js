import {api_getUserInfo} from "../../Api";
import {Button, Col, Image, Row} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useEffect} from "react";

{/*Pixabay License*/
}


function FarmerHomePage(props) {


    const {user} = props;

    const history = useHistory();
    return (
        <Row>
            {console.log(props)}
            <h1 className="mt-3 mb-3"  style={{color:"#27511D"}}>Welcome on Solidarity Purchase
                Group, {user.name} !</h1>
            <h3 className="mt-3 mb-3">We are happy to share your farm {user.farm_name} with us</h3>
        </Row>


    )
        ;
}

export default FarmerHomePage;
