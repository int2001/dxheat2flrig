let options = {
    'flrig-uri': 'http://127.0.0.1:12345/',
    'cloudlog-uri': 'https://[cloudlog_url]'
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

const registeredScript = await chrome.contentScripts.register(details);

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.message) {
            case 'setVfo':
                if (request.call) { setCall(sender,request.call); }
                setVfo(request.qrg);
                if ((request.qrg) < 7999000) {
                    setMode('LSB');
                } else {
                    setMode('USB');
                }
                break;
            case 'loadOptions':
                loadOptions()
                break;
        }
    }
);

function setCall(sender,call) {
	chrome.windows.getAll({populate:true}, (windows) => {
		windows.forEach((window) => {
			window.tabs.forEach((tab) => {
				if (tab.url==options['cloudlog-uri']) {
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

function setMode(mode) {
    fetch(
        options['flrig-uri'],
        {
            method: 'POST',
            mode: 'no-cors',
            body: '<?xml version="1.0"?><methodCall><methodName>rig.set_modeA</methodName><params><param><value>' + mode + '</value></param></params></methodCall>'
        });
}
