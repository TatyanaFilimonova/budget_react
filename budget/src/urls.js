const server = "http://127.0.0.1:8000/budget_api/grossbook/"

const urls = {
    urlDoLogin: server+"login/",
    urlTransactions: server+"",
    urlBalances: server+"balance/",
    urlPostTransaction: server+"ops/",
    urlTransactionsBundle: server+"bounded/",
    urlTransactionClasses: server+"classes/",
    urlPostTransactionClass: server+"classes/ops/",
    urlDailyBalance: server+"balance/daily/",
    urlByClass: server+"by/class/",
};

export {urls};