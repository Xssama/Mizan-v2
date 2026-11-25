import { addProduct, initDialg } from "./render/render-products.js";
import { renderProductsPage, LoadProducts } from "./render/render.js";
import { state } from "./state.js";
import { getFilters, setFilters, isProductFavorite, changeProductFavoriteStatus } from "./storage.js";


const add_product_dialog = document.getElementById('add-product-dialog')
const product_form = document.getElementById('product-form')
const cancel_product_dialog = document.getElementById('cancel-product-dialog')
const close_product_dialog = document.getElementById('close-product-dialog')
const add_product_buttons = document.querySelectorAll('.add-product')

renderProductsPage()

add_product_buttons.forEach(function(btn){
    btn.addEventListener('click', () => 
    {
        initDialg()
        add_product_dialog.showModal()
    })
})

close_product_dialog.addEventListener('click', () => 
{
    add_product_dialog.close()
})
cancel_product_dialog.addEventListener('click', ()=> {
    add_product_dialog.close()
})

product_form.addEventListener('submit', async function(event) {
    event.preventDefault()
    const isProductAdded = await addProduct((product_form.getAttribute('data-action') === 'update-product'))
    if (isProductAdded) {
        
        Array.from(product_form.elements).forEach(function(element)
    {   
        element.setAttribute('disabled', true)
    })
    cancel_product_dialog.removeAttribute('disabled')
    cancel_product_dialog.textContent = 'Close'
        LoadProducts()
    }
})

const products_liste = document.getElementById('products-liste')


function handleProductsListeEvents(event)
{
    const button = event.target.closest("[data-action='edit-product']") ||
        event.target.closest('[data-action="delete-product"]') ||
        event.target.closest('[data-action="favorite-product"]')
    
    if (!button) {
        return
    }
    const selected_product_id = button.closest('article').getAttribute('data-product-id')        
    if (button.getAttribute('data-action') === 'edit-product') {
        initDialg(selected_product_id)
        product_form.setAttribute('data-action', 'update-product')
        add_product_dialog.showModal()
    }
    else if (button.getAttribute('data-action') == 'favorite-product') {
        const icon = button.querySelector('i')
        if (changeProductFavoriteStatus(selected_product_id).action == 'add') {
            icon.classList.add('fa-solid')
            icon.classList.remove('fa-regular')
            button.classList.add('text-yellow-500')
        }
        else
        {
            icon.classList.remove('fa-solid')
            icon.classList.add('fa-regular')
            button.classList.remove('text-yellow-500')
        }
        
    }
}

products_liste.addEventListener('click', handleProductsListeEvents)
//filters
const search_by_title = document.getElementById('search-by-title')
const filter_by_status = document.getElementById('filter-by-status')
const filter_by_category = document.getElementById('filter-by-category')
const sort_products = document.getElementById('sort-products')
const empty_search = document.getElementById('empty-search')
const reset_filters_btn = document.querySelectorAll('.reset-filtres')

function loadFilters()
{
    getFilters()

    search_by_title.value = state.filters.searchInput
    filter_by_status.value = state.filters.filterByStatus_value
    filter_by_category.value = state.filters.filterByCategory_value
    sort_products.value = state.filters.sortBy

}
loadFilters()
reset_filters_btn.forEach(function(btn){
    btn.addEventListener('click', function(){
        search_by_title.value = ''
        search_by_title.dispatchEvent(new Event('input', {
            bubbles: true
        }))
        filter_by_status.value = 'none'
        filter_by_status.dispatchEvent(new Event('change', {
            bubbles: true
        }))
        filter_by_category.value = 'none'
        filter_by_category.dispatchEvent(new Event('change', {
            bubbles: true
        }))
        sort_products.value = 'none'
        sort_products.dispatchEvent(new Event('change', {
            bubbles: true
        }))


    })
})

search_by_title.addEventListener('input', function(){
    state.filters.searchInput = search_by_title.value.trim()
    setFilters()
    if (!LoadProducts()) {
        empty_search.classList.remove('hidden')
    }
    else
    {
        empty_search.classList.add('hidden')
    }
})

filter_by_category.addEventListener('change', function(){
    state.filters.filterByCategory_value = filter_by_category.value.trim()
    setFilters()
    if (!LoadProducts()) {
        empty_search.classList.remove('hidden')
    }
    else
    {
        empty_search.classList.add('hidden')
    }
})
filter_by_status.addEventListener('change', function(){
    state.filters.filterByStatus_value = filter_by_status.value.trim()
    setFilters() 
    if (!LoadProducts()) {
        empty_search.classList.remove('hidden')
    }
    else
    {
        empty_search.classList.add('hidden')
    }
})
sort_products.addEventListener('change', function(){
    state.filters.sortBy = sort_products.value.trim()
    setFilters()
    if (!LoadProducts()) {
        empty_search.classList.remove('hidden')
    }
    else
    {
        empty_search.classList.add('hidden')
    }
})

