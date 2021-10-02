document.addEventListener('DOMContentLoaded', function () {
    let errorMessageElem = document.querySelector('.error');
    let infoElem = document.querySelector('.info')
    if (infoElem.innerHTML !== '' || errorMessageElem.innerHTML !== '') {
        setTimeout(() => {
            infoElem.innerHTML = '';
            errorMessageElem.innerHTML = '';   
            
        }, 3000);
    }
});