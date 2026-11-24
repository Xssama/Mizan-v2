import { filterByTitle, filterByCategory, filterByStatus } from "../filters/filter.js";
import { sortByTitle, sortByDate, sortByPrice } from "../filters/sort.js";



function sortBySelectedValue(products, value)
{
    let sortedProducts = []
    if (value === 'date-desc') {
        sortedProducts = sortByDate(products, 'desc')
    }
    else if (value === 'date-desc') {
        sortedProducts = sortByDate(products, 'desc')
    }else if (value === 'date-asc') {
        sortedProducts = sortByDate(products)
    }else if (value === 'titre-desc') {
        sortedProducts = sortByTitle(products, 'desc')
    }else if (value === 'titre-asc') {
        sortedProducts = sortByTitle(products)
    }else if (value === 'price-desc') {
        sortedProducts = sortByPrice(products, 'desc')
    }else if (value === 'price-asc') {
        sortedProducts = sortByPrice(products)
    }
    else
    {
        sortedProducts = products
    }
    return sortedProducts
}
export function applyFilters(products_arr, filters)
{
    let FiltredProducts = [...(products_arr)]
    
    if (filters.searchInput !== '') {
        FiltredProducts = filterByTitle(FiltredProducts, filters.searchInput)        
    }
    if (filters.filterByStatus_value != 'none') {
        FiltredProducts = filterByStatus(FiltredProducts,filters.filterByStatus_value)        
    }
    if (filters.filterByCategory_value != 'none') {
        FiltredProducts = filterByCategory(FiltredProducts,filters.filterByCategory_value)        
    }
    if (filters.sortBy != 'none') {
        FiltredProducts = sortBySelectedValue(FiltredProducts ,filters.sortBy)
    }    
    return FiltredProducts
}