import React from "react";

function FooterForm(props){
    return(
        <div className="FormWrapper"
             style={{marginTop: "20px"}}>
            <div className="formTableFlex">

                <button className="authInput"
                        onClick={props.addRow}
                >Add row</button>
                <button className="authInput"
                        onClick={props.addClass}
                >Add class</button>
                <button className="authInput"
                        onClick={props.showChart}
                >View diagram</button>
            </div>
        </div>
    )
}

export {FooterForm};