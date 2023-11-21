let options = {
    'flrig-uri': 'http://127.0.0.1:12345/',
    'digi-mode': 'DATA-U',
    'cw-mode': 'CW-L'
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
                if ((request.mode) == 'CW') {
                    setMode(options['cw-mode'])
                } else if ((request.mode) == 'DIGITAL') {
                    setMode(options['digi-mode'])
                } else {
                    setMode(request.mode)
                }
                
                setVfo(request.qrg);
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
