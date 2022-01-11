import React from "react";

function DateSelectForm(props) {
    return(
        <div className="FormWrapper">
            <form>
                <div className="formTableFlex">
                    <input type="date"
                           className="authInput"
                           name = "Start_date"
                           onChange={props.onChange}
                           id = "Start_date"
                           value={props.start_value}/>
                    <input type="date"
                           className="authInput"
                           name = "End_date"
                           onChange={props.onChange}
                           id = "End_date"
                           value={props.end_value}/>
                    <button onClick={props.onClick}
                            className="authInput"
                    >
                        Set period
                    </button>

                </div>
            </form>
        </div>

    )
}

export {DateSelectForm}