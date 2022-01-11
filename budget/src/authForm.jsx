import React from "react";

function AuthForm (props) {
    return (
        <form onSubmit={(e) => props.onSubmit(e)}>
            <div className={"authForm"} onClick={(e) => {e.stopPropagation()}}>
                <h3>Input user credentials</h3>
                <input id = "username" type="text" className="authInputNoFlex" placeholder="Username"/>
                <input id = "password" type="password" className="authInputNoFlex" placeholder="Password"/>
                <button className="authInputNoFlex">Login</button>
                <b style={{color: "red"}}>{props.modalMessage? "There is an error: "+props.modalMessage : "" }</b>
            </div>
        </form>
    )
}

export {AuthForm}