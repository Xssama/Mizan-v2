import { state } from "./state.js";
const providedCurenciesInAPP = ['USD', 'MAD', 'EUR']
const storage_key = 'currency'
export function LoadData(Key = storage_key)
{
    const data = localStorage.getItem(Key) || 'MAD'
    if (!providedCurenciesInAPP.includes(data)) {
        data = 'MAD'
    }
    state.mizan_currency = data
    return data    
}

export function SetData(data_obj = state, key = storage_key)
{
    localStorage.setItem(key, data_obj.mizan_currency)
}

export function UpdateSelectedCurrency(selected_currency)
{
    if (!providedCurenciesInAPP.includes(selected_currency)) {
        return {
            success: false,
            error: 'provided currency isn\'t valid!'
        }
    }
    
    state.mizan_currency = selected_currency
    return saveData()
}
export function UpdateGoldPrice(currentPrice)
{
    if (Number.isNaN(currentPrice) || currentPrice < 0) {
        return {
            success: false,
            error: 'provided price isn\'t valid!'
        }
    }
    state.current_prices.Gold = currentPrice
    return {
        success: true,
        error: null,
    }
}
export function UpdateSilverPrice(currentPrice)
{
    if (Number.isNaN(currentPrice) || currentPrice < 0) {
        return {
            success: false,
            error: 'provided price isn\'t valid!'
        }
    }
    state.current_prices.Silver = currentPrice
    return {
        success: true,
        error: null,
    }
}
export function returnMetalPrice(metal)
{
    if (!['xau', 'silver'].includes(metal)) {
        console.log(metal + ', invalide metal!');
        
        return null
    }
    return (metal == 'xau' ? state.current_prices.Gold: state.current_prices.Silver)
}
export function saveData(data=state)
{
    try {
        SetData(data)
        return {
            success: true,
            error: null
        }
    } catch (error) {
        return {success: false,
        error: error.message}
    }
}
//products
export function getProductByIdFromState(productID)
{
    const product = state.products.filter((el) => {
       return el.id === productID
        
    })
    return product[0]
}

export function LoadProductsToState(products)
{
    state.products = []
    products.forEach(function(product){
        state.products.push(product)
    })
}

export function addProductToState(obj)
{   
    state.products.push(obj)
}
export function updateProductInState(product_obj, product_id)
{
    state.products.forEach(function(product){
      if (product.id === product_id) {
        product.title = product_obj.title
        product.description = product_obj.description
        product.price = product_obj.price
        product.category = product_obj.category
        product.status = product_obj.status
      }  
    })
}
//filters
const Filters_key = 'Products_filters'
export function getFilters()
{
    const filters_obj = JSON.parse(localStorage.getItem(Filters_key)) || {
        searchInput: '',
        sortBy: 'none',
        filterByStatus_value: 'none',
        filterByCategory_value: 'none', 
    }
    updateFiltersInState(filters_obj)
}
export function setFilters()
{
    localStorage.setItem(Filters_key, JSON.stringify(state.filters))
}
export function updateFiltersInState(filters_obj)
{
    state.filters.searchInput = filters_obj.searchInput
    state.filters.filterByStatus_value = filters_obj.filterByStatus_value
    state.filters.filterByCategory_value = filters_obj.filterByCategory_value
    state.filters.sortBy = filters_obj.sortBy


}