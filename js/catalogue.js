import { addProduct, initDialg } from "./render/render-products.js";
import { renderProductsPage, LoadProducts } from "./render/render.js";
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
    if (button.getAttribute('data-action') === 'edit-product') {
        const selected_product_id = button.closest('article').getAttribute('data-product-id')        
        initDialg(selected_product_id)
        product_form.setAttribute('data-action', 'update-product')
        add_product_dialog.showModal()
    }
}

products_liste.addEventListener('click', handleProductsListeEvents)