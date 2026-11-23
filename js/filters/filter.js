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


















