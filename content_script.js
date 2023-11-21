document.addEventListener('click', function (event) {

    if (!event.target.matches('.frequency')) return;

    event.preventDefault();
    let qrg = event.target.innerText.replace(/[\s|,]/g, '') * 100;
    let row = event.target.closest('tr');
    let mode = row.querySelector('.mode.hidden').innerText;
    let band = row.querySelector('.band.hidden').innerText;

    // Now you have both the frequency (qrg) and the mode values
    console.log("Frequency: ", qrg, " (", band, "m), Mode: ", mode);
    chrome.runtime.sendMessage({"message": "setVfo", "qrg": qrg, "mode": mode, "band": band});

}, false);
