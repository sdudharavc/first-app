angular.module('gsm', ['gsm.controller', 'gsm.constants', 'gsm.config', 'gsm.services', 'gsm.interceptor', 'gsm.factory', 'gsm.filters', 'gsm.directives'])
.run(function($rootScope, Constants, $state, Messages, Notification, $window, PageConfig){
    
	
	$rootScope.$on('SERVER_ERROR:SERVER_DOWN', function (event, rejection) {
		Notification.error({message: rejection.message, delay: 2000});
	  });
	$rootScope.$state = $state;
	$rootScope.$on("500", function (event, message) {
		$rootScope.logout();
		Notification.error({message: message, delay: 2000});
	  });
	
	
	$rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
		  if (window.localStorage.getItem(Constants.accessToken)==null)  {
		      if (next.name == PageConfig.DASHBOARD || next.name == PageConfig.SETTING || next.name == PageConfig.SITE_LIST || next.name == PageConfig.RACK_ELEVATION || 
		    		  next.name == PageConfig.REPORT) {
		    	  event.preventDefault();
		    	 	Notification.error({message: Messages.NOT_AUTHORIZED_MESSAGE, delay: 2000});
			        $state.go('login');
		      }
		  }
	});
	
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
		  if (!current) {
			 // event.preventDefault();
		  }
		});
	
		if(window.localStorage.getItem(Constants.THEME)!=null && window.localStorage.getItem(Constants.THEME) == 'cyan'){
  	  		$rootScope.theme = Constants.CYAN;
	    } else if(window.localStorage.getItem(Constants.THEME)!=null && window.localStorage.getItem(Constants.THEME) == 'darkBlue'){
	    	$rootScope.theme = Constants.DARK_BLUE;
	    }else {
	    	$rootScope.theme = Constants.BLACK_WHITE;
	    }
		/*window.onbeforeunload = function() {
	        return "Dude, are you sure you want to refresh? Think of the kittens!";
		}*/
});
