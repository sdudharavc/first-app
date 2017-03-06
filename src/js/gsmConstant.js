var gsmconstants = angular.module('gsm.constants', []);

gsmconstants.constant('Constants', {
	accessToken : "token",
	DELAY: 1000,
	SERICES_URL : "http://192.168.1.122/norlinx-gsmdashboard-backend/",
	UPDATE_INTERVAL_LIVE_FOR_HISTORY : 60000,
	UPDATE_INTERVAL_LIVE : 10000,	
	APP_VERSION : 'Dashboard Version : 44(alpha)',
	RELEASE_VERSION : 'ver 3.6',
	NORLINX_ABOUT: 'NORLINX Inc. is North Carolina based one of the fastest growing product development and consulting company in the domain of IT Infrastructure Management and '
		+'Data Center Solutions. NORLINX offers extensive value and functionality for Data centers across the globe. Norlinx emphasizes on innovating the best solutions that are '
		+'not only efficient, but reliable as well. We ensure the continuity of our clients mission critical data center operations while reducing their TCO (Total cost of ownership). '
		+'Norlinx\'s portfolio covers a broad array of DCIM solutions with a complete range of services. NORLINX Global Site Management (GSM™) protects your IT power supply chain  '
		+'from PDU to IT hardware. Tracking resources in a complete intelligent management solution with real-time results, as well as historical knowledge, GSM™ allows you to see '
		+'where you are, how you got there, and design where you\'re going next.',
	NORLINX_SPECIALITY : 'DCIM, Data Center Power Management, Data Center Planning, Data Center Risk Mitigation, Change Management and Decision Making',
	TIME_FORMAT: "TimeFormat",
	THEME : "currenttheme",
	BLACK_WHITE : "css/theme/blackWhite.css",
	DARK_BLUE : "css/theme/darkBlue.css",
	CYAN : "css/theme/cyan.css",
	
	
	// local storage items
	
	
	
	
});
   

gsmconstants.constant('PageConfig', {
	DASHBOARD: 'dashboard',
	LOGIN: 'login',
	SETTING_DB: 'settingdb',
	SETTING: 'setting',
	SITE_LIST: 'sitelist',
	RACK_ELEVATION: 'rackElevation',
	REPORT: 'report'
});
   

gsmconstants.constant('Messages', {
	ENTER_USERNAME_AND_PASSWORD  :"Please enter a valid username and  password",
	SELECTDASHBOARD_FIRST : "Select dashboard from list to continue!",
	SUCCESSFULLY_ADDED_WIDGET : "Widget added!",
	CLEARED_DASHBOARD_WIDGET : "Dashboard cleared!",
	EMPTY_DASHBOARD : "Dashboard does not have any widgets!",
	EMPTY_DASHBOARD_NAME : "Enter name of Dashboard to continue!",
	SELECTDASHBOARD_FIRST : "Select dashboard from to continue!",
	SAVE_ALL_SETTING : "Dashboard widget settings saved!",
	COPY_WIDGET : "Widget copied!",
	COPY_WIDGET_CONFIRMATION : "Create another copy of this widget? ",
	DELETE_WIDGET: "Widget deleted!",
	DELETE_WIDGET_CONFIRMATION : "Delete this widget from this dashboard with its settings? ",
	NOTE_SAVED_SUCCESSFULLY : "Note saved successfully!",
	
	CLEAR_DASHBOARD_CONFIRMATION : "This will remove all dashboard widgets with its settings and positions. Are you sure you want to continue removing all widgets from this dashboard?",
	DASHBOARD_CREATED_SUCCESSFULLY : "New dashboard created!",
	DASHBOARD_DELETED_SUCCESSFULLY : "Dashboard deleted successfully!",
	DELETE_DASHBOARD_CONFIRMATION : "This will remove current dashboard with its settings. Are you sure you want to continue deleting this dashboard?",
    CHANGEGRAPH : 'Chart type changed!',
    DASHBOARD_UPDATED_SUCCESSFULLY : "Dashboard updated successfully!",
	DASHBOARD_NOT_SELECTED : "Select dashboard from list to continue!",
	FIELD_LIMIT_REACHED : "Field limits reached for current widget!",
	NOT_AUTHORIZED_MESSAGE : "Login to continue!",
	WAIT_FOR_NEXT_VERSION: "This Feature will be added in next version!",
	POSITION_WIDGET_CHANGED_SETTING : "Save positions of each widgets in this dashboard?",
	DELETE_DATABASE : "Are you sure you want to delete GSM data connection? This will not remove dashboard created for this data connection though you must create new connection to access it again.",
	SET_DATABASE : "Set this GSM data connection to default? ",
	
	/*Added by Sachin Dudhara 16-Feb-2017 */ 
	LOCK_DASHBOARD : "Dashboard Locked successfully",
	UNLOCK_DASHBOARD : "Dashboard Unlocked successfully",
	REFRESH_DASHBOARD : "Data Refreshed successfully",
		
	PLEASE_FILL_MANDATORY_FIELDS : "Fill mandatory fields to continue!",
	PLEASE_FILL_TITLE_FIELD : "Widget title cannot be blank. Fill title to continue!",
	PLEASE_FILL_SUB_TITLE_FIELD : "Widget subtitle cannot be blank. Fill subtitle to continue!",
	PLEASE_FILL_UPDATE_INTERVAL_FIELD : "Fill ‘Update Interval’ settings of widget to continue!",
	PLEASE_FILL_FORMULA_FIELD : "Select GSM Formula to continue!",
	PLEASE_FILL_INPUTS_FOR_TIME_FIELD : "Minimum ‘Update Interval’ is 10 sec, fill it to continue!",
	PLEASE_FILL_DATACENTER_FIELD : "Select datacenter to continue!",
	PLEASE_FILL_FLOOR_FIELD : "Select floor to continue!",
	PLEASE_FILL_CABINET_FIELD : "Select cabinet to continue!",
	PLEASE_FILL_SENSOR_FIELD : "Select environmental sensor to continue! ",
	PLEASE_FILL_THRESHOLD_TYPE_FIELD : "Select Threshold type to continue!",
	PLEASE_FILL_FEED_FIELD : "Select Power Feed to continue!",
	PLEASE_FILL_PHASE_FIELD : "Select Phase to continue!",
	PLEASE_FILL_METRIC_FIELD : "Select display metric to continue!",
	PLEASE_FILL_Item_FIELD: "Select Node list to continue!",
	PLEASE_FILL_DATE_RANGE_FIELD : "Select Date to continue!",
	PLEASE_FILL_DATA_TYPE_FIELD : "Select Value type to continue!",
	PLEASE_FILL_SUB_DATA_TYPE_FIELD : "Select Criteria of value type to continue!",
	PLEASE_FILL_SENSOR_TYPE_FIELD : "Select Sensor type to continue!",
	PLEASE_FILL_TEMPERATURE_TYPE_FIELD : "Select Temperature type to continue!",
	PLEASE_FILL_HEIGHT_FIELDS : "Fill height to continue!",
	PLEASE_FILL_WIDTH_FIELDS : "Fill width to continue!",
	PLEASE_FILL_MINSIZEX_FIELDS : "Fill min width to continue!",
	PLEASE_FILL_MINSIZEY_FIELDS : "Fill min height to continue!",

	PLEASE_FILL_DASHBOARD_INTERVAL_FIELD : "Fill ‘Dashboard Interval’ settings of widget to continue!",
	PLEASE_FILL_DASHBOARD_TIME_FIELD : "‘Dashboard Interval’ should be greater than 20 'seconds'!",
	PLEASE_FILL_ALERT_INTERVAL_FIELD : "Fill ‘Alert Interval’ settings of widget to continue!",
	PLEASE_FILL_TIME_FORMAT_FIELD : "Choose 'Time Format'!",
	PLEASE_FILL_ALERT_TIME_FIELD : "‘Alert Interval’ should be greater than 20 'seconds'!",
	PLEASE_ADD_ITEM_TO_PREVIEW_REPORT : "Add fields in drop Table to preview report"
	
});