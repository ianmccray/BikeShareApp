import React, { Component } from "react";

/* PROPS
    contract: object with fields
      name
      company
      details
*/

export default class extends Component {
  render() {
    const { x } = this.props;
    const { newCurName, newCurCompany, newCurDetails } = x;
    console.log(x)
    console.log(newCurName);
    return (
      <div>
        <h3> Name: </h3>
        <p> {newCurName} </p>

        <h3> Company: </h3>
        <p> {newCurCompany} </p>

        <h3> Details: </h3>
        <p> {newCurDetails} </p>
      </div>
    );
  }
}