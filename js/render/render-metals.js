
const LastUpdate_P = document.getElementById('last-update-time')
const template = document.getElementById('metals-template')

export function renderLastUpdatelabel(date)
{
    if (Number.isNaN(date.getTime())) {
        return;
    }
    LastUpdate_P.textContent = date.toLocaleString()
}
export function loadCard(Card_Obj)
{
    const card = template.content.cloneNode(true)
    const metalName = Card_Obj.name
    
    const isGold = (metalName).trim().toLowerCase() == 'gold'
    card.querySelector('#metal-name').textContent = Card_Obj.name
    
    card.querySelector('#metal-color').classList.add(isGold ? 'gold-circle' : 'silver-circle')
    card.querySelector('#metal-price').textContent = Card_Obj.price
    card.querySelector('#metal-currency').textContent = Card_Obj.currency
    card.querySelector('#metal-unit').textContent = Card_Obj.unit
    card.querySelector('#metal-change').textContent = Card_Obj.change + ` ${Card_Obj.currency}`
    card.querySelector('#metal-change-rate').textContent = Card_Obj.changerate + ' %'

    if (Card_Obj.changerate < 0) {
        card.querySelector('#metal-change-rate').classList.add('text-red-500')
        card.querySelector('.arrow-down').classList.remove('hidden')
        card.querySelector('.arrow-up').classList.add('hidden')
    }
    else if (Card_Obj.changerate >= 0) {
        card.querySelector('#metal-change-rate').classList.add('text-green-500')
        card.querySelector('.arrow-up').classList.remove('hidden')
        card.querySelector('.arrow-down').classList.add('hidden')
   
    }

    return card

}