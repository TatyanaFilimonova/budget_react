async function  fetchAuthtoken(url, username, password) {
    const request_params = {
        method: "POST",
        cache: 'no-cache',
        mode: 'cors',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
           // 'Access-Control-Allow-Origin': '*'
        },
        body: new URLSearchParams({
            'username': username,
            'password': password,
        })
    };
    try {
        const response = await fetch(url, request_params);
        const result = await response.json();
        const resp_status = response.status
        return [resp_status, result];
    }
    catch(e){
        return [400, ""]
    }


}

async function  fetch_data(url, params, token=''){
    url.search = new URLSearchParams(params).toString();
    const request_params = {
        method: "get",
        cache: 'no-cache',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token '  + token,
        },
    };
    const response = await fetch(url, request_params);
    const resp_status = response.statusText
    const result = await response.json();
    return [resp_status, result];
}

async function  put_data(url, params){
    const response = await fetch(url, params);
    console.log(response);
    const resp_status = response.statusText;
    const result = await response.json();
    return [resp_status, result];
}

function validateCreateRowData(e, transactionClasses){
    let errorArray = [];
    const classesArray = transactionClasses.map((item) =>{
        return item.id.toString();
    })
    const testDate = new Date(e.target.transactionDate.value)
    if (testDate.toString() === 'Invalid Date') {
        errorArray.push('Invalid Date');
    }
    if (!['1', '-1', 1, -1].includes(e.target.transactionType.value)){
        errorArray.push('Invalid Transaction type');
    }
    if(!classesArray.includes(e.target.transactionClass.value)){
        errorArray.push('Invalid Transaction class');
    }
    if(isNaN(parseFloat(e.target.transactionAmount.value))){
        errorArray.push('Amount should not be empty');
    }

    if (parseFloat(e.target.transactionAmount.value)*Number(e.target.transactionType.value)<=0){
        errorArray.push('Amount should belong transaction type: Amount<0 for Credit operation, Amount>0 for Debit');
    }
    return errorArray;
}

function validateNewClass(transactionClasses, class_type, record_class) {
    let errors = [];
    if (!['1','-1'].includes(class_type) ){
        errors.push('Class type doesnt have valid value');
    }
    if(!record_class)    {
        errors.push('Record class couldnt be empty');
    }
    const check_array = transactionClasses.map(item=>{
         return  JSON.stringify( {class_type: item.class_type.toString(), record_class: item.record_class
         }) === JSON.stringify({class_type: class_type, record_class: record_class});
     })
    console.log(check_array);
     if (check_array.includes(true)) {
         errors.push("Transaction class already exists");
    }
    return errors;
}

export {fetch_data, put_data, fetchAuthtoken, validateCreateRowData, validateNewClass};
