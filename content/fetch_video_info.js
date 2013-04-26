

/* The array VideoList is a list of videos which are listed in the selection window while the array selectedVideos contains the videos chosen by the user 
   to download. */


var Videos = {

	get_video_info : function ()
	{
		Videos_Destination = document.getElementById("browse").value;		// Reading the value of Destination folder from the Browse's box.
		
		var selCount = 0;
		for (i=0; i<VideoList.length; i++)
		{
			VideoList[i].selected = document.getElementById(i + "").checked;	// Each of the videos listed in the selection window
												// has index as the id. 
			
			if (VideoList[i].selected)
			{
				selectedVideos[selCount++] = VideoList[i];
			}	
		}
		
		for(i=0; i<selectedVideos.length; i++)
		{
            		Videos.xmlreqGET ("http://www.youtube.com/get_video_info?video_id=" + selectedVideos[i].vid, i );
            		
            /* The url of the above form is being used to retrieve the key_value pairs for a particular video. */
            
		}
		
	},
	
	onKeyPressed: function(event)
    	{
            	if(event.keyCode == 13 && event.target.tagName != 'button')
        	{
        		Videos.get_video_info();
        	}
	},
    
	callback: function(index, processedRequestCount)
	{
		var source_url = "http://www.youtube.com/get_video?video_id=" + 
	        		selectedVideos[index].vid + "&t=" + selectedVideos[index].token;
	    	
	    	if (document.getElementById("flv").selected == true)
	    	{
	    		var fmt = "&fmt=5";
	    		var extension = ".flv";
	    	}
	    	
	    	else if (document.getElementById("mp4").selected == true)
		{
			var fmt = "&fmt=18";
	    		var extension = ".mp4";
	    	}
			
		else if (document.getElementById("3gp").selected == true)
		{
			var fmt = "&fmt=17";
	    		var extension = ".3gp";
		}    	
	    	
	    	source_url += fmt;
	    	selectedVideos[index].title = selectedVideos[index].title.replace(/[\|/:?*<>]/g,"-");
		Downloads.download(selectedVideos[index].title + extension, source_url);
        
		if(selectedVideos.length == processedRequestCount)
		{
			var dlMgrUI = Components.classes["@mozilla.org/download-manager-ui;1"]
                                    .getService(Components.interfaces.nsIDownloadManagerUI);
			dlMgrUI.show();
			window.close();
		}
	    
	},
	
	CXMLReq : function (freed) 
	{
		this.freed = freed;
        	this.xmlhttp = false; 
		this.xmlhttp = new XMLHttpRequest(); 
		this.completed = false;
	},

	xmlreqGET : function (url, selected_index) 
	{
		var pos = -1; 
		for (var i=0; i<xmlreqs.length; i++) 
		{
			if (xmlreqs[i].freed == 1) 
			{ 
				pos = i; 
				break; 
			} 
		} 
        
		if (pos == -1) 
		{ 
			pos = xmlreqs.length; 
			xmlreqs[pos] = new Videos.CXMLReq(1); 
		} 
	    
		if (xmlreqs[pos].xmlhttp) 
		{ 
			xmlreqs[pos].freed = 0; 
			xmlreqs[pos].xmlhttp.open("GET", url, true);
			xmlreqs[pos].xmlhttp.onreadystatechange = function() 
			{ 
				if(typeof(Videos.xmlhttpChange) != "undefined")
					Videos.xmlhttpChange(pos, selected_index); 
			}
			xmlreqs[pos].xmlhttp.send(null);  
		} 
	}, 

	xmlhttpChange : function (pos, selected_index) 
	{ 	
		try
        	{
        		if (typeof(xmlreqs[pos]) != 'undefined' && xmlreqs[pos].freed == 0 && xmlreqs[pos].xmlhttp.readyState == 4) 
			{ 
		                if (xmlreqs[pos].xmlhttp.status == 200 || xmlreqs[pos].xmlhttp.status == 304) 
		                {
                    	                var video_info = xmlreqs[pos].xmlhttp.responseText;
                    
					var components = video_info.split("&");
				    	var swf_args   = {};
				    	for(i in components)
				    	{
				        	components[i] = unescape(components[i]).replace(/\+/g, " ").replace(/<[^>]*>/g, ".");
				        	var eqIndex = components[i].indexOf("=");
				        	swf_args[components[i].substring(0, eqIndex)] = components[i].slice(eqIndex+1);
				    	}
				    
				    	if(swf_args["status"] == "fail")
				    	{
				        	alert("\"" + VideoList[selected_index].title + "\"\n" + swf_args["reason"]);
				        	xmlreqs[pos].completed = true;
                        
                        			var processedRequestCount = 0;
                        			for(i=0; i<xmlreqs.length; i++)
                            				if(xmlreqs[i].completed)
                                    				processedRequestCount++;    
                        
                        
                        			Videos.callback(pos, processedRequestCount);
				    	}
				    	else
				    	{
                        			selectedVideos[selected_index].token = swf_args["token"];
                                
                        			var formats = swf_args["fmt_map"];
                        			var fmts_list = formats.split(",");
                        
                        			for (i=0;i<fmts_list.length;i++)
                        			{
                            				selectedVideos[selected_index].availableFormats[i] = fmts_list[i].substring ( 0, fmts_list[i].indexOf("\/") );
                        			}
                        
                        			xmlreqs[pos].completed = true;
                        
                        			var processedRequestCount = 0;
                        			for(i=0; i<xmlreqs.length; i++)
                            				if(xmlreqs[i].completed)
                                    				processedRequestCount++;    
                        
                        
                        			Videos.callback(pos, processedRequestCount);
                    			}
                		} 
                
                		xmlreqs[pos].freed = 1; 
            		}
        	}
        
        	catch(e)
        	{
            		//alert(e + " on line " + e.lineNumber);
        	}
	},
	
	get_key_value : function (str,query)
	{
		var string = unescape(str);
		string = string.replace(/%2C/g,",");  // Replacing %2C with , which didn't get decoded by unescape function
		string = string.replace(/&/g,"\"&");  
		string = string + "\"";               // Last character of the string is "
		var list = string.split("&");
		for(l=0;l<list.length;l++)
		{
			var sublist = list[l].split("=");
			sublist[0] = sublist[0] + "=\""; 
			
		/* for keys of the type 'fmt_url_map=34|http=://v2.lscache8.c.youtube.com/videoplayback?ip=0.0.0.0' */
		
			if(sublist.length > 2)
			{
				for (j=1;j<sublist.length-1;j++)
				{
					sublist[j] = sublist[j] + "=";
				}
			}	
			list[l] = "";
			for(k=0;k<sublist.length;k++)
				list[l] += sublist[k];          // Reappending to have the form as key="value"
			
			eval(list[l]);                          
		}
		
		if (query == "token") 
			return (token);
		else if (query == "fmt_map")
			return (fmt_map);					// Returns the value of variable token which has value of t
	},
	
};





	
