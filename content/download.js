var Downloads =  {

	download : function (filename, source_url)
	{
		var persist = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"]
	                            .createInstance(Components.interfaces.nsIWebBrowserPersist);
	    
		var nsIWBP  = Components.interfaces.nsIWebBrowserPersist;
		persist.persistFlags =  nsIWBP.PERSIST_FLAGS_NO_CONVERSION | 
                			// nsIWBP.PERSIST_FLAGS_REPLACE_EXISTING_FILES | 
                			nsIWBP.PERSIST_FLAGS_CLEANUP_ON_FAILURE; 
                        
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath(Videos_Destination); // download destination
	    
		if(!file.exists() || !file.isDirectory() ) 		{
			file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);
        	}
        
		file.appendRelativePath(filename);

		var obj_URI = Components.classes["@mozilla.org/network/io-service;1"]
	        		.getService(Components.interfaces.nsIIOService)
	                        .newURI(source_url, null, null);
	                            
		var target_URI = Components.classes["@mozilla.org/network/io-service;1"]
	        		.getService(Components.interfaces.nsIIOService)
	                        .newFileURI(file);
		
		var dlMgr   = Components.classes["@mozilla.org/download-manager;1"]
	        		.getService(Components.interfaces.nsIDownloadManager);
	                            
		var aDownload = dlMgr.addDownload(0, obj_URI, target_URI, null, null, null, null, persist);
	
		persist.progressListener = aDownload;
	
		persist.saveURI(obj_URI, null, null, null, "", target_URI);
	}
	
};

