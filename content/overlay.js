var links = new Array();

var HelloWorld = {
	
	onMenuItemCommand : function() 
	{
		var doc = document.getElementById("content").contentDocument;
		
	/* Passes the current tab's content (i.e. the current youtube page in this case) to the next .XUL window to be opened. */
		
		window.openDialog("chrome://DAYTube/content/DAYTube.xul", "VideosToDownload",
                            "chrome,centerscreen,all,menubar=no,width=800,height=600", doc);
	},
	     
	get_urls : function()
	{
	
        window.addEventListener('keypress', Videos.onKeyPressed, true);
	/* The browse box is initialized with the default directory for donwloading stuff. */	
	
		var DownloadManager = Components.classes["@mozilla.org/download-manager;1"].getService(Components.interfaces.nsIDownloadManager);
		document.getElementById("browse").value = DownloadManager.defaultDownloadsDirectory.path;
		
	/* Here all the unique video links present on the current youtube page are fetched into a list called VideoList. */
	
		var doc = window.arguments[0];		// Variable doc has access to the youtube page which is passed to this window by the previous window
							// using onMenuItemCommand function.
		
		links = doc.getElementsByTagName("a"); 
		var vids = new Array();
				
		for (i=0,k=0;i<links.length-1;i++)
		{
			var seen = 0;
			if ( (links[i].href != "") && (links[i].href != null) )							// so that only
			{													// unique video 
				if ( links[i].href.indexOf("youtube.com/watch?v=") != -1 )					// links appear
				{												// in the selection											
					
					if ( typeof(links[i].getElementsByTagName("img")[0]) != "undefined" )
					{	
                        
						if ( links[i].getElementsByTagName("img")[0].title != "" && links[i].getElementsByTagName("img")[0].title != null )
						{								
							var href = links[i].href;
						
							// Extraction of video_id from /watch?v='video_id'
							var index_of_watch = href.indexOf("/watch?v=");
							var index_of_amp = href.indexOf("&");
				
							if (index_of_amp != -1)
								var vid = href.substring(index_of_watch + 9,index_of_amp);
							else 
								var vid = href.slice(index_of_watch + 9);
							
							for (j=0;j<k;j++)
							{
								if (vid == vids[j])
								{
									seen = 1;
									break;
								}	
							}
							
							if (!seen)
							{
                                				VideoList[k] = new Video_Info();
								VideoList[k].title = links[i].getElementsByTagName("img")[0].title;
								VideoList[k].vid = vid;
								vids[k++] = vid;
							}
						}
					}
					
					
				}	
				
			}			
		}
		
				
				
		if (k == 0)
		{
			alert("No downloadable videos available here!");	// If no dowloadable video link is found.
			window.close();
		}
		HelloWorld.list_urls();						// Function call for listing the video links in the selection window.
	},
       
       
 	list_urls : function()
  	{
	/* Dynamically adding the downloading videos with check boxes to the list in the selection window. */	
        
		for(i=0;i<VideoList.length;i++)
		{
			var template = document.createElement("listitem");		
			template.setAttribute("label",VideoList[i].title);
			template.setAttribute("id",i + "");
			template.setAttribute("type","checkbox");
			var Listbox = document.getElementById("ListBox");
			Listbox.appendChild(template);
			
			document.getElementById("status").label = VideoList.length + " videos are listed.";
		}
	},
	
	Search_video : function()	// According to the search string given by user, the required videos are selected.
	{      
		
        	var searchvid = document.getElementById("search");
		
            
        	if(searchvid.value == null || searchvid.value == "")
        	{
            		for(i=0; i<VideoList.length; i++)
            		{
                		document.getElementById(i + "").checked = false;
            		}
        	}
        	else
        	{
            		var search_string = new RegExp(searchvid.value,"i");	// "i" is used for case-insensitive search.
            		for(i=0; i<VideoList.length; i++)
            		{    
                		document.getElementById(i + "").checked = search_string.test(VideoList[i].title);
                    
                        }
        	}
	},
	
	Browse_File : function()
	{
	/* Allows a user to set the destination folder for the videos. */
		
		var nsIFilePicker = Components.interfaces.nsIFilePicker;
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
		fp.init(window, "Browse", 2);
		fp.show();
		
		text=document.getElementById("browse");
		text.value=fp.file.path;
	},	
};


	
 
