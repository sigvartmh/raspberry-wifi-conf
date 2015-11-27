#import logger
import xml.etree.ElementTree as ET

tree = ET.parse('log_config.xml')
config = tree.getroot()
for settings in config.findall('settings'):
	if settings.get('name') == 'XTmodule':
		XTtimer = int(settings.find('logtime').text)
	if settings.get('name') == 'PIcamera':
		CAMtimer = int(settings.find('logtime').text)

#xtlogger(XTtimer, CAMtimer) something like this