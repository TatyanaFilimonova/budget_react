import React from "react";

function ModalWindow(props){
    return(
            <div className="modal"
                 onClick={props.onclick}
                 style={{opacity: (props.modalActive? "1" : "0"),
                                           pointerEvents: (props.modalActive? "auto" : "none")}}
            >
                {props.children}
            </div>
    )
}

export {ModalWindow}