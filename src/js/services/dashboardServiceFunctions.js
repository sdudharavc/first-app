angular.module('dashboardfunction.services', [])
.service('DashboardFunctionServices', function ($http, $q, Constants, $scope, GsmServices) {
	
	this.checkReadWriteStatus = function(dashboardAdminList){
		var countRead = 0, countWrite = 0, countReadCheck = false, countWriteCheck = false;
		_.filter(dashboardAdminList, function(list, i){
			if(list.AllowReadDashboard==true){countRead = countRead + 1;}
			if(list.AllowWriteDashboard==true){countWrite = countWrite + 1;}
		})
		if(dashboardAdminList.length==countRead){countReadCheck = true;
		}else{countReadCheck = false;}
		if(dashboardAdminList.length==countWrite){countWriteCheck = true;}
		else{countWriteCheck = false;}
		var checkReadWriteArray = {countReadCheck : countReadCheck, countWriteCheck : countWriteCheck}
		return checkReadWriteArray;
    }
})