import React from "react";

function Balance(props){
    if (props.balance) {
        return(
            <div className={(props.balance>0)? "BalanceDebit" : "BalanceCredit"}>

                <div className="TransactionId">

                </div>

                <div className="TransactionDate">
                    {props.date}
                </div>

                <div className="TransactionClass">
                    {props.balanceName}
                </div>

                <div className="TransactionType">

                </div>

                <div className="TransactionAmount">
                    {props.balance}
                </div>

            </div>

        )
    }
    else{
        return("")
    }

}

export {Balance};