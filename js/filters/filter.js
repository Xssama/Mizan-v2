export function filterByTitle(products ,input_str)
{
    if (input_str.trim() === '') {
        return
    }
    const filtredProducts = products.filter((product) =>
      
      product.title.toLowerCase().includes(input_str.toLowerCase())
      )
    return filtredProducts
}

export function filterByStatus(products, status)
{
    const filtredProducts = products.filter(product => 
        product.status == status
    )
    return filtredProducts
}
export function filterByCategory(products, category)
{
    const filtredProducts = products.filter(product => 
        product.category == category
    )
    return filtredProducts
}