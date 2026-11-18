const API_URL = "https://xaus.com/api/v1";
const JSON_SERVER = "http://localhost:3001"
// const products = await request(`${JSON_SERVER}/products`, {method: 'POST',
//     headers : {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//         "id": "",
//       "title": "Bague en or 18 carats",
//       "description": "Bague élégante en or jaune 18 carats",
//       "price": 700,
//       "category": "coin",
//       "status": "sold",
//       "createdAt": "2026-11-10"
//     })
// })


async function request(url, options = {}) {
    const controller = new AbortController()
    const timeout = setTimeout(function(){
        controller.abort()
    }, 8000)
    try {
        const response = await fetch(url,{ 
            ...options,signal: controller.signal})
        if (!response.ok)
        {
           const error = new Error('Something went wrong!')
           error.type = "http"
           error.status = response.status
           throw  error
        }

        const reponseText = await response.text()
        
        if (reponseText === "") {
            return null
        }
        const data_json = JSON.parse(reponseText)
        
        return data_json        
    } catch (error) {
        if (error.name == 'TypeError') {
            error.type = 'network'
            error.status = null
        }
        else if (error.name == 'SyntaxError') {
            error.type = 'parse'
            error.status = null
        }
        else if (error.name == 'AbortError') {
            error.type = 'timeout'
            error.status = null
        }
        throw error
    } finally
    {
        clearTimeout(timeout)
    }
}
async function GetPreviousDayData(metal, unit, fxRate) {

    const history_data = await request(`${API_URL}/chart?symbol=${metal}&range=5d`)
    
    let previousprice = history_data.points[history_data.points.length - 2].c
    return (previousprice * fxRate) / 31.1035   
}

async function GetGoldData(currency) {
   
    const gold_data = await request(`${API_URL}/spot?currency=${currency}&unit=gram`)

    const previousDayPrice = await GetPreviousDayData('xau', 'gram', gold_data.fx_rate)
    const change = gold_data.xau.price - previousDayPrice

    
    const changeRate = (change / previousDayPrice) * 100

    
    return {name: "Gold", price: gold_data.xau.price.toFixed(2), currency: gold_data.xau.currency, unit: "Gramme", change: change.toFixed(2), changerate: changeRate.toFixed(2)}
}

async function GetSilverData(currency) {
    
    const silver_data = await request(`${API_URL}/spot?currency=${currency}&unit=gram`)
    const silverPrice = (silver_data.silver_usd_oz * silver_data.fx_rate)/31.1034768

    const previousDayPrice = await GetPreviousDayData('silver', 'gram', silver_data.fx_rate)
    
    const change = silverPrice - previousDayPrice
    const changeRate = (change / previousDayPrice) * 100

    return {name: "Silver", price: silverPrice.toFixed(2), currency: silver_data.xau.currency, unit: "Gramme", change: change.toFixed(2), changerate: changeRate.toFixed(2)}
}

async function GetMetalHistory(symbol, range = '') {
    const goldHistory = await request(`${API_URL}/chart?symbol=${symbol}&range=1mo&interval=1d`)
    const spotData = await request(`${API_URL}/spot?currency=MAD&unit=gram`)
    const fxrate = spotData.fx_rate

    const data = []
    goldHistory.points.forEach(function(DayData){
        data.push({dayDate: new Date(DayData.t * 1000).toISOString().slice(0, 10), ClosePrice: (DayData.c * fxrate) / 31.1034768}) 
    })
    
    return (range == 7 ?  data.slice(-7): data)    
}
export {GetGoldData, GetSilverData, GetMetalHistory}





//test the server-api endpoints


