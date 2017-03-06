angular.module('alertdatadetail',[])
    .controller('AlertDataDetailsCtrl', function ($scope, $rootScope, GsmServices, UtilsFactory) {

        console.log(UtilsFactory.getAlertsData());
        var input = {'getAlertType': UtilsFactory.getAlertsData()}
        GsmServices.get_alerts_data(input).success(function(response) {
            console.log("test",response.data);
            $scope.alertsDataListing = response.data;
        });
    })