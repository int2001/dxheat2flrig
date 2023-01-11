var url='http://127.0.0.1:12345/';
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === "setVfo" ) {
		setVfo(request.qrg);
		if ((request.qrg)<7999000) { setMode('LSB'); } else { setMode('USB'); }
/* 
			$.xmlrpc({
				url: 'http://localhost:12345/',
				methodName: 'rig.get_vfoA',
				// params: ['bar', 1, 4.6, true, [1, 2, 3], {name: 'value'}],
				success: function(response, status, jqXHR) { alert(response); },
				error: function(jqXHR, status, error) { alert(error); }
			})
*/
		}
	}
);

function setVfo(qrg) {
   var x;
	x=fetch(
	url,
	{method: 'POST',
	mode: 'no-cors',
	body: '<?xml version="1.0"?><methodCall><methodName>main.set_frequency</methodName><params><param><value><double>'+qrg+'</double></value></param></params></methodCall>'
	});
}
function setMode(mode) {
   var x;
	x=fetch(
	url,
	{method: 'POST',
	mode: 'no-cors',
	body: '<?xml version="1.0"?><methodCall><methodName>rig.set_modeA</methodName><params><param><value>'+mode+'</value></param></params></methodCall>'
	});
}
