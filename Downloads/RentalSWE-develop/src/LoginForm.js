import React, { Component } from "react";
//import { Input, Button, Row, Col, notification }
import App from "./App";
import {Redirect} from "react-router-dom"
import { Form, Icon, Input, Button, Checkbox, Card, Modal} from 'antd';
import 'antd/dist/antd.css'
import './Login.css'
import firebase from "./firebase";

const FormItem = Form.Item;

export default class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      SignUp: false,
      VendorPage: false,
      errorMessage: "",
      emailVerified: false,
      loginPersistence: "LOCAL",
      visible: false,
      firstVisible: false,
      firstTime: false,
      credentials1: ""
    };
  }

  handleUserInput = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  redirect = field => {
    this.setState({
      [field]: true
    });
  };

  resetError = e => (
    this.setState({
      errorMessage: ""
    }
    )
  )

  onChange =  e =>  {
    if(this.state.loginPersistence == "SESSION"){
      this.setState({
        loginPersistence: "LOCAL"
      })
    }
    else if(this.state.loginPersistence == "LOCAL"){
      this.setState({
        loginPersistence: "SESSION"
      })
    }
    console.log(this.state)
  }

  setPersistence = field => {
    if(field == "SESSION"){
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    }
    else if(field == "LOCAL"){
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    }

  }

  findUser = email => {
    var name = null
    firebase.database().ref('/users/').orderByChild('email').equalTo(email).on("value", function(snapshot) {
    console.log(snapshot.val())
    if(snapshot.val() === null){
      name = "First time user"
    }
    snapshot.forEach(function(data) {
        console.log(data.val().name)
        name = data.val().name
    });
  });
  if(name === "First time user"){
    this.setState({
      firstTime: true,
      firstVisible: true
    })
  }
}


  sendEmail = e => {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function() {
      console.log("Email Sent")
      console.log(user.email)
      console.log(user.emailVerified)
    }).catch(error =>
      console.log(error)
    )
  }

  //Unverified user modal
  showModal = () => {
   this.setState({
     visible: true,
   });
  }

  handleOk = (e) => {
    this.sendEmail(e);
    console.log(e);
    this.setState({
      visible: false
    });
  }

  handleCancel = (e) => {
  console.log(e);
  this.setState({
    visible: false,
  });
  }

  //First time user modal
  firsthandleOk = (e) => {
    const name = this.state.name
    firebase.database().ref('/users/').orderByChild('email').equalTo(this.state.email).on("value", function(snapshot) {
    snapshot.forEach(function(data) {
        firebase.database().ref('/users/').child(data.key).child("name").set(name);
        firebase.database().ref('/users/').child(data.key).child("profilePhoto").set("https://i.stack.imgur.com/dr5qp.jpg");
    });
  });
    this.setState({
      firstVisible: false,
      firstTime: false
    });
  }

  firsthandleCancel = (e) => {
  console.log(e);
  this.setState({
    firstVisible: false,
  });
  }

  login = e => {
    e.preventDefault();
    this.findUser(this.state.email);
    var verify_email = this.state.email.split('@')
    if(this.state.email != "" && this.state.password != "" && verify_email[1] === "virginia.edu")
    {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(credentials => {
              this.setState({
                credentials1: credentials
              })
              console.log("Checkpoint 1")
              this.findUser(this.state.email);
          })
      .then(credentials => {
        console.log(this.state.credentials1)
        if(firebase.auth().currentUser.emailVerified && this.state.firstTime){
          firebase.database().ref('users/' + this.state.credentials1.user.uid).set({
            name: "First time user",
            email: this.state.email,
            insuranceUploaded: false
          })
          console.log("User added")
        }
        this.findUser(this.state.email);
        if (!firebase.auth().currentUser.emailVerified){
          this.setState({
            visible: true,
            firstVisible: false
          })
        }
      })
      .then(u => {
        this.setState({
          emailVerified: firebase.auth().currentUser.emailVerified,
        })
      })
      .catch(error => {
        this.setState({
          errorMessage: error.message
        })
      });
    }
    else if (this.state.email != "" && verify_email[1] != "virginia.edu"){
      this.setState({
        errorMessage: "Invalid Email. Must be a valid UVA email id"
      })
    }
    else if (this.state.email == "" && this.state.password != "") {
      this.setState({
        errorMessage: "Please enter an email"
      })
    }
    else if (this.state.password == "" && this.state.email != "") {
      this.setState({
        errorMessage: "Please enter a password"
      })
    }
    else{
      this.setState({
        errorMessage: "Please enter an email and password"
      })
    }
    this.setPersistence(this.state.setPersistence);
  };



  render() {
    console.log(this.state)
    if(this.state.SignUp == true){
      return <Redirect to="/SignUp" />;
    }
    if(this.state.emailVerified == true && this.state.firstTime == false){
      return <Redirect to="/Profile" />;
      console.log(firebase.auth.Auth.Persistence)
    }
    return (
      <div class="backdrop">>
        <section>
          <div className="HeaderFiller" />
          <div className="LoginBackground">
          <div className = "FormLogin">
          <Card style={{ width: 600, marginLeft: "32%"}}>
          <Form>
            <h1 className="RobotoTitle">Login</h1>
            <FormItem>
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  style={{ width: "50%" }}
                  id="email"
                  placeholder="Username/Email"
                  onChange={e => this.handleUserInput(e)}
                />
            </FormItem>
            <FormItem>
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type = "password"
                  style={{ width: "50%"}}
                  id="password"
                  placeholder="Password"
                  type="password"
                  onChange={e => this.handleUserInput(e)}
                />
            <p style = {{color: "red"}}> {this.state.errorMessage}</p>
            </FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button" onClick={e => this.login(e)}>
              Log in
              </Button>
            <br/>
            <br/>
            <Button type="secondary" htmlType="submit" className="login-form-button" onClick={e => this.redirect("SignUp")}>
              Do not have an account?
            </Button>
            <Modal
              title="Email Not Verified"
              visible={this.state.visible && !this.state.firstVisible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>You have not verified you email address.</p>
              <p>Do you want to send a new verfication email?</p>
            </Modal>
            <Modal
              title="First Time User"
              visible={this.state.firstVisible && this.state.firstTime && this.state.emailVerified}
              onOk={this.firsthandleOk}
              onCancel={this.firsthandleCancel}
            >
              <p>This is your first time logging in. </p>
              <p>Enter your information.</p>
              <FormItem>
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                style={{ width: "50%" }}
                placeholder="name"
                id = "name"
                onChange={e => this.handleUserInput(e)}
                value={this.state.name}
              />
              </FormItem>
            </Modal>
            <br/>
            <FormItem>
               <Checkbox onChange= {e => this.onChange(e)}>Stay Logged In</Checkbox>
            </FormItem>
              </Form>
              </Card>
              </div>
          </div>
        </section>
      </div>
    );
  }
}
