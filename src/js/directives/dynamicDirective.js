angular.module('dynamic', [])
.directive('dynamic', dynamic)
function dynamic($compile) {

    var actionController = function ($scope, $rootScope, _, GsmServices, UtilsFactory, $location, ChartFactory, $timeout, $modal) {
        var template = '';
        switch ($scope.action.jsfunctionname) {
            case 'chart_spider':
                template = "src/template/chart/spiderChart.html";
                break;
            case 'chart_floor_spider':
                template = "src/template/chart/spiderChart.html";
                break;
            case 'getAlertsData':
                template = "src/template/chart/alertsData.html";
                break;
            case 'chart_map':
                template = "src/template/chart/googlemapsChart.html";
                break;
            case 'getFloor':
                template = "src/template/chart/floorImage.html";
                break;
            case 'getRackElevationData':
                template = "src/template/chart/rackElevationSlot.html";
                break;
            case 'chart_digital':
                template = "src/template/chart/digitalWidget.html";
                break;
            case 'chart_cabinet':
                template = "src/template/chart/Cabinet.html";
                break;
            case 'chart_notes':
                template = "src/template/chart/stickyNotesWidget.html";
                break;
            case 'chart_label':
                template = "src/template/chart/label.html";
                break;
            case 'sensor_gauge':
            case 'walt_thresold':
            case 'pue_live':
            case 'gauge_getwithoutpuehistory':
                template = "src/template/chart/allGauages.html";
                break;
            case 'line_sensor':
            case 'line_thresold':
            case 'line_getwithoutpuehistory':
            case 'pue_line_chart':
            case 'area_sensor':
            case 'area_thresold':
            case 'area_getwithoutpuehistory':
            case 'pue_area_chart':
            case 'bar_sensor':
            case 'bar_thresold':
            case 'bar_getwithoutpuehistory':
            case 'pue_bar_chart':
                template = "src/template/chart/lineAreaBarChart.html";
                break;
        }
		
        $scope.getActionTemplateUrl = template;
    }

    var directive = {
        restrict: 'E',
        template: '<ng-include src="getActionTemplateUrl"/>',
        controller: actionController,
        scope: {
            action: '=action',
            dashboard: '=dashboard'
        }
    };
    return directive;
}