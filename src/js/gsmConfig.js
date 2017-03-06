angular.module('gsm.config', ['ngScrollbars'])
        .config(function ($routeProvider, $stateProvider, $urlRouterProvider, ScrollBarsProvider, $compileProvider, PageConfig, $httpProvider, Constants) {
        	 //$httpProvider.defaults.useXDomain = true;
        	  //  delete $httpProvider.defaults.headers.common['X-Requested-With'];
//        	$httpProvider.defaults.useXDomain = true; 
        	//delete $httpProvider.defaults.headers.common['X-Requested-With']; 
        	//$httpProvider.defaults.headers.common['Access-Control-Allow-‌​Headers'] = '*'; 
        	//$httpProvider.defaults.headers.common['Access-Control-Allow-‌​Origin'] = '*';
        	//$httpProvider.defaults.headers.common['Access-Control-Allow-‌​Methods'] = '*';
        	
        	$httpProvider.interceptors.push("GsmInterceptor");
        	 $compileProvider.debugInfoEnabled(false);
        	$stateProvider
        		.state(PageConfig.DASHBOARD, {
        			url: '/dashboard',
        			templateUrl: 'src/component/dashboard/dashboard.html',
        			controller: 'DashboardCtrl'
    			})
                  
    			.state(PageConfig.LOGIN, {
    				url: '/login',
    				templateUrl: 'src/component/login/login.html',
	                controller: 'LoginCtrl'
	            })
	            
	            .state(PageConfig.SETTING_DB, {
    				url: '/settingdb',
    				templateUrl: 'src/component/settingdb/settingdb.html',
	                controller: 'SettingdbCtrl'
	            })
	            
	            .state(PageConfig.SETTING, {
    				url: '/setting',
    				templateUrl: 'src/component/setting/setting.html',
	                controller: 'SettingCtrl'
	            })
	            
	            .state(PageConfig.SITE_LIST, {
    				url: '/sitelist',
    				templateUrl: 'src/component/sitelist/sitelist.html',
	                controller: 'SiteListCtrl'
	            })
	            
	            .state(PageConfig.RACK_ELEVATION, {
    				url: '/rackelevation',
    				templateUrl: 'src/component/rackElevation/rackelEvation.html',
	                controller: 'RackElevationCtrl'
	            })
	            
	             .state(PageConfig.REPORT, {
    				url: '/report',
    				templateUrl: 'src/component/report/report.html',
	                controller: 'ReportCtrl'
	            })
	            
	            
	            
        	var _token = window.localStorage.getItem(Constants.accessToken);
        	if(_token == undefined || _token == null){
        		$urlRouterProvider.otherwise('/login');
        	}else{
        		$urlRouterProvider.otherwise('/dashboard');
        	}
        	
        	
        	ScrollBarsProvider.defaults = {
        		    scrollButtons: {
        		      scrollAmount: 'auto', // scroll amount when button pressed
        		      enable: true //  scrolling buttons by default
        		    },
        		    setWidth: '100%',
        		    scrollInertia: 400,
        		    axis: 'y' // enable 2 axis scrollbars by default,
        	};
           
})
        
        
        