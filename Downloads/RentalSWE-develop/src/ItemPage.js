import React, { Component } from 'react';
import App from "./App";
import firebase from "./firebase.js";
import {Redirect} from "react-router-dom";
import 'antd/dist/antd.css';
import moment from 'moment';
import './ItemPage.css';
import { Layout, Form, Input, Icon, Card, Button, Col, Row, Menu, Avatar, Modal, Carousel, DatePicker} from 'antd';
const { Meta } = Card;
const { SubMenu } = Menu;
const {RangePicker } = DatePicker;
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;
const InputGroup = Input.Group;
const { TextArea } = Input;
const FormItem = Form.Item;


export default class ItemPage extends Component {
constructor(props) {
super(props);
this.state = {
    name: "",
    userid: "",
    password: "",
    redirect: false,
    redirectTarget: "",
    currentVendorItems: [],
    visible: false,
    loading: false,
    itemID: this.props.match.params.itemID,
    currentItemID: '',
    currentItemName: '',
    currentItemCategory: '',
    currentItemDescription: '',
    currentItemPrice: null,
    rentalTime:[],
    requestedPrice: 'None',
    badTime: false,
    errorMessage: '',
    currentItemUID: '',
    rentalSuccess: false,
    currentItemImages: []
    };
}

//Router
redirect = e => {
    this.setState({
        redirect: true,
        redirectTarget: e
    });
}

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

//Handles submission of the rental request
handleSubmit = (date, reqPrice, uid) => {

    console.log(this.state.rentalTime)
    //Validation for a non-empty date
    if(this.state.rentalTime.length == 0 || this.state.rentalTime[0] == "" || this.state.rentalTime[1] == "" ){
        this.setState({
          badTime: true,
          errorMessage: "Please enter a date(s)!"
        });
        return;
    }

    //Create offer
    const rentalRequest = {
        name: this.state.currentItemName,
        date: date,
        price: this.state.currentItemPrice,
        requestedPrice: reqPrice,
        vendorUID: uid,
        userUID: this.state.user.uid,
        status: "Pending",
        phoneNumber: null,
    }

    //Add Offer to the offers section
    firebase.database().ref('offers/').push(rentalRequest)

    this.setState({
        rentalSuccess: true
    })

    //Close Modal
    this.handleCancel()
}

getItemInfo = () => {
    firebase.auth().onAuthStateChanged( authUser => {
      if (authUser) {
        // User is signed in.
        //Auth database reference
        var user = firebase.auth().currentUser
        this.setState({
            user: firebase.auth().currentUser
        });

        //Firebase reference to the user from Realtime database
        const currItemRef = firebase.database().ref('items/' + this.state.itemID)
        currItemRef.on('value', (snapshot) => {
            let currItemRefSnapshot = snapshot.val();
            this.setState({
            currentItemID: currItemRefSnapshot,
            currentItemUID: currItemRefSnapshot.itemUID,
            currentItemName: currItemRefSnapshot.itemName,
            currentItemCategory: currItemRefSnapshot.itemCategory,
            currentItemDescription: currItemRefSnapshot.itemDescrip,
            currentItemPrice: currItemRefSnapshot.itemPrice,
            currentItemImages: currItemRefSnapshot.itemImageSources
            });
        })

      } else {
        // No user is signed in.
        console.log('we messed up somewhere!')
      }
    });
}

onChange(a, b, c) {
    console.log("");
}

componentDidMount(){
    this.getItemInfo();
}

render(){
    if(this.state.redirect == true){
        return <Redirect to= {this.state.redirectTarget} />;
    }

  
	return(
		<Layout>
		<Header>
            <div className="logo" />
            <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
            >
            <Menu.Item key="1" onClick={e => this.redirect("/Marketplace")}>Marketplace</Menu.Item>
            <Menu.Item key="2" onClick={e => this.redirect("/Profile")}>Profile</Menu.Item>
            <Menu.Item key="3" onClick={e => this.redirect("/VendorPage")}>Create Listing</Menu.Item>
            </Menu>
        </Header>
      	<Content style={{ padding: '0 50px' }}>
      	<Layout style={{ padding: '24px 0', background: '#fff' }}>
	      	<Content style={{ padding: '0 24px', minHeight: 500 }}>
	          <br>
            </br>
            <Carousel effect="fade">
            <div><img src={this.state.currentItemImages[0]} height="350" width="400" class="center"/></div>
            <div><img src={this.state.currentItemImages[1]} height="350" width="400" class="center"/></div>
            <div><img src={this.state.currentItemImages[2]} height="350" width="400" class="center"/></div>
            <div><img src={this.state.currentItemImages[3]} height="350" width="400" class="center"/></div>
            </Carousel>
            <br/>
            <br/>
	        </Content>
	        <Sider width={400} style={{ background: '#fff' }}>
	        <div className="current-item-name">
	        	<b>{this.state.currentItemName}</b>
	        </div>
	        <div>
	        	<p>{this.state.currentItemDescription}</p>
	        </div>
	        <div>
	        	<b>{this.state.currentItemPrice}</b>
	        </div>
	        <div>
            {(this.state.rentalSuccess == true)
                ? <div>Item Requested!</div> 
                :
                <div>
                <Button onClick={e => this.showModal()}><Icon type="pay-circle"/>Request Rental</Button>
                <Modal
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                    <Button type="primary" onClick={e => this.handleSubmit(this.state.rentalTime, this.state.requestedPrice, this.state.currentItemUID)}>
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
            }
	        </div>
	        </Sider>
      	</Layout>
    	</Content>
		</Layout>
	)
    }
}
  
  /*
 return(

        <div>
            <h1>{this.state.currentItemName}</h1>
            <h2>{this.state.currentItemCategory}</h2>
            <h2>{this.state.currentItemDescription}</h2>
            <h3>{"$"+this.state.currentItemPrice}</h3>
        </div>
        )
}

} */

