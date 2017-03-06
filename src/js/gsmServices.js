angular.module('gsm.services', ['dashboardfunction.services'])
        .service('GsmServices', function ($http, $q, Constants) {
            //var baseUrl = "http://192.168.1.113:81/norlinx-gsmdashboard-backend_V12/";
            var baseUrl = "http://192.168.1.168:88/norlinx-gsmdashboard-backend/";
            //var baseUrl = Constants.SERVICE_URL;

            this.login = function (inputData) {
                return $http.post(baseUrl + 'api/auth/login', inputData);
            }

            this.getdashlist = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getdashlist', {param: inputData});
            };

            this.gethtml = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/gethtml', {param: inputData});
            };

            this.savedetail = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/savedetail', {param: inputData});
            };

            this.create = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/create', {param: inputData});
            };

            this.getDataCenter = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getDataCenter', {param: inputData});
            };

            this.removeWidget = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/removeWidget', {param: inputData});
            };

            this.clearWidget = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/clearWidget', {param: inputData});
            };

            this.savePosition = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/savePosition', {param: inputData});
            };

            this.spiderchart = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/spiderchart', {param: inputData});
            };

            this.getuspace = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getuspace', {param: inputData});
            };

            this.getubyfloor = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getubyfloor', {param: inputData});
            };

            this.areaMultiChartData = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/areaMultiChartData', {param: inputData});
            };

            this.getFloorList = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getFloorList', {param: inputData});
            };

            this.getFloorImage = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getFloorImage', {param: inputData});
            };

            this.save_widget_setting = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/savewidgetsetting', {param: inputData});
            };

            this.get_alerts_data = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/alerts_data', inputData);
            }

            this.getchartnotes = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getchartnotes', {param: inputData});
            }

            this.getchartlabels = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getchartlabels', {param: inputData});
            }

            /****************************For alerts Data Button end here**************************************/
            this.get_rack_elevation_data = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/rack_elevation_data', {param: inputData});
            }
            this.get_search_tra_data = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/search_track_asset_data', inputData);
            }

            this.getPowerReport = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getPowerReport', inputData);
            }
            /****************************For Threshold Data**************************************/
            this.getThresoldData = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getThresoldData', {param: inputData});
            }

            this.getCabinets = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getCabinets', inputData);
            }

            this.getMetrix = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getMetrix', inputData);
            }

            this.getSensorData = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getsensor', inputData);
            }

            this.getSensorList = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getsensorlist', inputData);
            }

            this.getInfoData = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getInfoData', inputData);
            }

            this.getPueLive = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getPueLive', {param: inputData});
            }

            this.deletedashboard = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/deletedashboard', {param: inputData});
            }
            this.changeGraph = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/changeGraph', {param: inputData});
            }
            this.update = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/update', {param: inputData});
            }
            this.getdbsetting = function (inputData) {
                return $http.get(baseUrl + 'api/auth/getdbsetting', {param: inputData});
            }
            this.setdbsetting = function (inputData) {
                return $http.post(baseUrl + 'api/auth/setdbsetting', {param: inputData});
            }

            this.getMapFloorImage = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/mapFloorImage', {param: inputData});
            }

            this.getpowermetricitem = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getpowermetricitem', {param: inputData});
            }

            this.getDatabaselistdb = function (inputData) {
                return $http.get(baseUrl + 'api/setting/listdb', {params: inputData});
            }

            this.setdefaultconn = function (inputData) {
                return $http.post(baseUrl + 'api/setting/setdefaultconn', {param: inputData});
            }

            this.createDatabase = function (inputData) {
                return $http.post(baseUrl + 'api/setting/create', {param: inputData});
            }
            this.deletedb = function (inputData) {
                return $http.put(baseUrl + 'api/setting/delete', {param: inputData});
            }

            this.getsitelist = function (inputData) {
                return $http.post(baseUrl + 'api/setting/getsitelist', {param: inputData});
            }

            this.defaultsite = function (inputData) {
                return $http.post(baseUrl + 'api/setting/defaultsite', {param: inputData});
            }

            this.getsensorbyfloor = function (inputData) {
                return $http.get(baseUrl + 'api/dashboard/getsensorbyfloor', {params: inputData});
            }

            this.getnodebydc = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getnodebydc', {param: inputData});
            }

            this.getnodebyfloor = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getnodebyfloor', {param: inputData});
            }

            this.getnodebycabinet = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getnodebycabinet', {param: inputData});
            }

            this.getHistoryGraphsData = function (inputData, graph) {
                if (graph === "line_thresold" || graph === "area_thresold" || graph === "bar_thresold") {
                    return $http.post(baseUrl + 'api/dashboard/getlinebycabinet', {param: inputData});
                } else if (graph === "line_sensor" || graph === "area_sensor" || graph === "bar_sensor") {
                    return $http.post(baseUrl + 'api/dashboard/getlinebysensor', {param: inputData});
                } else if (graph === "line_getwithoutpuehistory" || graph === "area_getwithoutpuehistory" || graph === "bar_getwithoutpuehistory") {
                    return $http.post(baseUrl + 'api/dashboard/getwithoutpuehistory', {param: inputData});
                } else if (graph === "pue_line_chart" || graph === "pue_area_chart" || graph === "pue_bar_chart") {
                    return $http.post(baseUrl + 'api/dashboard/getPueHistory', {param: inputData});
                }
            }

            this.getdbversion = function (inputData) {
                return $http.get(baseUrl + 'api/setting/getdbversion', {param: inputData});
            }

            this.getwidgetlist = function (inputData) {
                return $http.get(baseUrl + 'api/setting/getwidgetlist', {param: inputData});
            }

            this.widgetedit = function (inputData) {
                return $http.post(baseUrl + 'api/setting/widgetedit', {param: inputData});
            }

            this.getdefaultdb = function (inputData) {
                return $http.get(baseUrl + 'api/setting/getdefaultdb', {param: inputData});
            }

            this.getdefaultsite = function (inputData) {
                return $http.get(baseUrl + 'api/setting/getdefaultsite', {param: inputData});
            }

            this.updateDashboardSetting = function (inputData) {
                return $http.post(baseUrl + 'api/setting/updatedashbordsetting', {param: inputData});
            }

            this.getdashbordsetting = function (inputData) {
                return $http.get(baseUrl + 'api/setting/getdashbordsetting', {param: inputData});
            }

            this.lockdash = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/lockdash', {param: inputData});
            }

            this.searchuser = function (inputData) {
                return $http.get(baseUrl + 'api/dashboard/searchuser', {param: inputData});
            }

            this.listdashpermission = function (inputData) {
                return $http.get(baseUrl + 'api/dashboard/listdashpermission', {param: inputData});
            }

            this.updatedashpermission = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/updatedashpermission', {param: inputData});
            }

            this.dashbordlist = function (inputData) {
                return $http.get(baseUrl + 'api/dashboard/dashbordlist', {param: inputData});
            }

            this.adddashpermission = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/adddashpermission', {param: inputData});
            }

            /****************************For Change log Data****Added by Sachin Dudhara 10-JAN-17**********************************/

            this.getChangeLog = function (inputData) {
                return $http.post(baseUrl + 'api/auth/releasenote', {param: inputData});
            }


            this.exportExcel = function () {
                return $http.get(baseUrl + 'api/report/exportexcel');
            }
            /**************************change for report*********************************/
            this.organizationlist = function (inputData) {
                return $http.get(baseUrl + 'api/report/organizationlist', {param: inputData});
            }


            this.cabinetlist = function (inputData) {
                return $http.post(baseUrl + 'api/report/cabinetlist', {param: inputData});
            }

            this.devicelist = function (inputData) {
                return $http.post(baseUrl + 'api/report/devicelist', {param: inputData});
            }

            this.previewList = function (inputData) {
                return $http.post(baseUrl + 'api/report/previewList', {param: inputData});
            }

            this.racklist = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/racklist', {param: inputData});
            }

            this.getCabinetRackElevation = function (inputData) {
                return $http.post(baseUrl + 'api/dashboard/getCabinetRackElevation', {param: inputData});
            }
        })