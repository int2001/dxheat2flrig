document.addEventListener('click', function (event) {
    if (location.hostname === 'fieldspotter.radio') {
        handleFieldspotterClick(event);
    } else {
        handleDxheatClick(event);
    }
}, false);

function handleDxheatClick(event) {
    if (!event.target.matches('.frequency')) return;

    event.preventDefault();
    const qrg = Number(event.target.innerText.replace(/[^\d]/g, '')) * 100;
    if (!Number.isFinite(qrg) || qrg <= 0) return;

    const row = event.target.closest('tr');
    const modeEl = row && row.querySelector('.mode.hidden');
    const bandEl = row && row.querySelector('.band.hidden');
    if (!modeEl || !bandEl) return;

    send(qrg, modeEl.innerText, bandEl.innerText);
}

function handleFieldspotterClick(event) {
    const bandSpot = event.target.closest('.bandColSpot');
    if (bandSpot) {
        event.preventDefault();
        const freqEl = bandSpot.querySelector('.bandColSpotFreq');
        if (!freqEl) return;
        const qrg = Math.round(parseFloat(freqEl.textContent) * 1e6);
        if (!Number.isFinite(qrg) || qrg <= 0) return;
        const modeEl = bandSpot.querySelector('.bandColSpotMode');
        send(qrg, modeEl ? modeEl.textContent.trim() : '');
        return;
    }

    const node = caretNodeAt(event);
    if (!node || !/\d+\.\d{3,4}\s*MHz/.test(node.textContent || '')) return;

    event.preventDefault();
    const scope = node.parentElement && (node.parentElement.closest('.leaflet-popup-content') || node.parentElement.closest('.leaflet-tooltip'));
    const nm = node.textContent.match(/(\d+\.\d{3,4})\s*MHz/);
    const fm = scope && scope.textContent.match(/MHz\s*\((\w+)\)[^\S\n]*([A-Z][A-Z0-9]*)?/);
    const qrg = Math.round(parseFloat(nm[1]) * 1e6);
    if (!Number.isFinite(qrg) || qrg <= 0) return;
    send(qrg, fm ? (fm[2] || '') : '', fm ? fm[1] : '');
}

function caretNodeAt(event) {
    if (document.caretRangeFromPoint) {
        const r = document.caretRangeFromPoint(event.clientX, event.clientY);
        return r && r.startContainer;
    }
    if (document.caretPositionFromPoint) {
        const p = document.caretPositionFromPoint(event.clientX, event.clientY);
        return p && p.offsetNode;
    }
    return null;
}

function send(qrg, mode, band) {
    console.log("Spot: ", qrg, "Hz, band: ", band, ", mode: ", mode);
    chrome.runtime.sendMessage({"message": "setVfo", "qrg": qrg, "mode": mode, "band": band});
}
