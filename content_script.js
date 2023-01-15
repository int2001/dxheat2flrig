document.addEventListener('click', function (event) {

	if (event.target.matches('.frequency')) {
		let call=event.target.parentNode.cells[3].textContent;
		event.preventDefault();
		let qrg = event.target.innerText.replace(/[\s|,]/g, '') * 100;
		chrome.runtime.sendMessage({"message": "setVfo", "qrg": qrg, "call":call});
	} else if (event.target.innerText.match(/.*kHz.*/g)) {
		let qrg=event.target.innerText.replace(/(\d+).*$/g,"$1")*1000;
		chrome.runtime.sendMessage({"message": "setVfo", "qrg": qrg});
	} else {
		return;
	}
}, false);
