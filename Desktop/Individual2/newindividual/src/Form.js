import React, { Component } from "react";


export default class Form extends React.Component {

    render () {
        const { name, company, details, updateParent, submitContract } = this.props;
        return (
            <form>
           <div>
           <input 
           placeholder="Name" 
           onChange={e => updateParent("outputName", e.target.value)}
           value={name} 
           />
           </div>
        
           <div>
           <input 
           placeholder="Company" 
           onChange={e => updateParent("outputCompany", e.target.value)}
           value={company} 
           />
           </div>

            <div>
           <input 
           placeholder="Details" 
           onChange={e => updateParent("outputDetails", e.target.value)}
           value={details}
           />
           </div>

            <button onClick={submitContract}>Submit</button>
            </form>
        );
    }

}
  