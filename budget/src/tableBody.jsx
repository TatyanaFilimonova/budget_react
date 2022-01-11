import React from "react";

function TableBody(props) {
    if (!props.isLoaded){
        return (<div>Data loaded form server.....</div>)
    }
    const table =  props.items.map((item, num) =>(
        <div key={item.id} className={item.record_type === 'Debit'? "TransactionDebit" : "TransactionCredit"}>

            <div className="TransactionId">
                {num+1}
            </div>

            <div className="TransactionDate">
                {item.transaction_date}
            </div>

            <div className="TransactionClass">
                {item.record_class.record_class}
            </div>

            <div className="TransactionType">
                {item.record_type}
            </div>

            <div className="TransactionAmount">
                {item.amount}
            </div>

        </div>

    ))
    return table;
}

export {TableBody};