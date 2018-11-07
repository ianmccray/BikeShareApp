
import React, { Component } from 'react';
import App from "./App";
import firebase from "./firebase.js";
import {Redirect} from "react-router-dom";
import 'antd/dist/antd.css';
import { Layout, Form, Input, Icon, Card, Button, Col, Row, Menu, Avatar, Modal} from 'antd';
const { Meta } = Card;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;
const InputGroup = Input.Group;
const { TextArea } = Input;
const FormItem = Form.Item;


const storageRef = firebase.storage().ref();

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
    imageFile: "",
    imageUrl: "",
    imageArrayFull: false,
    image: null,
    imageErrorMessage: "",
    user: [],
    currentUserName: '',
    currentUserDescription: '',
    currentProfilePhoto: '',
    visible: false,
    locationModalVisible: false,
    description: '',
    locationPreference: "N/A",
    description: '',
    visiblePic: false,
    color: 'red'
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
};

//Modal Functions
showModal = () => {
    this.setState({
      visible: true,
    });
}


showLocationModal = () => {
    this.setState({
      locationModalVisible: true,
    });
}

showModalPic = () => {
    this.setState({
      visiblePic: true,
    });
}

handleOk = (e) => {
    this.setState({
      visible: false,
      visiblePic: false
    });
}

locationHandleOk = (e) => {
    this.setState({
      locationModalVisible: false,
    });
}

handleCancel = (e) => {
    this.setState({
      visible: false,
      visiblePic: false
    });
}

locationHandleCancel = (e) => {
    this.setState({
      locationModalVisible: false,
    });
}

//Update Description
handleDescription = (e) => {
    e.preventDefault();
    this.setState({
        description: e.target.value
    });
}

handleLocation = (e) => {
    e.preventDefault();
    this.setState({
        locationPreference: e.target.value
    });
}

//Handle submission of Description
onSubmit = (e) => {
    firebase.database().ref('users/' + this.state.user.uid).update({
        description: e
    });
    this.getUserInfo();
    this.handleCancel();
}


onLocationSubmit = (e) => {
    firebase.database().ref('users/' + this.state.user.uid).update({
        locationPreference: e
    });
    this.locationHandleCancel();
}

fileAddedHandler = event => {
    const pic = event.target.files[0];
    this.setState({ imageFile: pic });
}

uploadImageAsPromise = () => {
  var user = this.state.user.uid;
  var photosRef = storageRef.child('users/'+ user + '/' + this.state.imageFile.name)
  var task = photosRef.put(this.state.imageFile);
  task.then(() => {
    console.log("uploaded");
    photosRef
     .getDownloadURL()
     .then(url => {
       this.setState({
         imageUrl: url
       })
     firebase.database().ref('users/'+user).update({
         profilePhoto: this.state.imageUrl
     });
   })
     })
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

        //Firebase reference to the user from Realtime database
        const currUserRef = firebase.database().ref('users/' + user.uid)
        currUserRef.on('value', (snapshot) => {
            let currUserRefSnapshot = snapshot.val();

            this.setState({
                currentUserName: currUserRefSnapshot.name,
                currentUserDescription: currUserRefSnapshot.description,
                currentUserLocation: currUserRefSnapshot.locationPreference,
                currentProfilePhoto:currUserRefSnapshot.profilePhoto
                //currentUserDescription: currUserRefSnapshot.description
            });
        })

      } else {
        // No user is signed in.
        console.log('we messed up somewhere!')
      }
    });

}


// On component mount, get info from DB and auth
componentDidMount() {
  this.getUserInfo();
}


render() {
  console.log(this.state);
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
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
            >
            <Menu.Item key="1">Profile</Menu.Item>
            <Menu.Item key="2" onClick={e => this.redirect("/MyItems")}>My Items</Menu.Item>
            <Menu.Item key="3" onClick={e => this.redirect("/Offers")}>Offers</Menu.Item>
            </Menu>
        </Sider>

        <Layout className="layout-profile">
            <div style={{margin: 40}}>
                <div className="profile-avatar">
                    <img src={this.state.currentProfilePhoto} height="150" width="150"/>
                </div>
                <div className = "profile-upload" style={{margin: 20}}>

                  <Button onClick={() => this.showModalPic()}> <Icon type="upload"/>Upload Avatar</Button>

                </div>
                <div className="profile-info" style={{margin: 20}}>
                <p>Name: {this.state.currentUserName}</p>
                <p>Email: {this.state.user.email}</p>
                <p>Description: {this.state.currentUserDescription}</p>
                <p>Bio: {this.state.currentUserDescription}</p>
                <p>Location Preference: {this.state.locationPreference}</p>
                </div>

                <div className = "description-upload" style={{margin: 20}}>
                   <Button onClick={() => this.showModal()}><Icon type="upload"/>Add Description</Button>
                </div>
                <div className = "locationpref-upload" style={{margin: 20}}>
                   <Button onClick={() => this.showLocationModal()}><Icon type="upload"/>Add Location Preference</Button>
                </div>
                <div className = "insurance" style={{margin: 20}}>
                   <Button onClick={() => this.redirect("/Insurance")}><Icon type="upload"/>Add Insurance</Button>
                </div>
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                    <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                    <Button type="primary" htmlType="submit" onClick={e => this.onSubmit(this.state.description)}>Update</Button>,
                ]}
                >
                <Form layout="inline" style={{margin: 15}}>
                <TextArea
                    rows={5}
                    placeholder="Enter Bio"
                    onChange={this.handleDescription}
                    value={this.state.description}
                />
                </Form>
                </Modal>
                <Modal
                    visible={this.state.locationModalVisible}
                    onOk={this.locationHandleOk}
                    onCancel={this.locationHandleCancel}
                    footer={[
                    <Button key="back" onClick={this.locationHandleCancel}>Cancel</Button>,
                    <Button type="primary" htmlType="submit" onClick={e => this.onLocationSubmit(this.state.locationPreference)}>Update</Button>,
                ]}
                >
                <Form layout="inline" style={{margin: 15}}>
                <TextArea
                    rows={5}
                    placeholder="Enter Location Preference"
                    onChange={this.handleLocation}
                    value={this.state.locationPreference}
                />
                </Form>
               </Modal>
               <Modal
                    visible={this.state.visiblePic}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                    <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                ]}
                >
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
                <label style = {{color: this.state.color}}>{this.state.imageErrorMessage}</label>
                <br/>
                <br/>
                <Button type="primary" disabled={this.state.isDisabled} onClick = {this.uploadImageAsPromise}>
                Add Photo
              </Button>
                </Modal>
            </div>
        </Layout>
        </Layout>
        </Layout>
    </Layout>
    );
    }
}
