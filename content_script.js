document.addEventListener('click', function (event) {

    if (!event.target.matches('.frequency')) return;

    event.preventDefault();
    let qrg = event.target.innerText.replace(/[\s|,]/g, '') * 100;
    chrome.runtime.sendMessage({"message": "setVfo", "qrg": qrg});

}, false);
