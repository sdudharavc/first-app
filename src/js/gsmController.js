angular.module('gsm.controller',['gridster', 
								'ui.bootstrap', 
								'ngRoute',
								'ngSanitize',
								'ngFitText',
								'ui.router', 
								'underscore', 
								'ui-notification', 
							    'angular-confirm', 
							    'ngScrollbars',
							    'angularSpinners',
							    'angular-owl-carousel',
							    'ngTable',
							    'ui.toggle',
							    'ui.select',
							    'ui.grid', 
							    'ui.grid.pagination',
							    'ui.grid.resizeColumns', 
							    'ui.grid.moveColumns',
							    'ui.grid.grouping',
							    'ui.grid.exporter',
							    'ngDraggable',
							    'kendo.directives',
							    'dashboard', 
							    'login',
							    'settingdb',
							    'rackelevation',
							    'sitelist',
							    'setting',
							    'report',
							    'customwidget',
							    'widgetsetting'
							    
])
.controller('RootCtrl', function ($scope, $timeout, $state, PageConfig, $rootScope, $confirm, $modal, Notification, Messages, Constants, GsmServices, $interval) {
    $rootScope.logout = function(){
    	window.localStorage.removeItem(Constants.accessToken);
        window.localStorage.removeItem('username');
    	$state.go(PageConfig.LOGIN);
    }
    
    $scope.gotoProfile = function(){
    	Notification.success({message: Messages.WAIT_FOR_NEXT_VERSION, delay: Constants.DELAY});
    }
    
    $scope.goToDashboard = function(){
    	$state.go(PageConfig.DASHBOARD);
    }
    
    $scope.goToSetting = function(){
    	$state.go(PageConfig.SETTING);
    }
    
    $scope.goToReport = function(){
    	$state.go(PageConfig.REPORT);
    }
    
    $scope.goToRackElevation = function(){
    	$state.go(PageConfig.RACK_ELEVATION);
    }
    
    if(window.localStorage.getItem('username')){
    	$rootScope.username = window.localStorage.getItem('username');
    }
    
   $scope.aboutPopup = function (data) {
	   var dbversion = "";
	   $interval.cancel($scope.dashboardInterval);
	   GsmServices.getdbversion().success(function (response) {
		   dbversion = response.responseObject.data;
	   });
           	var template= "";
           	template='src/template/aboutPopup.html';
            $timeout(function () {
			     $scope.opts = {
			         backdrop: true,
			         backdropClick: true,
			         dialogFade: false,
			         keyboard: true,
			         templateUrl: template, 
			         controller: aboutPopupCtrl,
			         resolve: {
			         } // empty storage
			     };
         
		         $scope.opts.resolve.item = function () {
		             return dbversion;
		         }
		         var modalInstance = $modal.open($scope.opts);
		         modalInstance.result.then(function () {
		         }, function () {
		         });
            },500);
     };

     var aboutPopupCtrl = function ($scope, $modalInstance, $modal, item, $window) {
    	 $scope.appVersion = Constants.APP_VERSION;
    	 $scope.norlinxSpeciality = Constants.NORLINX_SPECIALITY;
    	 $scope.norlinxAbout = Constants.NORLINX_ABOUT;
    	 $scope.dbversion = "DB version : " +item;
         $scope.ok = function () {
             $modalInstance.close();
             $rootScope.userTimeIntervalForOtherController();
         };
         
         $scope.cancel = function () {
             $modalInstance.dismiss('cancel');
             $rootScope.userTimeIntervalForOtherController();
         };
         
         $scope.getChangeLog = function(){
    		 var inputparam = {'version' : Constants.RELEASE_VERSION}
    		GsmServices.getChangeLog(inputparam).success(function (response) {
    			$scope.changeLog = "***New Development(s)***" + "\n\n";
    			if(response.responseCode == 200){
    			for(var i=0;i<response.responseObject.data.length;i++)
    				{
            			$scope.changeLog +=  response.responseObject.data[i];
    				}
    			}
    			else
    				{
        				$scope.changeLog = "Could not fetch Change Log!";
    				}
    		});
    	}
     }
            
})