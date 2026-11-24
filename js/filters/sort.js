
export function sortByDate(products, order='asc')
{
    const sortedProducts = products.sort((productA, productB) => (order === 'asc') ?
        new Date(productA.createdAt)  - new Date(productB.createdAt) 
        : new Date(productB.createdAt)  - new Date(productA.createdAt))
    return sortedProducts
}

export function sortByTitle(products, order='asc')
{
    const sortedproducts = products.sort((productA, productB) => 
    (order === 'asc') ? 
    productA.title.localeCompare(productB.title) 
    : productB.title.localeCompare(productA.title)
    )
    return sortedproducts
}

export function sortByPrice(products, order='asc')
{
    const sortedProducts = products.sort((productA, productB) => 
        order === 'asc' ? productA.price - productB.price : productB.price - productA.price
    )
    return sortedProducts
}
