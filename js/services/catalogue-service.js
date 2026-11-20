import {request, JSON_SERVER_URL} from './api.js'

export function getProducts()
{
    const products = request(`${JSON_SERVER_URL}/products`)
    return products
}

export function getProductById(id) {
    return request(`${JSON_SERVER_URL}/products/${id}`)
}

export function addProductToStorage(product_obj) {
    
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(product_obj)
    }

    return request(`${JSON_SERVER_URL}/products`, options)
}

export function replaceProduct(product_obj, id)
{
    const options = {
        method: 'PUT',
        headers: 
        {
            'content-type': 'application/json'
        },
        body: JSON.stringify(product_obj)
    }
    return  request(`${JSON_SERVER_URL}/products/${id}`, options)
}

export function updateProductInStorage(data_to_update_obj, id)
{
    const options = 
    {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data_to_update_obj)
    }
    return request(`${JSON_SERVER_URL}/products/${id}`, options)
}

export function deleteProductFromStorage(id)
{
    const options = {
        method: 'DELETE'
    }
    return request(`${JSON_SERVER_URL}/products/${id}`, options)
}

