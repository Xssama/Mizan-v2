import { GetGoldData, GetSilverData, GetMetalHistory } from "../services/metals-service.js";
import {getFavoritesProductsData, LoadData, LoadProductsToState, UpdateGoldPrice, UpdateSelectedCurrency, UpdateSilverPrice } from "../storage.js";
import { renderLineChart, CalculateChartCoordinates } from "../charts.js";
import { loadCard, renderLastUpdatelabel } from "./render-metals.js";

const cards_containers = document.getElementById('metals-container')

const cards_status_P = document.getElementById('cards-status')
const refresh_cards = document.getElementById('refresh-cards')
const refresh_textcontent = document.getElementById('refresh-textcontent')
const history_status_p = document.getElementById('history-status')

async function renderPage() {
    const currentDate = new Date()
    renderLastUpdatelabel(currentDate)
    const mizan_currency = LoadData()
    document.getElementById('select-currency').value = mizan_currency
    await loadMetalCrads(mizan_currency)
    LoadHistory()
}

async function loadMetalCrads(currency)
{
    cards_containers.replaceChildren()
    cards_status_P.textContent = "Loading..."
    cards_status_P.className = "loading"
    refresh_cards.disabled = true
    try
    {
        const [GoldData, SilverData] = await Promise.all([GetGoldData(currency), GetSilverData(currency)]) 
        
        const currentDate = new Date()
        renderLastUpdatelabel(currentDate)
        cards_status_P.textContent = ""
        cards_status_P.className = ""

        UpdateGoldPrice(GoldData.price)
        UpdateSilverPrice(SilverData.price)
        UpdateSelectedCurrency(currency)
        const goldCard = loadCard(GoldData)
        cards_containers.appendChild(goldCard)
        const SilverCard = loadCard(SilverData)
        cards_containers.appendChild(SilverCard)
        refresh_textcontent.textContent = "Actualiser"

    }

    catch (error)
    {
        console.log(error);
        
        cards_status_P.textContent = error.message
        cards_status_P.className = "error"
        refresh_textcontent.textContent = "Reessayer"
    }
    refresh_cards.disabled = false
}


async function LoadHistory(symbol='xau', range='') {
    const chart_element = document.getElementById('history-chart') 
    chart_element.replaceChildren()

    history_status_p.textContent = "Loading..."
    history_status_p.className = "loading"
    try {
        const points = await GetMetalHistory(symbol, range)
        const prices = []
        points.forEach(function(point) {
            prices.push(point.ClosePrice)
        })
        
        const PointsCoordinates = CalculateChartCoordinates(prices)
        
        renderLineChart(chart_element, PointsCoordinates.pointsCorrdinates)
        history_status_p.textContent = ""
        history_status_p.className = "loading"
    
    } catch (error) {
        history_status_p.textContent = "Une erreur est survenue de notre côté."
        history_status_p.className = "error"
    }
}



export {loadMetalCrads, LoadHistory , renderPage }


//products
import { LoadProductsCards } from "./render-products.js";
import { getProducts } from "../services/catalogue-service.js";
import { state } from "../state.js";
import { applyFilters } from "./render-filters.js";

const loading_state = document.getElementById('loading-state')
const network_failed = document.getElementById('network-failed')
const empty_search = document.getElementById('empty-search')
const catalogue_empty = document.getElementById('catalogue-empty')
const other_errors = document.getElementById('other-errors')
function hideAllMessages()
{
    loading_state.classList.add('hidden')
    network_failed.classList.add('hidden')
    empty_search.classList.add('hidden')
    catalogue_empty.classList.add('hidden')
    other_errors.classList.add('hidden')
    
} 
export function LoadProducts(products = state.products, filters = state.filters)
{   
    hideAllMessages()
    const FiltredProducts = applyFilters(products, filters)
    LoadProductsCards(FiltredProducts)
    
    return !(FiltredProducts.length == 0)
}
export async function renderProductsPage()
{
    loading_state.classList.remove('hidden')
    try {
        const products = await getProducts()
        getFavoritesProductsData()
        if (products.length == 0) {
            loading_state.classList.add('hidden')
            catalogue_empty.classList.remove('hidden')
            return
        }
        loading_state.classList.add('hidden')
        LoadProductsToState(products)
        
        if (!LoadProducts(products)) {
            
            empty_search.classList.remove('hidden')
        }
    } catch (error) {
        console.log(error);
        if (error.type == 'network')
        {
            loading_state.classList.add('hidden')
            network_failed.classList.remove('hidden')
        }
        else {
            loading_state.classList.add('hidden')
            other_errors.classList.remove('hidden')
        }
    }

}