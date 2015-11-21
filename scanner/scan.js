var exec    = require("child_process").exec;
var awk = require('awk');
var fs = require('fs');

    var fields_to_extract = {
"ssid": /SSID:\"(.*)\"/,
"quality": /Quality=(\d+)\/100/,
"signal_strength": /.*Signal level=(\d+)\/100/,
"encrypted": /Encryption key:(on)/,
"open": /Encryption key:(off)/,
};
    exec("iw dev wlan0 scan | gawk -f wifi_scan.awk", function(error, stdout, stderr) {
        // Handle errors from running "iwlist scan"
        if (error) {
            //return callback(error, output)
            console.log(error,output);
        }

        /* The output structure looks like this:
        [
            {
                interface: "wlan0",
                scan_results: [
                    { ssid: "WifiB", address: "...", "signal_strength": 57 },
                    { ssid: "WifiA", address: "...", "signal_strength": 35 }
                ]
            },
            ...
        ] */
        var output          = [],
            interface_entry = null,
            current_cell    = null;

        function append_previous_cell() {
            if (current_cell != null && interface_entry != null) {
                if (typeof(current_cell["ssid"]) != "undefined" &&
                    current_cell["ssid"] != "" ) {
                    interface_entry["scan_results"].push(current_cell);
                	console.log(current_cell);
                }
                current_cell = null;
            }
        }

        function append_previous_interface() {
            append_previous_cell();
            if (interface_entry != null) {
                output.push(interface_entry);
                interface_entry = null;
            }
        }

        // Parse the result, build return object
        lines = stdout.split("\n");
        for(var t in lines){
        	//console.log(lines[t]);
        	try{
        		if(lines[t] !==  ''){
        			var test = JSON.parse(lines[t]);
        			console.log(test);
        			output.push(test);
        		}
        	}
        	catch(e){
        		console.log(e);
        	}
        	//console.log(test);
        	//console.log(test);
        }

       

        // Add the last item we tracked
        append_previous_interface();

        console.log(output);
        //console.log(output[0].interface);
        //console.log(output[0].scan_results);
    });