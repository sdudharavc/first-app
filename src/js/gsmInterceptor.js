angular.module('gsm.interceptor', [])
.factory("GsmInterceptor", function ($q, $rootScope, Constants) {
  return {
	  response: function (response) {
		  if (response.data.responseCode == 500) {
			  $rootScope.$broadcast(response.data.responseCode, response.data.responseMessage);
          }
          return response || $q.when(response);
      },
      responseError: function (rejection) {
          if (rejection.status == 0 || rejection.status == -1) {
              rejection.message = 'Server is temporarily down or you are not connected to the internet. Please try again in a while or check your connection.';
              $rootScope.$broadcast('SERVER_ERROR:SERVER_DOWN', rejection.message);
          }
          if (rejection.data!==null && rejection.data!=undefined &&  rejection.data.status_code == 500) {
        	  if(rejection.data.message == 'Session has expired, please login to continue.' || rejection.data.message=="Database [sqlsrv] not configured."){
        		  $rootScope.$broadcast(rejection.data.status_code, rejection.data.message);
        	  }
        	  /*else{
        		  $rootScope.$broadcast(rejection.data.status_code, rejection.data);
        	  }*/
        	  
        	 /* else if(){
        		  $rootScope.$broadcast(rejection.data.status_code, rejection.data);
        	  }*/
        	 
          }
         // if(rejection.data !== undefined){
//        	  if(rejection.data.errorCode === 4005){
//        		  rejection.data = {stauts: rejection.status, descr: rejection.data.errorMessage};
//                  $rootScope.$broadcast('APP_VERSION:INVALID_VERSION', rejection.data);
//        	  }
        	//  console.log(rejection);
        //  }
//          console.log(rejection);
          return $q.reject(rejection);
      },
      request: function(config) {
    	var token = window.localStorage.getItem(Constants.accessToken);
    	if(config.url.search("doLogin") == -1 && token != null){
//    		config.headers[Constants.accessToken] = token;
	    }
//    	if (config.url.search("getCommPlan") == -1) {
//    		config.timeout = 60000;
//    	} else {
//    		config.timeout = 600000;
//    	}
    	//config.timeout = 30000;
    	config.headers.Authorization = 'Bearer ' + token;
//    	config.headers['Authorization'] = 'Bearer ' + token;
//    	config.timeout = 600000;
    	return config;
    }
  }
});
