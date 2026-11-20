import { addProduct, initDialg } from "./render/render-products.js";
import { LoadProductsCards } from "./render/render-products.js";
import { LoadProducts } from "./render/render.js";
const add_product_dialog = document.getElementById('add-product-dialog')
const product_form = document.getElementById('product-form')
const save_product_btn = document.getElementById('save-product-btn')
const cancel_product_dialog = document.getElementById('cancel-product-dialog')
const close_product_dialog = document.getElementById('close-product-dialog')
const add_product_buttons = document.querySelectorAll('.add-product')

LoadProducts()

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

product_form.addEventListener('submit', async function(event){
    event.preventDefault()
    const isProductAdded = addProduct()
    if (isProductAdded) {
        //add_product_dialog.close()
        //LoadProducts()
    }
})