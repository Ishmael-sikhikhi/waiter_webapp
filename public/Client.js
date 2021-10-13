document.addEventListener('DOMContentLoaded', function () {
    let errorMessageElem = document.querySelector('.error');
    let aveErrorMessageElem = document.querySelector('.errorAvailable');
    let infoElem = document.querySelector('.info')
    
    if (infoElem.innerHTML !== '' || errorMessageElem.innerHTML !== '' || aveErrorMessageElem.innerHTML !== '') {
        setTimeout(() => {
            infoElem.innerHTML = '';
            errorMessageElem.innerHTML = ''; 
            aveErrorMessageElem.innerHTML = '';
            
        }, 3000);
    }
});