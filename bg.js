let options = {
    'flrig-uri': 'http://localhost:12345/',
    'cloudlog-uri': 'https://[cloudlog_url]/index.php/qso?manual=0'
}

loadOptions();

function loadOptions() {
    chrome.storage.sync.get({
        options: options,
    }, (items) => {
        options = items.options;
    });

	let details={"id": "content_script",
	"js": "content_script.js",
	"matches": [options['cloudlog-uri']]};

// const registeredScript = await chrome.contentScripts.register(details);

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.message) {
		case 'setVfo':
		if (request.qrg) {
			setVfo(request.qrg);
			if ((request.qrg) < 7999000) {
				setMode('LSB');
			} else {
				setMode('USB');
			}
		}
		if ((request.call) || (request.call == '')) { 
			setCall(sender,request.call); 
			getVfo().then(respi => { 
				highlightQrg(respi)
			});
		}
		break;
		case 'loadOptions':
			loadOptions()
		break;
	}
}
				    );
function highlightQrg(qrgxml) {
	chrome.windows.getAll({populate:true}, (windows) => {
		windows.forEach((window) => {
			window.tabs.forEach((tab) => {
				if (tab.url.startsWith('https://dxheat.com')) {
					chrome.tabs.sendMessage(tab.id, {"qrgxml": qrgxml, "name":"dxhigh", "url":"https://dxheat.com"});
				}
			});
		});
	});
}

function setCall(sender,call) {
	chrome.windows.getAll({populate:true}, (windows) => {
		windows.forEach((window) => {
			window.tabs.forEach((tab) => {
				if (tab.url.startsWith(options['cloudlog-uri'])) {
					chrome.tabs.sendMessage(tab.id, {"call": call, "name":"cloudlog", "url":options['cloudlog-uri']});
				}
			});
		});
	});
}

function setVfo(qrg) {
    fetch(
        options['flrig-uri'],
        {
            method: 'POST',
            mode: 'no-cors',
            body: '<?xml version="1.0"?><methodCall><methodName>main.set_frequency</methodName><params><param><value><double>' + qrg + '</double></value></param></params></methodCall>'
        });
}

async function getVfo() {
    const response = await fetch(
        options['flrig-uri'],
        {
            method: 'POST',
            // mode: 'no-cors',
			headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: '<?xml version="1.0"?><methodCall><methodName>rig.get_vfo</methodName></methodCall>'
        });
	const data = await response.text();
	return data;
}

function setMode(mode) {
    fetch(
        options['flrig-uri'],
        {
            method: 'POST',
            mode: 'no-cors',
            body: '<?xml version="1.0"?><methodCall><methodName>rig.set_modeA</methodName><params><param><value>' + mode + '</value></param></params></methodCall>'
        });
}
