function saveOptions() {
    let options = {};
    document.querySelectorAll('input').forEach(input => {
        if (!input.classList.contains('option')) {
            return;
        }
        options[input.id] = input.value;
    });

    chrome.storage.sync.set({
        options: options
    }, () => {
        let statusElement = document.getElementById('status');
        statusElement.classList.remove('d-none');
        setTimeout(function () {
            statusElement.classList.add('d-none');
        }, 750);


        chrome.runtime.sendMessage({"message": "loadOptions"});


    })

}

function restoreOptions() {
    let defaultOptions = {
        'flrig-uri': 'http://127.0.0.1:12345/'
    }

    chrome.storage.sync.get({
        options: defaultOptions,
    }, (items) => {
        for (const [key, value] of Object.entries(items.options)) {
            document.getElementById(key).value = value;
        }
    });

}


document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save-btn').addEventListener('click', saveOptions);
