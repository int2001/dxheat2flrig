$(document).on("click", ".frequency", function(){
    var qrg = $(this).html();
    qrg=qrg.replace(/[\s|\,]/g,'');
    qrg=qrg*100;
    chrome.runtime.sendMessage({"message": "setVfo", "qrg": qrg});
});
