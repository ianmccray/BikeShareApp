
import React, { Component } from 'react';
import App from "./App";
import firebase from "./firebase.js";
import {Redirect} from "react-router-dom";
import 'antd/dist/antd.css';
import { Layout, Form, Input, Icon, Card, Button, Col, Row, Menu, Modal} from 'antd';
const { Meta } = Card;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;
const InputGroup = Input.Group;


export default class marketplace extends Component {
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
    deleteWasClicked: false
    };
}

showModal = () => {
    this.setState({
      deleteWasClicked: true,
      visible: true
    });
}

redirect = e => {
    if(this.state.deleteWasClicked == true){
        this.setState({
            deleteWasClicked: false
        })
    }
    else{
    console.log("STILL REDIRECTED BOI")
    this.setState({
        redirect: true,
        redirectTarget: e
    });
}
};

deleteItem = e => {
    firebase.database().ref('/items/' + e).remove()
};

handleOk = (e) => {
    this.deleteItem(e);
    this.setState({
      visible: false,
    });
}

handleCancel = (e) => {
    this.setState({
      visible: false,
    });
}

getUserInfo = () => {
  firebase.auth().onAuthStateChanged( authUser => {
    if (authUser) {
      var user = firebase.auth().currentUser
      console.log('users/' + user.uid)
      this.setState({
          user: firebase.auth().currentUser
      })
      //Updates the render() with all the challenges in Firebase
      const currUserItemsRef = firebase.database().ref('items/');
         currUserItemsRef.on('value', (snapshot) => {
             let currUserItemsSnapshot = snapshot.val();
             let currUserItemsArray = []
             console.log(user.uid)
             for (let item in currUserItemsSnapshot) {
               //console.log(currUserItemsSnapshot[item].itemUID)
               if(user.uid == currUserItemsSnapshot[item].itemUID){
                 currUserItemsArray.push({
                     id: item,
                     name: currUserItemsSnapshot[item].itemName,
                     price: currUserItemsSnapshot[item].itemPrice,
                     image: currUserItemsSnapshot[item].itemImages,
                     itemUID: currUserItemsSnapshot[item].itemUID,
                     rented: currUserItemsSnapshot[item].itemRented
                 });
               }
             }
             this.setState({
                 currentVendorItems: currUserItemsArray
             });
         })

      }
    });
}

componentDidMount() {
    this.getUserInfo();
}



render() {
    console.log(this.state.deleteWasClicked)
    if(this.state.redirect == true){
        return <Redirect to= {this.state.redirectTarget} />;
    }
    const { visible, loading } = this.state;
    return (
    <Layout>
    <Layout className="layout-header">
        <Header>
            <div className="logo" />
            <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px'}}
            >
            <Menu.Item key="1" onClick={e => this.redirect("/Marketplace")}>Marketplace</Menu.Item>
            <Menu.Item key="2" onClick={e => this.redirect("/Profile")}>Profile</Menu.Item>
            <Menu.Item key="3" onClick={e => this.redirect("/VendorPage")}>Create Listing</Menu.Item>
            </Menu>
        </Header>

    <Layout className="main">
        <Sider width={300} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['2']}
              style={{ height: '100%', borderRight: 0 }}
            >
            <Menu.Item key="1" onClick={e => this.redirect("/Profile")}>Profile</Menu.Item>
            <Menu.Item key="2">My Items</Menu.Item>
            <Menu.Item key="3" onClick={e => this.redirect("/Offers")}>Offers</Menu.Item>
            </Menu>
        </Sider>

        <Layout className="layout-myitems">
            <div className = "profile-upload" style={{margin: 20}}>
            <Button onClick={e => this.redirect("/VendorPage")}> <Icon type="plus"/>Add New Item</Button>
            </div>

            <div>
            <Row gutter={12} style={{margin:30}}>
            {this.state.currentVendorItems.map(item => {
              let rentedText;
              if(item.rented){
                rentedText = <p>Rented</p>
              }
              else{
                rentedText = <p>Not Rented</p>
              }
                return (
                    <Col span={8} style={{padding: 20}}>
                    <Card
                    hoverable

                    style={{ width: 240, color: "green" }}
                    cover={<img src= {item.image} />}
                    bordered = {true}
                    onClick = {e => this.redirect('/Item/' + item.id )}
                    >
                    <Meta
                    title= {item.name}
                    description={item.price}
                    />

                    <div className="item-extra-meta" style={{margin: 10}}>

                        <p>{rentedText}</p>
                        <Button onClick={e => this.showModal()}><Icon type="close"/>Delete</Button>
                        <Modal
                          visible={this.state.visible}
                          onOk={this.handleOk}
                          onCancel={this.handleCancel}
                          footer={[
                            <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                            <Button type="primary" loading={loading} onClick={e => this.handleOk(item.id)}>
                              Delete
                            </Button>,
                          ]}
                        >
                          <p>Are you sure you want to remove this item?</p>
                        </Modal>
                    </div>
                    </Card>
                    <div>
                    <Button onClick={e => this.showModal()}><Icon type="close"/>Delete</Button>

                    </div>
                    </Col>
                    )
                    
                })
                
            }

            </Row>
            </div>
        </Layout>
        </Layout>
        </Layout>
    </Layout>
    );
    }
}
