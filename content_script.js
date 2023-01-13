document.addEventListener('click', function (event) {

    if (!event.target.matches('.frequency')) return;

    let call=event.target.parentNode.cells[3].textContent;
    event.preventDefault();
    let qrg = event.target.innerText.replace(/[\s|,]/g, '') * 100;
    chrome.runtime.sendMessage({"message": "setVfo", "qrg": qrg, "call":call});

}, false);

chrome.runtime.onMessage.addListener(function(req, sender, senderres){
        if(req.name == "cloudlog"){
            if(req.url == window.location.href){
		console.log('angekommen '+req.call);
            }
    	}
});
