angular.module('login',[])

.controller('LoginCtrl',function($scope, $timeout,$state,GsmServices, Notification, Constants, $rootScope, UtilsFactory, PageConfig, Messages) {
	
	$scope.appVersion = Constants.APP_VERSION;
	GsmServices.getdbsetting().success(function (response) {
    	if(response.responseCode == 404){
    		$state.go('settingdb');
    	}
    }).error(function(err){
    	Notification.error({message: err.message, delay: 3000});
    });
	
	/* Ishver Nayak 17-02-2017 */ 
	if (window.localStorage.getItem(Constants.accessToken) && window.localStorage.getItem('username')) {
        $state.go(PageConfig.DASHBOARD);
    } else {
        if (window.localStorage.getItem(Constants.accessToken)) {
            window.localStorage.removeItem(Constants.accessToken)
        }
        if (window.localStorage.getItem('username')) {
            window.localStorage.removeItem('username')
        }
        if (window.localStorage.getItem('selectedDashboard')) {
            window.localStorage.removeItem('selectedDashboard');
        }
        if (window.localStorage.getItem(Constants.THEME)) {
            window.localStorage.removeItem(Constants.THEME);
        }
        if (UtilsFactory.getWidgetPositionData().length != 0) {
            UtilsFactory.setWidgetPositionData("");
        }
    }
	/* Ishver Nayak end */
	
	
	
	/*if(window.localStorage.getItem(Constants.accessToken)){
		window.localStorage.removeItem(Constants.accessToken)
	}
	if(window.localStorage.getItem('username')){
		window.localStorage.removeItem('username')
	}
	if(window.localStorage.getItem('selectedDashboard')){
    	window.localStorage.removeItem('selectedDashboard');
    }
	if(window.localStorage.getItem(Constants.THEME)){
    	window.localStorage.removeItem(Constants.THEME);
    }
	if(UtilsFactory.getWidgetPositionData().length!=0){
		UtilsFactory.setWidgetPositionData("");
	}
*/	
	$scope.login=function(data){
	    	if(data!==undefined && data.username!==undefined && data.password!==undefined ){
	    		   var input = {'username':data.username,'password':data.password};
	                GsmServices.login(input).success(function (response) {
	                	if(response.responseCode == 200){
	                		window.localStorage.setItem('username',data.username);
	                		if(response.responseObject[0].value!=undefined && response.responseObject[0].value!=null){
	                			window.localStorage.setItem(Constants.THEME,response.responseObject[0].value.theme);
	                		}
	                		$rootScope.username = data.username;
	                		if(window.localStorage.getItem(Constants.THEME)!=null && window.localStorage.getItem(Constants.THEME) == 'cyan'){
	              	    	  	$rootScope.theme = Constants.CYAN;
		              	    } else if(window.localStorage.getItem(Constants.THEME)!=null && window.localStorage.getItem(Constants.THEME) == 'darkBlue'){
		              	    	$rootScope.theme = Constants.DARK_BLUE;
		              	    }else {
		              	    	$rootScope.theme = Constants.BLACK_WHITE;
		              	    }
	                		GsmServices.getdefaultdb().success(function (response) {
	                			var getdefaultdb =false;
	                			for(i in response.responseObject.data){
	                				if(response.responseObject.data[i].defaultdb==0){
	                					getdefaultdb = true;
	                				}
	                			}
	                			if(getdefaultdb){
	                				GsmServices.getdefaultsite().success(function (response) {
	                					var getdefaultsite =false;
	                					for(i in response.responseObject.data){
	    	                				if(response.responseObject.data[i].defaultsite==0 || response.responseObject.data[i].defaultsite == null){
	    	                					getdefaultsite = true;
	    	                				}
	    	                			}
	    	                			if(getdefaultsite){$state.go(PageConfig.SITE_LIST);}
	    	                			else{$state.go(PageConfig.DASHBOARD);}
	    	                		}).error(function(err){
	    	                	    	Notification.error({message: err.message, delay: 3000});
	    	                	    });
	                			}
	                			else{
			                		$state.go(PageConfig.SETTING);
	                			}
	                		}).error(function(err){
	                	    	Notification.error({message: err.message, delay: 3000});
	                	    });
	                		window.localStorage.setItem(Constants.accessToken,response.responseObject[0].token);
	                		Notification.success({message: response.responseMessage, delay: 3000});
	                	}
	                	else {
	                		Notification.error({message: response.responseMessage, delay: 3000});
	                	}
	                }).error(function(err){
	                	Notification.error({message: err.message, delay: 3000});
	                });
	    	}else{
	    		Notification.error({message: Messages.ENTER_USERNAME_AND_PASSWORD, delay: 3000});
	    	}
	    }
	
	
	 $scope.getChangeLog = function(){
		 var inputparam = {'version' : Constants.RELEASE_VERSION}
		GsmServices.getChangeLog(inputparam).success(function (response) {
			$scope.changeLog = "***New Development(s)***" + "\n\n";
			if(response.responseCode == 200){
			for(var i=0;i<response.responseObject.data.length;i++){
        			$scope.changeLog +=  response.responseObject.data[i];
				}
			}
			else{
    				$scope.changeLog = "Could not fetch Change Log!";
			}
		});
	}
});