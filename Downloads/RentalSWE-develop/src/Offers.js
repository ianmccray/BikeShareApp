import React, { Component } from 'react';
import App from "./App";
import firebase from "./firebase.js";
import {Redirect} from "react-router-dom";
import 'antd/dist/antd.css';
import { Layout, Form, Input, Icon, Card, Button, Col, Row, Menu, Avatar, Modal, DatePicker} from 'antd';
import './Offers.css';
import moment from 'moment';
const {RangePicker } = DatePicker;
const { Meta } = Card;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;
const InputGroup = Input.Group;
const { TextArea } = Input;
const FormItem = Form.Item;


export default class VendorProfile extends Component {
constructor(props) {
super(props);
this.state = {
    name: "",
    userid: "",
    password: "",
    redirect: false,
    redirectTarget: "",
    currentVendorItems: [],
    user: [],
    currentUserName: '',
    currentUserDescription: '',
    visible: false,
    description: '',
    currUserBuyerArray: [],
    currUserVendorArray: [],
    requestedPrice: 'None',
    rentalTime: [],
    visible: false
    };
}

//Router
redirect = e => {
    if(e != "/Profile"){
    this.setState({
        redirect: true,
        redirectTarget: e
    });
  }
}

//Handles canceling an offer, and therefore deleting it
handleDelete = (e) =>{
    firebase.database().ref('offers/' + e).remove();

    // **** Might need to just remove it from the current state array to save time ****
    this.getOfferInfo();
}

//Handles vendor rejecting, so buyer can cancel or make a counter offer
handleReject = (e) =>{
    firebase.database().ref('offers/' + e).update({
        status: "Rejected"
    });
    this.getOfferInfo();
}

//Handles acceptance of an offer, buyer now will have option to pay
handleAccept = (e) =>{
    firebase.database().ref('offers/' + e).update({
        status: "Accepted"
    });
    this.getOfferInfo();
}

getUserInfo = () => {
    firebase.auth().onAuthStateChanged( authUser => {
      if (authUser) {
        // User is signed in.
        //Auth database reference
        var user = firebase.auth().currentUser
        this.setState({
            user: firebase.auth().currentUser
        });

      } else {
        // No user is signed in.
        console.log('we messed up somewhere!')
      }
    });
}

//Modal Functions
showModal = () => {
    this.setState({
      visible: true,
    });
}

handleOk = (e) => {
    this.setState({
      visible: false,
    });
}

handleCancel = (e) => {
    this.setState({
      visible: false,
    });
}

//Disables days before the current day
disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

//Handles time string entered
handleTime = (value, dateString) => {
  this.setState({
    rentalTime: dateString
  })
}

//Handles additonal info inputted
handlePrice = (e) => {
    e.preventDefault();
    this.setState({
        requestedPrice: e.target.value
    });
}

//Handles submission of a counter offer on a rejected item
handleSubmit = (date, reqPrice, offerID) => {
    firebase.database().ref('offers/' + offerID).update({
        status: "Pending",
        date: date,
        requestedPrice: reqPrice
    });
    this.getOfferInfo();
    this.handleCancel();
}

getOfferInfo = () =>{        
    const currUserOffersRef = firebase.database().ref('offers/');
         currUserOffersRef.on('value', (snapshot) => {
            let offersSnapshot = snapshot.val();

            let buyerOffersArray = []
            let vendorOffersArray = []

            for (let offer in offersSnapshot) {
                //If the user id == the user id on the offer, they made it
               if (this.state.user.uid == offersSnapshot[offer].userUID){
                buyerOffersArray.push({
                    id: offer,
                    name: offersSnapshot[offer].name,
                    date: offersSnapshot[offer].date,
                    info: offersSnapshot[offer].info,
                    userUID: offersSnapshot[offer].userUID,
                    vendorUID: offersSnapshot[offer].vendorUID,
                    price: offersSnapshot[offer].price,
                    requestedPrice: offersSnapshot[offer].requestedPrice,
                    status: offersSnapshot[offer].status,
                });
               }
               //if the user id == the vendor id on the offer, they created the listing
               if (this.state.user.uid == offersSnapshot[offer].vendorUID){
                vendorOffersArray.push({
                    id: offer,
                    name: offersSnapshot[offer].name,
                    date: offersSnapshot[offer].date,
                    info: offersSnapshot[offer].info,
                    userUID: offersSnapshot[offer].userUID,
                    vendorUID: offersSnapshot[offer].vendorUID,
                    price: offersSnapshot[offer].price,
                    requestedPrice: offersSnapshot[offer].requestedPrice,
                    status: offersSnapshot[offer].status,
                });
               }
            }
            this.setState({
                currUserBuyerArray: buyerOffersArray,
                currUserVendorArray: vendorOffersArray
            });
        })
}

// On component mount, get info from DB and auth as well as the offer info
componentDidMount() {
  this.getUserInfo();
  this.getOfferInfo();
}

render() {
    //Router
    if(this.state.redirect == true){
        return <Redirect to= {this.state.redirectTarget} />;
    }
    return (
    <Layout>
    <Layout className="layout-header">
        <Header>
            <div className="logo" />
            <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
            >
            <Menu.Item key="1" onClick={e => this.redirect("/Marketplace")}>Marketplace</Menu.Item>
            <Menu.Item key="2" onClick={e => this.redirect("/Profile")}>Profile</Menu.Item>
            <Menu.Item key="3" onClick={e => this.redirect("/VendorPage")}>Create Listing</Menu.Item>
            </Menu>
        </Header>

    <Layout className="layout-main">
        <Sider width={300} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['3']}
              style={{ height: '100%', borderRight: 0 }}
            >
            <Menu.Item key="1" onClick={e => this.redirect("/Profile")}>Profile</Menu.Item>
            <Menu.Item key="2" onClick={e => this.redirect("/MyItems")}>My Items</Menu.Item>
            <Menu.Item key="3">Offers</Menu.Item>
            </Menu>
        </Sider>
        <Layout className="layout-profile">
            <div className= "offers-other-items" style={{margin: 40}}>
            <Row>
                <Col span = {22}>
                <Card title="My Offers">
                { //Checks if the array is empty, and lets the user know if there are no offers
                    (this.state.currUserBuyerArray.length == 0)
                    ? <div>You have no current offers on items</div> 
                    : 
                    <div> 
                    {this.state.currUserBuyerArray.map(offer => {
                    return (
                    <div>
                    <Row>
                    <Col span={20} offset={2}>
                        <div classname="card" style={{background: "#c4c4c4", width: "100%", margin: "0 auto"}}>
                        <Card className="card-content" title={offer.name + "  -  " + offer.status}>
                        Intial Price: ${offer.price} <br/>
                        Requested Price: ${offer.requestedPrice} <br/>
                        Requested Dates: {offer.date[0]}  to  {offer.date[1]} <br/>
                        <div>
                            {
                                (offer.status === "Pending")  
                                ? <div className="offersButton">
                                <Button type="primary" icon="delete" onClick={e => this.handleDelete(offer.id)}>Cancel Offer</Button>
                                </div>
                                : <div></div>
                            }
                            {
                                (offer.status === "Accepted")  
                                ? <div className="offersButton">
                                <Button type="primary" icon="delete" onClick={e => this.handleDelete(offer.id)}>Cancel Offer</Button>
                                <Button type="primary" icon="check" onClick={e => this.handlePayment(offer.id)}>Payment</Button>
                                </div>
                                : <div></div>
                            }
                            {
                                (offer.status === "Rejected")  
                                ?
                                <div className="offersButton">
                                <Button type="primary" icon="delete" onClick={e => this.handleDelete(offer.id)}>Cancel Offer</Button> 
                                <Button type="primary" icon="check" onClick={e => this.showModal()}>Make another Offer</Button>
                                <Modal
                                  visible={this.state.visible}
                                  onOk={this.handleOk}
                                  onCancel={this.handleCancel}
                                  footer={[
                                    <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                                    <Button type="primary" onClick={e => this.handleSubmit(this.state.rentalTime, this.state.requestedPrice, offer.id)}>
                                    Request
                                    </Button>
                                  ]}
                                >
                                <RangePicker
                                    disabledDate={this.disabledDate}
                                    format="MM-DD-YYYY"
                                    placeholder={['Start Time', 'End Time']}
                                    onChange={this.handleTime}
                                />
                                <p style = {{color: "red"}}> {this.state.errorMessage}</p>
                                <p>Request a different price (Optional)</p>
                                <Input
                                    placeholder="Requested Price"
                                    onChange={this.handlePrice}
                                />
                                </Modal>
                                </div>
                                : <div></div>
                            }        
                        </div>
                        </Card>
                        </div>
                    </Col>
                    </Row>
                    <br />
                    </div>
                    )
                    })
                    }
                    </div> 
                    }
                </Card>
                </Col>
            </Row>
            </div>
            <div className="offers-my-items" style={{margin: 40}}>
            <Row>
                <Col span = {22}>
                <Card title="Offers on my Items">

                { //Check if message failed
                    (this.state.currUserVendorArray.length == 0)
                    ? <div>There are no offers on your items</div> 
                    : 
                    <div>
                    {this.state.currUserVendorArray.map(offer => {
                    return (
                    <div>
                    <Row>
                    <Col span={20} offset={2}>
                        <div classname="card" style={{background: "#c4c4c4", width: "100%", margin: "0 auto"}}>
                        <Card className="card-content" title={offer.name + "  -  " + offer.status}>
                        Intial Price: ${offer.price} <br/>
                        Requested Price: ${offer.requestedPrice} <br/>
                        Requested Dates: {offer.date[0]}  to  {offer.date[1]} <br/>
                        <div>
                            {
                            (offer.status === "Pending")  
                            ? <div className="offersButton">
                            <Button type="primary" icon="delete" onClick= {e => this.handleReject(offer.id)}>Reject</Button>
                            <Button type="primary" icon="check" onClick= {e => this.handleAccept(offer.id)}>Accept</Button>
                            </div>
                            : <div></div>
                            }
                            {
                            (offer.status === "Rejected")  
                            ? <div className="offersButton">
                            <p>Awaiting counter offer from buyer, or you can delete the offer </p>
                            <Button type="primary" icon="delete" onClick= {e => this.handleDelete(offer.id)}>Cancel Offer</Button>
                            </div>
                            : <div></div>
                            }
                        </div>
                        </Card>
                        </div>
                    </Col>
                    </Row>
                    <br/>
                    </div>
                    )
                    })
                    }    
                </div> 
                }
                </Card>
                </Col>
            </Row>
            </div>
        </Layout>
        </Layout>
        </Layout>
    </Layout>
    );
    }
}
