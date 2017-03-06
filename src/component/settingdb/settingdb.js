angular.module('settingdb',[])

.controller('SettingdbCtrl',function($scope, $state, GsmServices, Notification, Constants, Messages, spinnerService) {
	
	spinnerService._unregisterAll();
	GsmServices.getdbsetting().success(function (response) {
    	if(response.responseCode == 200){
    		var _token = window.localStorage.getItem(Constants.accessToken);
        	if(_token == undefined || _token == null){
        		$state.go('login');
        	}else{
        		$state.go('dashboard');
        	}
    	}
    }).error(function(err){
    	Notification.error({message: err.message, delay: 3000});
    });
	
	
	$scope.saveSetting = function(data, form){
		if(!form.$invalid){
			spinnerService.show('html5spinnerSettingDb');
			//added by Ritesh -'ipaddress':data.ipaddress,
	    		   var input = {'host':data.host,'db':data.dbname,'username':data.username,'password':data.password};
	                GsmServices.setdbsetting(input).success(function (response) {
	                	if(response.responseCode == 200){
	                			spinnerService.hide('html5spinnerSettingDb');
		                		//Notification.success({message: response.responseMessage, delay: 3000});
		                		$state.go('login');
	                	}
	                	else {
	                		spinnerService.hide('html5spinnerSettingDb');
	                		if(response.responseMessage=="Db Version not match"){
	                			if(response.responseObject.forconnectdbversion!="" && response.responseObject.currentdbversion !=""){
	                				Notification.error({message: response.responseMessage +" 'Connecting :"+response.responseObject.forconnectdbversion +" with Current : "+ response.responseObject.currentdbversion + "'", delay: 3000});
	                			}
	                			else if(response.responseObject.forconnectdbversion==""){
	                				Notification.error({message: response.responseMessage +" 'Current : "+ response.responseObject.currentdbversion + "'", delay: 3000});
	                			}
	                			else{
	                				Notification.error({message: response.responseMessage +" 'Connecting :"+response.responseObject.forconnectdbversion+ "'", delay: 3000});
	                			}
	                		}
	                		else{
	                			Notification.error({message: response.responseMessage, delay: 3000});
	                		}
	                	}
	                }).error(function(err){
	                	spinnerService.hide('html5spinnerSettingDb');
	                	Notification.error({message: err.message, delay: 3000});
	                });
	    	}else{
	    		Notification.error({message: Messages.PLEASE_FILL_MANDATORY_FIELDS, delay: 3000});
	    	}
	    }
    
   
});