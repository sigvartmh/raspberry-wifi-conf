var exec    = require("child_process").exec;
var path       = require("path");

/*****************************************************************************\
    Return a function which is responsible for using "iwlist scan" to figure
    out the list of visible SSIDs along with their RSSI (and other info)
\*****************************************************************************/
module.exports = function(cmd_options, callback) {
    // Handle case where no options are passed in
    if (typeof(cmd_options) == "function" && typeof(callback) == "undefined") {
        callback    = cmd_options;
        cmd_options = "";
    }

    var fields_to_extract = {
        "ssid":            /ESSID:\"(.*)\"/,
        "quality":         /Quality=(\d+)\/100/,
        "signal_strength": /.*Signal level=(\d+)\/100/,
        "encrypted":       /Encryption key:(on)/,
        "open":            /Encryption key:(off)/,
    };
    var rules = path.join(__dirname, "wifi_scan.awk");
    exec("iw dev wlp12s0 scan ap-force | gawk -f "+rules, function(error, stdout, stderr) {
        // Handle errors from running "iwlist scan"
        console.log("iwscan called");
        if (error) {
            return callback(error, output)
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

        lines = stdout.split("\n");
        for(var t in lines){
            //console.log(lines[t]);
            try{
                if(lines[t] !==  ''){
                    var test = JSON.parse(lines[t]);
                    //console.log(test);
                    output.push(test);
                }
            }
            catch(e){
                console.log(e);
            }
            //console.log(test);
            //console.log(test);
        }
        return callback(null, output);

        // Add the last item we tracked
        append_previous_interface();

        return callback(null, output);
    });

}
