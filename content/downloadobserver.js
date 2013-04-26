// ******************************
// DownloadObserver
// ******************************
function sampleDownload_init(){
  //**** Add download observer
  var observerService = Components.classes["@mozilla.org/observer-service;1"]
                                  .getService(Components.interfaces.nsIObserverService);
  observerService.addObserver(sampleDownloadObserver, "dl-start", false);
  observerService.addObserver(sampleDownloadObserver, "dl-done", false);
  observerService.addObserver(sampleDownloadObserver, "dl-cancel", false);
  observerService.addObserver(sampleDownloadObserver, "dl-failed", false);

  window.addEventListener("unload", function() {
    observerService.removeObserver(sampleDownloadObserver, "dl-start");
    observerService.removeObserver(sampleDownloadObserver, "dl-done");
    observerService.removeObserver(sampleDownloadObserver, "dl-cancel");
    observerService.removeObserver(sampleDownloadObserver, "dl-failed");
  }, false);
}
var sampleDownloadObserver = {
  observe: function (subject, topic, state) {
    var oDownload = subject.QueryInterface(Components.interfaces.nsIDownload);
    //**** Get Download file object
    var oFile = null;
    try{
      oFile = oDownload.targetFile;  // New firefox 0.9+
    } catch (e){
      oFile = oDownload.target;      // Old firefox 0.8
    }
    //**** Download Start
    if (topic == "dl-start"){
      alert('Start download to - '+oFile.path); 
    }
    //**** Download Cancel
    if(topic == "dl-cancel"){ 
      alert('Canceled download to - '+oFile.path); 
    }
    //**** Download Failed
    else if(topic == "dl-failed"){ 
      alert('Failed download to - '+oFile.path);
    }
    //**** Download Successs
    else if(topic == "dl-done"){
      alert('Done download to - '+oFile.path);
    }    
  }
}
window.addEventListener("load", sampleDownload_init, false);

