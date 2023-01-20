document.addEventListener('click', function (event) {

	if (event.target.matches('.frequency')) {
		let call=event.target.parentNode.cells[3].textContent;
		event.preventDefault();
		let qrg = event.target.innerText.replace(/[\s|,]/g, '') * 100;
		chrome.runtime.sendMessage({"message": "setVfo", "qrg": qrg, "call":call});
	} else if (event.target.matches('.header_frequency')) { 
		chrome.runtime.sendMessage({"message": "setVfo", "call": ""});
	} else if (event.target.innerText.match(/.*kHz.*/g)) {
		let qrg=event.target.innerText.replace(/(\d+).*$/g,"$1")*1000;
		chrome.runtime.sendMessage({"message": "setVfo", "qrg": qrg});
	} else {
		return;
	}
}, false);

chrome.runtime.onMessage.addListener(function(req, sender, senderres){
	if(req.name == "cloudlog"){
		if (window.location.href.startsWith(req.url)) {
			document.getElementById('callsign').value=req.call;
			document.getElementById('callsign').dispatchEvent(new Event ('blur'));
		}
	} else if (req.name == "dxhigh") {
		   if (window.location.href.startsWith("https://dxheat.com")) {
			   var parser = new DOMParser();
			   var xmlDoc = parser.parseFromString(req.qrgxml, "text/xml");
			   var qrgplain = xmlDoc.getElementsByTagName("value")[0].textContent;
			   // todo: Highlight Row
		   }
}
});

