import React, {useContext} from "react";
import Chart from "react-google-charts";


function MyLineChart(props) {
    let dataArray= [['Date', 'Balance']];
    let chartData = null;
    let width = 0;
    if(props.dailyBalance!==null) {
        chartData = props.dailyBalance.map((item, step) => {
            dataArray.push([new Date(item.date), item.balance]);
        })
    }
    if (window.innerWidth<=576){
        width = window.innerWidth*0.9;
    }
    else {
        width = window.innerWidth*0.5;
    }

    const lineChart =
        <div className={"ChartData"} onClick={(e) => {e.stopPropagation()}}>
            <Chart
                width={width}
                height={width}
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
    let chartData = null;
    let width = 0;
    if (window.innerWidth<=576){
        width = window.innerWidth*0.9;
    }
    else {
        width = window.innerWidth*0.5;
    }
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
        <div onClick={(e) => {e.stopPropagation()}}
        class ="ChartData">
            <Chart
                width={width}
                height={width}
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
                width={window.innerWidth/2- 20}
                height={window.innerWidth/2}
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



export { MyLineChart,     MyDoughNutChart };