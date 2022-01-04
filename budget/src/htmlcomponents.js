import React, {useContext} from "react";
import Chart from "react-google-charts";

function DateSelectForm(props) {
    return(
        <div className="FormWrapper">
            <form>
            <div className="formTable">
                    <div className="Row">
                        <div className="Cell">
                            <input type="date"
                                   className="authInput"
                                   name = "Start_date"
                                   onChange={props.onChange}
                                   id = "Start_date"
                                   value={props.start_value}/>
                        </div>
                        <div className="Cell">
                            <input type="date"
                                   className="authInput"
                                   name = "End_date"
                                   onChange={props.onChange}
                                   id = "End_date"
                                   value={props.end_value}/>
                        </div>
                        <div className="Cell">
                            <button onClick={props.onClick}
                                    className="authInput"
                            >
                                Set period
                            </button>
                        </div>
                    </div>

            </div>
            </form>
        </div>

    )
}

class TableHeader extends React.Component{
    render() {
        return(
            <div className="HeaderWrapper">
                <div className="MiddleWrapper">
                <div className="TableHeader">
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
        </div>
        )
    }
}

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

                <div className= "authForm" onClick={(e)=>{e.stopPropagation()}}>
                    <form id = "createTransactionForm" onSubmit={(e) => {
                        console.log(e);
                        this.props.onSubmit(e);}}>
                    <h2>Add new transaction row</h2>
                    <input type="date" className="authInput" id = "transactionDate" placeholder="Date"/>
                    <div width={"100%"}>&nbsp;</div>
                    <select id = "transactionType"
                            placeholder="Type"
                            className="authInput"
                            onChange={(e) => this.handleOnChangeTypes(e)}>
                        <option  value={""}>Select type</option>
                        {this.props.transactionTypes.map((element) => {
                            return(
                                <option key = {element}value={element}>{(element===1)? 'Debit' : 'Credit'}</option>
                            )
                        })}
                    </select>
                    <div width={"100%"}>&nbsp;</div>
                    <select id = "transactionClass"
                            placeholder="Transaction Class"
                            disabled={false}
                            className="authInput"
                    >
                        <option value={""}>Select class</option>

                        {classesArray.map((element) => {
                            return( <option key = {element.id}
                                            value={element.id}>{element.record_class}
                                </option>
                            )
                        })}
                    </select>
                    <div>&nbsp;</div>
                    <input type="number" id ="transactionAmount" placeholder="Amount" className="authInput"/>
                    <div>&nbsp;</div>

                    <input type="submit" className="authInput"/>
                    <div width={"100%"}>&nbsp;</div>
                    <b style={{color: "red"}}>{this.props.modalMessage? this.props.modalMessage : "" }</b>
            </form>
                    <button className="authInput"
                            onClick={this.props.onCansel}>
                        Cansel
                    </button>
                    </div>
      )
    }

}

function AuthForm (props) {
    return (
        <div className={"authForm"} onClick={(e) => {e.stopPropagation()}}>
            <form onSubmit={(e) => props.onSubmit(e)}>
            <h3>Input user credentials</h3>
                <input id = "username" type="text" className="authInput" placeholder="Username"/>
                <p></p>
                <input id = "password" type="password" className="authInput" placeholder="Password"/>
                <p></p>
                <button>Login</button>
                <p></p>
                <b style={{color: "red"}}>{props.modalMessage? "There is an error: "+props.modalMessage : "" }</b>
            </form>
        </div>
    )
}

function CreateClassForm (props) {
    return (
        <div className={"authForm"} onClick={(e) => {e.stopPropagation()}}>
            <form onSubmit={(e) => props.onSubmit(e)}>
                <h3>Add new transaction class</h3>
                <select id={"class_type"}
                        className="authInput"
                >
                    <option value={""}>Select transaction type</option>
                    <option value={1}>Debit</option>
                    <option value={-1}>Credit</option>
                </select>
                <p></p>
                <input id = "record_class"
                       type="text"
                       className="authInput"

                       placeholder="New class"/>
                <p></p>
                <button className="authInput" >Create</button>
                <p></p>
                <b style={{color: "red"}}>{props.modalMessage? "There is an error: "+props.modalMessage : "" }</b>
            </form>
            <button className="authInput"
                    onClick={props.onCansel}>
                Cansel
            </button>
        </div>
    )
}

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


function FooterForm(props){
    return(
        <div className="FormWrapper"
             style={{marginTop: "20px"}}>
            <div className="formTable">
                <div className="Row">
                    <div className="Cell">
                        <button className="authInput"
                                onClick={props.addRow}
                        >Add row</button>
                    </div>
                    <div className="Cell">
                        <button className="authInput"
                                onClick={props.addClass}
                        >Add class</button>
                    </div>
                    <div className="Cell">
                        <button className="authInput"
                                onClick={props.showChart}
                                >View diagram</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


function MyLineChart(props) {
    let dataArray= [['Date', 'Balance']];
    let chartData = null;
    if(props.dailyBalance!==null) {
        chartData = props.dailyBalance.map((item, step) => {
            dataArray.push([new Date(item.date), item.balance]);
        })
    }


    const lineChart =
        <div className={"chartData"} onClick={(e) => {e.stopPropagation()}}>
            <Chart
                width={'700px'}
                height={'350px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={dataArray}
                options={{
                    backgroundColor: 'none',
                    hAxis: {
                        format:'dd.M.y'},
                        legend: {position: 'top'
                        },
                    title: "Daily balance",
                    titleTextStyle: {color: 'black', fontSize: 14, },
                    // Just add this option
                    is3D: true,

                }}
                rootProps={{ 'data-testid': '2' }}
            />
        </div>

    return lineChart;
}


function MyDoughNutChart(props) {
    let expensesArray = [['Class', 'Expenses']];
    let incomesArray = [['Class', 'Incomes']];
    console.log(props.byClass);
    let chartData = null;
    if (props.byClass !== null) {
        chartData = props.byClass.map((item, step) => {
            if (item.record_type < 0) {
                expensesArray.push([item.record_class__record_class, item.amount__sum*(-1)])
            } else {
                incomesArray.push([item.record_class__record_class, item.amount__sum])
            }
        })
    }


    const pieChart = (
       <div style={{display: 'flex'}} onClick={(e) => {e.stopPropagation()}}>
           <Chart
               width={'350px'}
               height={'300px'}
               chartType="PieChart"
               loader={<div>Loading Chart</div>}
               data={expensesArray}
               options={{
                   backgroundColor: 'none',
                   legend: {position: 'top', maxlines: 2, alignment: 'center'},
                   title: 'Expenses by class',
                   // Just add this option
                   titleTextStyle: {color: 'black', fontSize: 14, },
                   is3D: true,
               }}
               rootProps={{ 'data-testid': '2' }}
           />
           <Chart
               width={'350px'}
               height={'300px'}
               chartType="PieChart"
               loader={<div>Loading Chart</div>}
               data={incomesArray}
               options={{
                   backgroundColor: 'none',
                   legend: {position: 'top', maxlines: 2, alignment: 'center'},
                   title: "Incomes by classes",
                   titleTextStyle: {color: 'black', fontSize: 14, },
                   // Just add this option
                   is3D: true,
               }}
               rootProps={{ 'data-testid': '2' }}
           />
       </div>

    )
    return pieChart;
}



export { FooterForm,    DateSelectForm,     CreateTransactionForm,     TableHeader,     AuthForm,     TableBody};
export {   CreateClassForm,     Balance,     MyLineChart,     MyDoughNutChart };