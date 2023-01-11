let options = {
    'flrig-uri': 'http://127.0.0.1:12345/'
}

loadOptions();

function loadOptions() {
    chrome.storage.sync.get({
        options: options,
    }, (items) => {
        options = items.options;
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.message) {
            case 'setVfo':
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
