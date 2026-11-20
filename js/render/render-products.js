import {isTitleValid, isDescriptionValid, isPriceValid} from '../validations.js'
import { addProductToStorage, updateProductInStorage } from '../services/catalogue-service.js'
import { updateProductInState, addProductToState } from '../storage.js'
import { state } from '../state.js'

const product_template = document.getElementById('product-template')

const products_list = document.getElementById('products-liste')

const product_price_error = document.getElementById('product-price-error')
const product_title_error = document.getElementById('product-title-error')
const product_description_error = document.getElementById('product-description-error')
const add_product_error = document.getElementById('add-product-error')

const product_title = document.getElementById('product-title')
const product_description = document.getElementById('product-description')
const product_price = document.getElementById('product-price')
const product_category = document.getElementById('product-category')
const product_status = document.getElementById('product-status')

export function createProductsCard(product)
{
    const productCard = product_template.content.cloneNode(true)
    const product__status_el = productCard.querySelector('.product-status')
    productCard.querySelector('.product-id').value = product.id
    productCard.querySelector('.product-title').textContent = product.title
    productCard.querySelector('.product-description').textContent = product.description
    productCard.querySelector('.product-price').textContent = product.price
    productCard.querySelector('.product-category-name').textContent = product.category
    product__status_el.textContent = product.status

    if (product.status === "disponible") {
        product__status_el.classList.add('available-product')
        product__status_el.classList.remove('sold-product')
    }
    else
    {
        product__status_el.classList.add('sold-product')
        product__status_el.classList.remove('available-product')
    }
    return productCard
}

export function LoadProductsCards(products = state.products)
{
    products_list.replaceChildren()
    products.forEach(function(product) {
        const product_card = createProductsCard(product)
        products_list.appendChild(product_card)
    })
}
export function initDialg()
{
    product_title.value = ''
    product_description.value = ''
    product_price.value = '0'
    product_category.value = 'bijoux'
    product_status.value = 'disponible'

    product_title_error.classList.add('hidden')
    product_title_error.textContent = ''
    product_description_error.classList.add('hidden')
    product_description_error.textContent = ''
    product_price_error.classList.add('hidden')
    product_price_error.textContent = ''
    add_product_error.classList.add('hidden')
    add_product_error.textContent = ''
}
function validateTitle()
{
    const title = product_title.value
    if (!isTitleValid(title)) {
        product_title_error.classList.remove('hidden')
        product_title_error.textContent = 'Veuillez entrer un titre entre 3 et 80 caractères.'
        return false
    }
    else
    {
        product_title_error.classList.add('hidden')
        product_title_error.textContent = ''
        return true
    }
}
function validateDescription()
{
    const description = product_description.value
    if (!isDescriptionValid(description)) {
        product_description_error.classList.remove('hidden')
        product_description_error.textContent = 'Veuillez entrer un description valide du moins de 10 caractères.'
        return false
    }
    else
    {
        product_description_error.classList.add('hidden')
        product_description_error.textContent = ''
        return true
    }
}
function validatePrice()
{
    const price = product_price.value
    if (!isPriceValid(price)) {
        product_price_error.classList.remove('hidden')
        product_price_error.textContent = 'Veuillez entrer un prix valide.'
        return false
    }
    else
    {
        product_price_error.classList.add('hidden')
        product_price_error.textContent = ''
        return true
    }
}
function validateProduct()
{
    if (!validateTitle() || !validateDescription() || !validatePrice()) {
        add_product_error.classList.remove('hidden')
        add_product_error.textContent = 'Veuillez entrer des donneé valide!.'
    }
    else
    {
        add_product_error.classList.add('hidden')
        add_product_error.textContent = ''

        const product = {
            title: product_title.value,
            description: product_description.value,
            price: 14500,
            category: product_category.value,
            status: product_status.value,
            createdAt: new Date().toISOString
        }
        return product
    }
    return null
}
export async function addProduct()
{
    const product = validateProduct()
    if (product == null) {
        return false
    }
    try {
        const response = await addProductToStorage(product)
        
        addProductToState(product)
        return true
    } catch (error) {
        if (error.type == "network") {
            add_product_error.textContent = 'Une erreur de connexion est survenue. Merci de réessayer.'
            add_product_error.classList.remove('hidden')
        }
        else {
            add_product_error.textContent = 'Une erreur est survenue de notre part. Merci de réessayer.'
            add_product_error.classList.remove('hidden')
        }
        return false
    }
}

product_title.addEventListener('focusout', validateTitle)
product_description.addEventListener('focusout', validateDescription)
product_price.addEventListener('focusout', validatePrice)