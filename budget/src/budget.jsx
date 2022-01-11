import {
     MyLineChart, MyDoughNutChart
} from "./chartComponents";

import {AuthForm} from "./authForm";
import {CreateClassForm} from "./createClassForm";
import {CreateTransactionForm} from "./createTransactionForm";
import {fetchAuthtoken, validateCreateRowData} from "./utils";
import {ModalWindow} from "./modals";
import {fetch_data, put_data, validateNewClass} from "./utils";
import {DateSelectForm} from "./dateSelectForm";
import {TableHeader} from "./tableHeader";
import {TableBody} from "./tableBody";
import {Balance} from "./balanceData";
import {FooterForm} from "./footerForm";
import React from 'react';
import './index.css';
import {urls} from "./urls";


class Budget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start_value: "2021-10-01",
            end_value: "2021-11-01",
            openBalance: null,
            closeBalance: null,
            isLoaded: false,
            transactionClasses: [],
            transactionTypes: [],
            items: [],
            token: null,
            modalAuthActive: true,
            modalAddRowActive:false,
            modalChartActive: false,
            modalAddClassActive: false,
            modalMessage: "",
            dailyBalance: null,
            byClass: null,
        };

    }

    async componentDidMount() {
        if (this.state.token){
            const today = new Date(Date.now());
            const yesterday = new Date (today - 24*60*60*1000);
            const start_date = yesterday.getFullYear()+'-'+(yesterday.getMonth()+1)+'-'+yesterday.getDate()
            const end_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            console.log(start_date);
            console.log(end_date);
            this.setState({start_value: start_date, end_value: end_date});
            const isFeedLoad = await this.handleClickDates(null, start_date, end_date);
            const loadClassStatus = await this.transactionClassLoad();
            if (isFeedLoad !== 0 || loadClassStatus !== "OK") {
                window.alert("There is an error while fetching data");
            }
            else {
                this.setState({
                    isLoaded: true,
                });
            }
        }

    }

    async transactionClassLoad() {
        const url = new URL(urls.urlTransactionClasses);
        const result = await fetch_data(url, {}, this.state.token)
        let classesArray = [];
        let typesArray = [];
        if (result[0] === 'OK') {
            result[1].map((element) => {
                classesArray.push(element);
                if (!typesArray.includes(element.class_type)) {
                    typesArray.push(element.class_type);
                }
            })
            this.setState({
                transactionClasses: classesArray,
                transactionTypes: typesArray,
            })
        }
        return result[0];
    }

    async handleClickDates(e, start_date, end_date) {
        if (e) {e.preventDefault();}
        if (new Date(start_date) < new Date(end_date)){
            const feed_url = new URL(urls.urlTransactionsBundle);
            const balance_url = new URL(urls.urlBalances);
            const daily_balance_url =  new URL(urls.urlDailyBalance);
            const by_class_url = new URL(urls.urlByClass);
            const request_params = {"start_period": start_date, "end_period": end_date};
            const feed = await fetch_data(feed_url, request_params, this.state.token);
            const balance = await fetch_data(balance_url, request_params, this.state.token);
            const dailyBalance = await fetch_data(daily_balance_url, request_params, this.state.token);
            const byClass = await fetch_data(by_class_url, request_params, this.state.token);
            if (dailyBalance[0]==='OK') {
                this.setState({
                    dailyBalance: dailyBalance[1].balances,
                })
            }
            if (byClass[0]==='OK' && byClass[1].expenses.length>0) {
                this.setState({
                    byClass: byClass[1].expenses,
                })
            }

            if (feed[0] === 'OK' && balance[0] === 'OK') {
                this.setState({items: feed[1],
                                    openBalance: balance[1].open_balance,
                                    closeBalance:balance[1].close_balance,
                                    isLoaded: true,
                })


            }
            else {
                window.alert("There is an error while fetching data");
                return 1;
            }
        }
        else{
            window.alert("End date should be greater then start one ");
            return 1;
        }
        return 0;
    }

    async handleSubmitAddClass(e){
        e.preventDefault();
        const errors = validateNewClass(this.state.transactionClasses,
                                            e.target.class_type.value,
                                            e.target.record_class.value);
        if (errors.length!==0){
            this.setState({
                modalMessage: errors,});
                window.alert("There is an error while posting data: "+ errors);
                return null;
        }
        const request_params = {
            method: "POST",
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token '  + this.state.token,
            },
            body: JSON.stringify({
                class_type: e.target.class_type.value,
                user: this.state.user_id,
                record_class: e.target.record_class.value,
            })
        };
        const result = await put_data(urls.urlPostTransactionClass, request_params);
        if (result[0] === 'Created'){
            window.alert("Class added successfully")
            this.setState({modalAddClassActive: false,
                modalMessage: "",});
            const res = await this.transactionClassLoad();
        }
        else{
            this.setState({
                modalMessage: "There is an error, check your data and try again"});
            window.alert("There is an error while posting data");
        }
    }


    async handleAuthSubmit(e){
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const res = await fetchAuthtoken(urls.urlDoLogin, username, password);
        if (res[0]===200) {
            this.setState({
                token: res[1].token,
                user_id: res[1].user_id,
                user_name: res[1].user,
                modalAuthActive: false,
                modalMessage: "",
            });
            this.componentDidMount();
        }
        else {
            this.setState({
                    modalMessage: "Wrong credentials, check username or password!",
                });
        }

    }
    async handleSubmitAddRow(e) {
        e.preventDefault();
        let url;
        url = new URL(urls.urlPostTransaction);
        const errors = validateCreateRowData(e, this.state.transactionClasses)
        console.log(errors);
        if (errors.length!==0){
            if (errors.length === 1) {
                window.alert("There is an error in form's  data:" + errors.map((item)=>{return " "+item} ));
            }
            else {
                window.alert("There are some errors in form's data:" + errors.map((item)=>{return " "+item} ));
            }
            return 1;
        }
        console.log('Transaction_type: '+e.target.transactionType.value)
        const request_params = {
            method: "POST",
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token '  + this.state.token,
            },
            body: JSON.stringify({
                transaction_date: e.target.transactionDate.value,
                user: this.state.user_id,
                record_type: (e.target.transactionType.value.toString() === '1')? 'Debit' : 'Credit',
                amount: e.target.transactionAmount.value,
                record_class: e.target.transactionClass.value,
            })
        };
        console.log(request_params);
        const result = await put_data(url, request_params);
        if (result[0] === 'Created'){
            window.alert("Row added successfully")
            this.setState({modalAddRowActive: false,
                modalMessage: "",});
            await this.handleClickDates(e, this.state.start_value, this.state.end_value);
        }
        else{
            this.setState({
                modalMessage: "There is an error, check your data and try again"});
            window.alert("There is an error while posting data");
        }
        return 0;
    }


    handleOnchangeData (e) {
        if(e.target.id === 'Start_date') {
            this.setState({start_value: e.target.value})
        }
        else {
            this.setState({end_value: e.target.value})
        }
    }

    handleClickModal(e){
        this.setState({modalAddRowActive: false,
                             modalAddClassActive: false,
                             modalChartActive: false,
        })
    }

    handleCansel(e){
        e.preventDefault();
        this.setState({modalAddClassActive: false});
        this.setState({modalAddRowActive: false});
    }

    render() {

        return (
            <div>

                <ModalWindow modalActive={this.state.modalAuthActive}>
                    <AuthForm onSubmit={(e) =>this.handleAuthSubmit(e)}
                              modalMessage = {this.state.modalMessage}
                    />
                </ModalWindow>

                <ModalWindow modalActive={this.state.modalAddRowActive}
                             onclick = {(e)=>{this.handleClickModal(e)}}>
                    <CreateTransactionForm transactionClasses = {this.state.transactionClasses}
                                           transactionTypes={this.state.transactionTypes}
                                           modalMessage = {this.state.modalMessage}
                                           onSubmit = {(e) =>this.handleSubmitAddRow(e)}
                                           onCansel = {(e) =>this.handleCansel(e)}
                    />
                </ModalWindow>
                    <ModalWindow modalActive={this.state.modalAddClassActive}
                                 onclick = {(e)=>{this.handleClickModal(e)}}>

                    <CreateClassForm onSubmit = {(e) =>this.handleSubmitAddClass(e)}
                                     onCansel = {(e) =>this.handleCansel(e)}
                        />
                    </ModalWindow>

                <ModalWindow modalActive={this.state.modalChartActive}
                             onclick = {(e)=>{this.handleClickModal(e)}}>
                    <div className="Chart">
                            <MyLineChart dailyBalance = {this.state.dailyBalance}
                                         name = {"Daily balance chart"}
                            />
                            <MyDoughNutChart byClass = {this.state.byClass}
                                             name = {"Expenses by classes"}
                            />
                    </div>
                </ModalWindow>

                <div className="HeaderWrapper" style={{textAlign: "center"}}>
                    <h1>Personal budget for user {this.state.user_name}</h1>
                </div>

                <DateSelectForm
                        start_value  = {this.state.start_value}
                        end_value = {this.state.end_value}
                        onClick={(e) => this.handleClickDates(e,this.state.start_value, this.state.end_value)}
                        onChange={(e) => this.handleOnchangeData(e)}
                />
                <TableHeader/>
                <div className="Wrapper">
                    <div className="GrossBook">

                        <Balance date = {this.state.start_value}
                                 balance = {this.state.openBalance}
                                 balanceName = "Open balance"
                        />
                        <TableBody items = {this.state.items}
                                   isLoaded = {this.state.isLoaded} />
                        <Balance date = {this.state.end_value}
                                 balance = {this.state.closeBalance}
                                 balanceName = "Close balance"
                        />

                    </div>
                </div>
                <FooterForm addRow = {()=>this.setState({modalAddRowActive: true})}
                            addClass = {()=>this.setState({modalAddClassActive: true})}
                            showChart = {()=> this.setState({modalChartActive: true})}
                />

            </div>
            );
        }

}

export {Budget}