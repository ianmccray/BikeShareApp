import React, { Component, Datetime } from "react";
import App from "./App";
import firebase, {storage} from "./firebase";
import {Redirect} from "react-router-dom"
import 'antd/dist/antd.css';
import { Layout, Form, Input, Icon, Card, Button, Col, Row, Menu, Avatar, Modal, Dropdown} from 'antd';import 'antd/dist/antd.css';
import './VendorPage.css';
const { Meta } = Card;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const storageRef = firebase.storage().ref();

export default class VendorPage extends Component {
  constructor() {
    super();
    this.state = {
      productName: "",
      productDescrip: "",
      productPrice: 0,
      currDate: new Date(Date.now()),
      currTime: new Date(Date.now()),
      imageFiles: [],
      isRentend: false,
      rentedStartDate: "",
      rentedEndDate: "",
      errorPriceMessage: "",
      errorMessage: "",
      imageErrorMessage: "",
      productCategory: "",
      isDisabled: true,
      url: "",
      image: null,
      category: "Choose a Category",
      imageArrayFull: false,
      itemAdded: "",
      marketplace: false,
      redirect: false,
      redirectTarget: "",
      imageURLs: []
    };
  }

//Router
  redirect = e => {
      this.setState({
          redirect: true,
          redirectTarget: e
      });
  };

handlePriceInput = e => {
    this.setState({
      [e.target.id]: e.target.value
    }, () => {
      console.log(this.state.productPrice)
if((this.state.productPrice.toString() == "")){
        this.setState({
          errorMessage: "Invalid numeric price.",
          itemAdded: "",
          isDisabled: true
         });
}
else if(this.state.productPrice.toString().indexOf('.') != -1){
    if(this.state.productPrice.toString().split('.')[1].length > 2){
      this.setState({
        errorMessage: "Invalid numeric price.",
        itemAdded: "",
        isDisabled: true
    });
  }
  else {
    this.setState({
      errorMessage: "",
      isDisabled: false
  });
  }
}
else {
      this.setState({
        errorMessage: "",
        isDisabled: false
    });
  }
}
)};

  handleUserInput = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({image}));
    }
  };

  redirect = e => {
       if(e != "/VendorPage"){
     this.setState({
         redirect: true,
         redirectTarget: e
     });
   }
 };

fileAddedHandler = event => {
  if(this.state.imageFiles.length > 3){
      this.setState({
        imageErrorMessage: "Maximum upload of 4 images.",
        imageArrayFull: true
       });
    }
  else{
    const pic = event.target.files[0];
    var joined = this.state.imageFiles.concat(pic)
    this.setState({ imageFiles: joined });
  }
};


uploadImageAsPromise = (imageFile, key) => {
  var photosRef = storageRef.child('items/'+ key + '/' + imageFile.name)
  var task = photosRef.put(imageFile);
  var user = firebase.auth().currentUser;
  task.then(() => {
    console.log("uploaded");
    photosRef
      .getDownloadURL()
      .then(url => {
        var joined2 = this.state.imageURLs.concat(url)
        this.setState({ imageURLs: joined2 });
        console.log(this.state.imageURLs)
        var newData2={
          id: key,
          itemName: this.state.productName,
          itemDescrip: this.state.productDescrip,
          itemPrice: this.state.productPrice,
          dateStamp: this.state.currTime.toLocaleDateString(),
          timeStamp: Date.now(),
          reverseTimeStamp: Date.now()*-1,
          itemCategory: this.state.category,
          itemImages: this.state.imageFiles,
          itemUID: user.uid,
          itemRented: false,
          itemImageSources: this.state.imageURLs
        }
        firebase.database().ref('items/'+key).set(newData2);
      })
      .catch(err => console.log(err));
    })
}

addItem = e => {
    e.preventDefault();
    var user = firebase.auth().currentUser;
    console.log(this.state.imageFiles)
    if(this.state.productName != "" && this.state.productDescrip != "" && this.state.category != "Choose a Category" && this.state.imageFiles[0] != null){
      this.setState({
        errorMessage: "",
        errorPriceMessage: "",
        itemAdded: "Item successfully added"
      })
var myRef = firebase.database().ref('items/').push();
var key = myRef.key;
for(var i=0; i<4; i++){
  if(this.state.imageFiles[i] != null){
    this.uploadImageAsPromise(this.state.imageFiles[i], key)
  }
  }
  var newData={
    id: key,
    itemName: this.state.productName,
    itemDescrip: this.state.productDescrip,
    itemPrice: this.state.productPrice,
    dateStamp: this.state.currTime.toLocaleDateString(),
    timeStamp: Date.now(),
    reverseTimeStamp: Date.now()*-1,
    itemCategory: this.state.category,
    itemImages: this.state.imageFiles,
    itemUID: user.uid,
    itemRented: false,
    itemImageSources: "Sources go here"
}

   myRef.set(newData);
  }
  
  else{
    this.setState({
      errorMessage: "Enter a product name, description, category, and at least one image",
      itemAdded: ""
    })
  }
  };

  render() {
    if(this.state.redirect == true){
        return <Redirect to= {this.state.redirectTarget} />;
    }
    const menu = (
      <Menu>
      <Menu.Item onClick={e => this.setState({category: "Recreational"})}>
      <a target="_blank">Recreational</a>
      </Menu.Item>
      <Menu.Item onClick={e => this.setState({category: "School Supplies"})}>
      <a target="_blank">School Supplies</a>
      </Menu.Item>
       <Menu.Item onClick={e => this.setState({category: "Electronics"})}>
        <a target="_blank">Electronics</a>
      </Menu.Item>
      <Menu.Item onClick={e => this.setState({category: "Miscellaneous"})}>
        <a target="_blank">Miscellaneous</a>
      </Menu.Item>
        </Menu>
            );

    return (
      <div>
      <Header>
          <div className="logo" />
          <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['3']}
          style={{ lineHeight: '64px' }}
          >
          <Menu.Item key="1" onClick={e => this.redirect("/Marketplace")}>Marketplace</Menu.Item>
          <Menu.Item key="2" onClick={e => this.redirect("/Profile")}>Profile</Menu.Item>
          <Menu.Item key="3" onClick={e => this.redirect("/VendorPage")}>Create Listing</Menu.Item>
          </Menu>
      </Header>
            <h1 className="RobotoTitle">Enter your Product Information</h1>
                <Input
                  style={{ width: "70%" }}
                  id="productName"
                  placeholder="Name of your Product"
                  onChange={e => this.handleUserInput(e)}
                />
              <br />
                <Input
                  style={{ width: "70%" }}
                  id="productDescrip"
                  placeholder="Product Description"
                  onChange={e => this.handleUserInput(e)}
                />
              <br />
              <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max="2500.99"
                  style={{ width: "70%" }}
                  id="productPrice"
                  placeholder="Product Price"
                  onChange={e => this.handlePriceInput(e)}
                />
              <br />
              <label style = {{color: 'red'}}>{this.state.errorMessage}</label>
              <label style = {{color: 'red'}}>{this.state.errorPriceMessage}</label>
              <label style = {{color: 'green'}}>{this.state.itemAdded}</label>
              <br />
              <div>
              <Dropdown overlay={menu} id="Dropmenu">
              <a className="ant-dropdown-link" href="#">
                {this.state.category} <Icon type="down" />
              </a>
              </Dropdown>
              <label className="new_Btn">
                            Select File<input
                              id="html_btn"
                              type="file"
                              accept=".jpg, .jpeg, .png"
                              multiple
                              onChange={e => this.fileAddedHandler(e)}
                              disabled={this.state.imageArrayFull}
                            />
                          </label>

                <img src={this.state.url}/>
                <label style = {{color: 'red'}}>{this.state.imageErrorMessage}</label>
              </div>
              <div>
               <label style = {{color: 'red'}}>{this.state.imageErrorMessage}</label>
               <br/>
              <Button type="primary" disabled={this.state.isDisabled} onClick={e => this.addItem(e)}>
                Enter
              </Button>
              <br />
              <br />
              <img src={this.state.imageURLs[0]} height="100" width="100"/>
              <img src={this.state.imageURLs[1]} height="100" width="100"/>
              <img src={this.state.imageURLs[2]} height="100" width="100"/>
              <img src={this.state.imageURLs[3]} height="100" width="100"/>
              <br />
        </div>
        <br />
        </div>
    );
  }
}
