const confirmation_dialog = document.getElementById('confirmation-dialog')

const dialog_title = confirmation_dialog.querySelector('.dialog-title')
const dialog_message = confirmation_dialog.querySelector('.dialog-message')
const dialog_cancel_btn = confirmation_dialog.querySelector('.cancel-btn')
const dialog_confirm_btn = confirmation_dialog.querySelector('.confirmation-btn')

export function showConfirmationDialog(details_obj)
{
    dialog_title.textContent = details_obj.title
    dialog_message.textContent = details_obj.message
    dialog_cancel_btn.textContent = details_obj.cancelText
    dialog_confirm_btn.textContent = details_obj.confirmText

    confirmation_dialog.returnValue = 'cancel'
    const result = new Promise((resolve) => {
        confirmation_dialog.addEventListener('close', (event) => {
            event.preventDefault()
            console.log('hey');
            
            resolve(confirmation_dialog.returnValue === 'confirm')
        }, {once: true})
    })
    confirmation_dialog.showModal()
    return result
}