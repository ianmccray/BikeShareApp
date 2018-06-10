import React, { Component } from "react";
import ContractForm from "./ContractForm.js";
import ContractDisplay from "./ContractDisplay.js";
import firebase from "firebase";

// Initialize Firebase
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
  constructor(props) {
    super(props);
    this.state = {
      contracts: [],
      items: [],
      curName: "",
      curCompany: "",
      curDetails: ""
    };
  }


  updateFields = (field, newValue) => {
    this.setState({
      // the bracket syntax says to take the field variable, look inside, and that
      // string will be the field we use
      [field]: newValue
    });
  };

  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          newCurName: items[item].thisName,
          newCurCompany: items[item].thisCompany,
          newCurDetails: items[item].thisDetails
        });
      }
      this.setState({
        items: newState
      });
    });
  }

  addContract = () => {
    const { curName, curCompany, curDetails } = this.state;
    let newContract = {
      name: curName,
      company: curCompany,
      details: curDetails
    };

    let newContractArray = this.state.contracts.slice(); // using slice to make a (shallow) copy
    newContractArray.push(newContract);
    const itemsRef = firebase.database().ref('items');
      const item = {
        thisName: this.state.curName,
        thisCompany: this.state.curCompany,
        thisDetails: this.state.curDetails
      }
    itemsRef.push(item);

    this.setState({
      contracts: newContractArray,
      // clear the inputs
      curName: "",
      curCompany: "",
      curDetails: ""
    });
  };

  render() {
    console.log(this.state);
    const { curName, curCompany, curDetails, contracts } = this.state;
    // map over the contracts, for each one return a ContractDisplay
    const contractDisplays = this.state.items.map(contract => {
      return <ContractDisplay x={contract} />;
    });

    return (
      <div className="App">


        <ContractForm
          name={curName}
          company={curCompany}
          details={curDetails}
          updateParent={this.updateFields}
          addContract={this.addContract}
        />

        {contractDisplays}   
      </div>
    );
  }
}

export default App;


/*

<script src="https://www.gstatic.com/firebasejs/5.0.4/firebase.js"></script>
  <script>
   // Initialize Firebase
    var config = {
    apiKey: "AIzaSyC0q5TzLS0xYjnP6iYDG1FOMaEGYVPPsv8",
    authDomain: "contract-dd0bf.firebaseapp.com",
    databaseURL: "https://contract-dd0bf.firebaseio.com",
    projectId: "contract-dd0bf",
    storageBucket: "contract-dd0bf.appspot.com",
    messagingSenderId: "676485624292"
  };
  firebase.initializeApp(config);
</script>

*/