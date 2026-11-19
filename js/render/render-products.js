const product_template = document.getElementById('product-template')
const products_list = document.getElementById('products-liste')

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

export function LoadProductsCards(products)
{
    products_list.replaceChildren()
    products.forEach(function(product) {
        const product_card = createProductsCard(product)
        products_list.appendChild(product_card)
    })
}