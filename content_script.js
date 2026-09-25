document.addEventListener('click', function (event) {

    if (!event.target.matches('.frequency')) return;

    event.preventDefault();
    const qrg = Number(event.target.innerText.replace(/[^\d]/g, '')) * 100;
    if (!Number.isFinite(qrg) || qrg <= 0) return;

    const row = event.target.closest('tr');
    const modeEl = row && row.querySelector('.mode.hidden');
    const bandEl = row && row.querySelector('.band.hidden');
    if (!modeEl || !bandEl) return;

    console.log("Frequency: ", qrg, " (", bandEl.innerText, "m), Mode: ", modeEl.innerText);
    chrome.runtime.sendMessage({"message": "setVfo", "qrg": qrg, "mode": modeEl.innerText, "band": bandEl.innerText});

}, false);
