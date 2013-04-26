var Video_Info = function()
{
	this.vid = null;
	this.title = null;
	this.token = null;
	this.availableFormats = new Array();
	this.selected = false;
}
	

var xmlreqs = new Array();		// An array whose elements handle the simultaneous multiple XMLHttp requests.
var VideoList = new Array();		// An array of type Video_Info stores all the downloadable videos listed in the selection window with some info.
var Videos_Destination = "";		// Stores the location where the videos are to be downloaded.
var selectedVideos = new Array();	// It is a list of the selected videos.
