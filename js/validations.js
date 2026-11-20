 
export function isTitleValid(name, minLength=2, maxLength=40)
{
    const regex = /[^\p{L}\p{M} '-’]/u;
    const cp_nom= name.trim()
    if (regex.test(cp_nom) || cp_nom.length > maxLength || cp_nom.length < minLength) {
        return false
    }
    else
    {
        return true;
    }
}

export function isDescriptionValid(description, minLength=10,)
{
    const regex = /[^\p{L}\p{M}0-9 '-’]/u;
    const cp_desc= description.trim().replaceAll(/ +/g, ' ')
    console.log(cp_desc);
    
    if (regex.test(cp_desc) || cp_desc.length < minLength) {
        return false
    }
    else
    {
        return true;
    }
}

export function isPriceValid(price_str)
{
    const price = Number.parseFloat(price_str)
    if (Number.isNaN(price) || price < 0) {
        return false
    }
    return true
}