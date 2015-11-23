/^BSS / {
    MAC = $2
    wifi[MAC]["ENC"] = "OPEN"
}
/SSID/ {
    wifi[MAC]["SSID"] = $2
}
/primary channel/ {
    wifi[MAC]["channel"] = $NF
}
/signal/ {
    wifi[MAC]["signal"] = $2
}
/WPA/ {
    wifi[MAC]["ENC"] = "WPA"
}
/RSN/ {
    wifi[MAC]["ENC"] = "WPA"
}


# Insert new block here

END {

    for (w in wifi) {
        printf "{\"ssid\":\"%s\", \"mac\": \"%s\", \"channel\":\"%s\", \"encryption\":\"%s\", \"signal\":%s}\n",wifi[w]["SSID"],w,wifi[w]["channel"], wifi[w]["ENC"], wifi[w]["signal"]
    }
}