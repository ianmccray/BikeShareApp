import React, { Component } from 'react';
import './App.css';
import Form from './Form.js';
import Display from './Display.js'
import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyC0q5TzLS0xYjnP6iYDG1FOMaEGYVPPsv8",
  authDomain: "contract-dd0bf.firebaseapp.com",
  databaseURL: "https://contract-dd0bf.firebaseio.com",
  projectId: "contract-dd0bf",
  storageBucket: "contract-dd0bf.appspot.com",
  messagingSenderId: "676485624292"
};
firebase.initializeApp(config);

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      contracts: [],
      fields: [],
      outputName: "",
      outputCompany: "",
      outputDetails: ""
    }
  }

  updateFields = (field, newValue) => {
    this.setState({
      [field]: newValue
    });
  };

  
  componentDidMount() {
    const fieldsRef = firebase.database().ref('fields');
    fieldsRef.on('value', (snapshot) => {
      let fields = snapshot.val();
      let newState = [];
      for (let field in fields) {
        newState.push({
          newOutputName: fields[field].outputName,
          newOutputCompany: fields[field].outputCompany,
          newOutputDetails: fields[field].outputDetails
        });
      }
      
      this.setState({
        fields: newState
      });
    
    });
  }
  

  submitContract = () => {
    const { outputName, outputCompany, outputDetails } = this.state;

    let addedContract = {
      name: outputName,
      company: outputCompany,
      details: outputDetails
    }

    let addedContracts = this.state.contracts;
    addedContracts.push(addedContract);

    const fieldsRef = firebase.database().ref('fields');

      const newField = {
        thisName: this.state.outputName,
        thisCompany: this.state.outputCompany,
        thisDetails: this.state.outputDetails
      }

   fieldsRef.push(newField);

   
    this.setState({
      contracts: addedContracts,
      curName: "",
      curCompany: "",
      curDetails: ""
    });
  
  };

  render() {

    console.log(this.state);
    const { outputName, outputCompany, outputDetails, contracts } = this.state;

    const displays = contracts.map(contract => {
      return <Display contract={contract} />;
    });
    
    return (

      <div className="App">
      {displays}

        <Form 
        name={outputName}
        company={outputCompany}
        details={outputDetails}
        updateParent={this.updateFields}
        submitContract={this.submitContract}
        />

        <section className='display-item'>
      <div className="wrapper">
       <ul>
        {this.state.fields.map((field) => {
         return (
           <li>
               <h3>{field.thisName}</h3>
               <h3>{field.thisCompany}</h3>
               <h3>{field.thisDetails}</h3>
            </li>
                 )
               })}
             </ul>
           </div>
        </section>

      </div>
    );
  }
}

export default App;