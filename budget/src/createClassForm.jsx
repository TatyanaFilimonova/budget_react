import React from "react";


function CreateClassForm (props) {
    return (
        <form onSubmit={(e) => props.onSubmit(e)}>
            <div className={"authForm"} onClick={(e) => {e.stopPropagation()}}>
                <h3>Add new transaction class</h3>
                <select id={"class_type"}
                        className="authInputNoFlex"
                >
                    <option value={""}>Select transaction type</option>
                    <option value={1}>Debit</option>
                    <option value={-1}>Credit</option>
                </select>
                <input id = "record_class"
                       type="text"
                       className="authInputNoFlex"
                       placeholder="New class"
                       autoComplete="off"
                />
                <button className="authInputNoFlex" >Create</button>


                <button className="authInputNoFlex"
                    onClick={props.onCansel}>
                Cansel
                </button>
                <b style={{color: "red"}}>{props.modalMessage? "There is an error: "+props.modalMessage : "" }</b>
            </div>
        </form>
    )
}

export {CreateClassForm}