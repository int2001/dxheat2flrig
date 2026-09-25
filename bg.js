const defaults = {
    'flrig-uri': 'http://127.0.0.1:12345/',
    'digi-mode': 'DATA-U',
    'cw-mode': 'CW-L'
};

const getOptions = () =>
    new Promise(res => chrome.storage.sync.get({ options: defaults }, res));

const DIGI_MODES = new Set(['DIGITAL', 'DATA', 'FT8', 'FT4', 'JS8', 'JT65', 'JT9', 'PSK31', 'MFSK', 'OLIVIA', 'DSTAR', 'FREEDV', 'PACKET', 'RTTY']);

chrome.runtime.onMessage.addListener(async (request) => {
    const options = (await getOptions()).options;
    const mode = (request.mode || '').toUpperCase();
    try {
        if (mode === 'CW') {
            await setMode(options['cw-mode'], options);
        } else if (DIGI_MODES.has(mode)) {
            await setMode(options['digi-mode'], options);
        } else if (mode) {
            await setMode(request.mode, options);
        }
        await setVfo(request.qrg, options);
    } catch (e) {
        console.error('dxheat2flrig:', e);
    }
});

function setVfo(qrg, options) {
    return fetch(
        options['flrig-uri'],
        {
            method: 'POST',
            headers: { 'Content-Type': 'text/xml' },
            body: '<?xml version="1.0"?><methodCall><methodName>main.set_frequency</methodName><params><param><value><double>' + qrg + '</double></value></param></params></methodCall>'
        });
}

function setMode(mode, options) {
    return fetch(
        options['flrig-uri'],
        {
            method: 'POST',
            headers: { 'Content-Type': 'text/xml' },
            body: '<?xml version="1.0"?><methodCall><methodName>rig.set_modeA</methodName><params><param><value>' + mode + '</value></param></params></methodCall>'
        });
}
