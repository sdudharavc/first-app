angular.module('sitelist',[])
.controller('SiteListCtrl', function ($scope, $rootScope, GsmServices, $state, UtilsFactory, Notification, Constants, Messages, PageConfig) {

	if(window.localStorage.getItem('selectedDashboard')){
    	window.localStorage.removeItem('selectedDashboard');
    }
	GsmServices.getsitelist().success(function(response){
		if(response.responseCode == 200){
			$scope.siteList = response.responseObject.data;
		}
		else {
    		Notification.error({message: response.responseMessage, delay: 3000});
    	}
	}).error(function(err){
		Notification.error({message: err.message, delay: 3000});
	});
	
	if(UtilsFactory.getWidgetPositionData()){
		UtilsFactory.setWidgetPositionData([]);
	}
	
	 $scope.siteListSelect = function(site){
			var inputParam = {'site_id' : site.SiteKey};
	        GsmServices.defaultsite(inputParam).success(function (response) {
	        	if(response.responseCode == 200){
	        		$scope.siteList = response.responseObject.data;
	        		$state.go(PageConfig.DASHBOARD);
	        		Notification.success({message: response.responseMessage, delay: 3000});
	        	}
	        	else {
	        		Notification.error({message: response.responseMessage, delay: 3000});
	        	}
	        }).error(function(err){
	        	Notification.error({message: err.message, delay: 3000});
	        });
    }
	 
})