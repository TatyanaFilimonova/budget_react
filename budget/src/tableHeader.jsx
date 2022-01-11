import React from "react";

class TableHeader extends React.Component{
    render() {
        return(
            <div className="WrapperHeader">
                    <div className="GrossBook" style = {{backgroundColor: "lightskyblue"}}>
                        <div className="TransactionId">
                            <b>#</b>
                        </div>

                        <div className="TransactionDate">
                            <b>Date</b>
                        </div>

                        <div className="TransactionClass">
                            <b>Transaction class</b>
                        </div>

                        <div className="TransactionType">
                            <b>Transaction type</b>
                        </div>

                        <div className="TransactionAmount">
                            <b>Amount</b>
                        </div>

                    </div>
            </div>
        )
    }
}

export {TableHeader};