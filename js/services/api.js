export const API_URL = "https://xaus.com/api/v1";
export const JSON_SERVER_URL = "http://localhost:3001"


export async function request(url, options = {}) {
    const controller = new AbortController()
    const timeout = setTimeout(function(){
        controller.abort()
    }, 8000)
    try {
        const response = await fetch(url,{ 
            ...options,signal: controller.signal})
        if (!response.ok)
        {
           const error = new Error('Something went wrong!')
           error.type = "http"
           error.status = response.status
           throw  error
        }

        const reponseText = await response.text()
        
        if (reponseText === "") {
            return null
        }
        const data_json = JSON.parse(reponseText)
        
        return data_json        
    } catch (error) {
        if (error.name == 'TypeError') {
            error.type = 'network'
            error.status = null
        }
        else if (error.name == 'SyntaxError') {
            error.type = 'parse'
            error.status = null
        }
        else if (error.name == 'AbortError') {
            error.type = 'timeout'
            error.status = null
        }
        throw error
    } finally
    {
        clearTimeout(timeout)
    }
}





//test the server-api endpoints


