import React from "react";

class CreateTransactionForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {filter : null,
        }

    }

    handleOnChangeTypes(e) {
        this.setState(
            {filter: e.target.value})
    }


    render() {
        let classesArray = [];
        if (this.state.filter){
            classesArray =  this.props.transactionClasses.filter(element => element.class_type.toString() === this.state.filter);
        }
        else{
            classesArray = this.props.transactionClasses;
        }
        return(
            <form id = "createTransactionForm" onSubmit={(e) =>this.props.onSubmit(e)}>
                <div className= "authForm" onClick={(e)=>{e.stopPropagation()}}>
                    <h2>Add new transaction row</h2>
                    <input type="date" className="authInputNoFlex" id = "transactionDate" placeholder="Date"/>
                    <select id = "transactionType"
                            placeholder="Type"
                            className="authInputNoFlex"
                            onChange={(e) => this.handleOnChangeTypes(e)}>
                        <option  value={""}>Select type</option>
                        {this.props.transactionTypes.map((element) => {
                            return(
                                <option key = {element}value={element}>{(element===1)? 'Debit' : 'Credit'}</option>
                            )
                        })}
                    </select>
                    <select id = "transactionClass"
                            placeholder="Transaction Class"
                            disabled={false}
                            className="authInputNoFlex"
                    >
                        <option value={""}>Select class</option>
                        {classesArray.map((element) => {
                            return( <option key = {element.id}
                                            value={element.id}>{element.record_class}
                                </option>
                            )
                        })}
                    </select>
                    <input type="number" id ="transactionAmount" placeholder="Amount" className="authInputNoFlex"/>
                    <button className="authInputNoFlex" placeholder={"Send data"}>
                        Submit
                    </button>
                    <button className="authInputNoFlex" onClick={this.props.onCansel}>
                        Cansel
                    </button>
                    <b style={{color: "red"}}>{this.props.modalMessage? this.props.modalMessage : "" }</b>
                </div>
            </form>
        )
    }

}

export {CreateTransactionForm}