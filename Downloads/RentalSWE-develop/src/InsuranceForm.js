import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';
import DownloadLink from "react-download-link";
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import SWEEdwardRadion from './pdfFiles/SWEEdwardRadion.pdf';
import { Input, Button, Menu, Dropdown, Icon, Modal } from 'antd';

 const storageRef = firebase.storage().ref();

 export default class InsuranceForm extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
    form: "",
    formURL: "",
    visible: false,
    file: null,
    message: ""
  }

  showModal = e => {
    if(this.state.file){
    this.setState({
      visible: true,
      message: ""
    });
  }
  else{
    this.setState({
      visible: false,
      message: "No file selected"
    });
  }
  }

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  }

  handleChange = e => {
    if (e.target.value) {
        const file = e.target.value;
        this.setState(() => ({file}));
    }
  };

  handleOk = e => {
    const pdfFile = this.state.file;
    console.log(pdfFile)
    var user = firebase.auth().currentUser;
    let formRef = storageRef.child('users/' + user.uid + '/insuranceForm');
        formRef.put(pdfFile).then(function(snapshot){
          console.log("Uploaded")
        });
    this.setState({
      visible: false,
      message: "File successfully uploaded"
    });
    };

    handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }

   render() {
    const { pageNumber, numPages } = this.state;
    let fileRef = storageRef.child('Screen Shot 2018-10-23 at 8.14.46 PM.png');
    return (
      <div>
      <div>
        <Document
          file={SWEEdwardRadion}
          onLoadSuccess={this.onDocumentLoad}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
      </div>
        <a href={SWEEdwardRadion} download="Insurance Form">Download</a>
        <label className="new_Btn">
            Select File<input
            id="html_btn"
            type="file"
            accept=".pdf"
            disabled={this.state.imageArrayFull}
            onChange={e => this.setState({
              file: e.target.files[0]
            })}
            />
        </label>

        <div>
        <Button type="primary" onClick={e => this.showModal(e)}>
          Upload
        </Button>
        <Modal
          title="Pay the Premium"
          visible={this.state.visible}
          onOk={e => this.handleOk(e)}
          onCancel={this.handleCancel}
        >
          <p>You must pay a premium in order to apply insurance</p>
        </Modal>
      </div>
      <label>{this.state.message}</label>
       </div>
    );
  }
}

/*
try {
      const url = storageRef.child('SWEEdwardRadion.pdf').getDownloadURL();
      console.log("downloading url: " + url);
      const result = fetch(url, {
          headers: {
              "Content-type": "pdf"
          },
          mode: 'no-cors'
      });
      return result;
  } catch (e) {
      console.log("error downloading: " + e.message);
  }
*/