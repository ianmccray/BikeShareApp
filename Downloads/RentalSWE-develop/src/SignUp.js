import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox, Card, Alert, Modal} from 'antd';
import {Redirect} from "react-router-dom"
import 'antd/dist/antd.css'
import firebase from "./firebase"
import './Login.css'

const FormItem = Form.Item;

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: 'https://www.example.com/',
  // This must be true.
  handleCodeInApp: true,
}


class SignUp extends Component {
constructor(props) {
  super(props);
  this.state = {
    name: "",
    email: "",
    password:"",
    Login: false,
    VendorPage: false,
    bademail: false,
    badpass: false,
    errorMessage: "",
    color: "red",
    visible: false
  };
}

updateInfo = (field, e) => {
  this.setState({
    [field]: e
  });
};

resetError = e => (
  this.setState({
    errorMessage: ""
  }
  )
)


redirect = field => {
  this.setState({
    [field]: true
  });
};

showModal = () => {
  this.setState({
    visible: true,
  });
}

handleOk = (e) => {
  console.log(e);
  this.setState({
    visible: false,
  });
}

handleCancel = (e) => {
  console.log(e);
  this.setState({
    visible: false,
  });
}


signup = e => {
  e.preventDefault();
  // verify it is a @virginia.edu email address
  var verify_email = this.state.email.split('@')
  // verify that the password is at least 6 characters
  if(verify_email[1] !== "virginia.edu" && this.state.email.length > 1){
    this.setState({
      bademail: true,
      errorMessage: "Email must be a @virginia.edu email address"
    });
    return;
  }
  if(this.state.password.length < 6 && this.state.password.length > 1){
    this.setState({
      badpass: true,
      errorMessage: "Password must be at least 6 characters"
    });
    return;
  }
  if(verify_email.length > 1 && verify_email[1] === "virginia.edu") {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(credentials => {
        // add new UID as top level entry in realtime database
        console.log(credentials);
      })
      .then(e => {
        this.sendEmail(e);
        this.setState({
            visible: true
        })
      })
      .catch(error => {
        if(error.code == "auth/email-already-in-use"){
          this.setState({
            errorMessage: "Email address is already in use. Login or use a different email address"
          })
        }
        console.log(error);
      });
    }
    if (this.state.email == "" && this.state.password != "") {
      this.setState({
        errorMessage: "Please enter an email"
      })
    }
    else if (this.state.password == "" && this.state.email != "") {
      this.setState({
        errorMessage: "Please enter a password"
      })
    }
};

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


render() {
  if(this.state.Login === true){
    return <Redirect to="/Login" />;
  }
  if(this.state.VendorPage === true){
    return <Redirect to="/VendorPage" />;
  }
  return(
    <div className = "FormLogin">
    <Card style={{ width: 600, marginLeft: "32%"}}>
    <Form>
    <h1 className="RobotoTitle">Sign Up</h1>
        <FormItem>
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            style={{ width: "50%" }}
            placeholder="@virginia.edu email"
            onChange={e => this.updateInfo("email", e.target.value)}
          value={this.state.email}
        />
      </FormItem>
      <FormItem>
        <Input
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
          style={{ width: "50%" }}
          placeholder="password"
          type="password"
          onChange={e => this.updateInfo("password", e.target.value)}
          value={this.state.password}
          />
        </FormItem>
        <p style = {{color: "red"}}> {this.state.errorMessage}</p>
        <FormItem>
        <Button type="primary" htmlType="submit" className="login-form-button" onClick={e => this.signup(e)} >
            Submit
        </Button>
        <br/>
        <Button type="secondary" htmlType="submit" className="login-form-button" onClick={e => this.redirect("Login")}>
          Already a user? Login
        </Button>
        <Modal
           title="Verify your email"
           visible={this.state.visible}
           onOk={this.handleOk}
           onCancel={this.handleCancel}
           >
           <p>We have sent you a verfication email.</p>
           <p>Verify your email to complete the sign up process.</p>
         </Modal>
        <FormItem>
        </FormItem>
        </FormItem>
        </Form>
        </Card>
        </div>
  )
}
}
export default SignUp;
