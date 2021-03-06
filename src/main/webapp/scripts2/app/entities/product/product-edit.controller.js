'use strict';

/**
 * @ngdoc function
 * @name yoAngularApp.controller:AboutCtrl
 * @description # AboutCtrl Controller of the yoAngularApp
 */
angular.module('talarion2App').controller('ProductEditController',
    function($scope, $state, $stateParams, Product, Category, ParseLinks, growl) {

        $scope.submitted = false;

        $scope.product = {};
        $scope.product.category = {};

        $scope.load = function(id) {
            Product.get({
                id: id
            }, function(result) {
                $scope.product = result;
            });
        };
        $scope.load($stateParams.id);

        $scope.save = function() {

            $scope.submitted = true;

            if ($scope.editForm.$valid) {

                Product.update($scope.product, function() {
                    growl.info("Product successfully edited ", {});
                    $state.go('product');
                });

            }

        };

        $scope.showLookup = function() {

            $('#lookupDialog').modal('show');
        };

        $scope.selectLookup = function(category) {

            $scope.product.category = category;

            $('#lookupDialog').modal('hide');
        };

        $scope.callServer = function callServer(tableState) {

            $scope.isLoading = true;

            var pagination = tableState.pagination;

            var start = pagination.start || 0; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10; // Number of entries showed per page.
            var numberOfPages = pagination.numberOfPages || 1;
            var page = start / number + 1;

            var nameSearchCrit = '';

            if (tableState.search.predicateObject != undefined) {
                nameSearchCrit = tableState.search.predicateObject.name || '';
            }

            Category.query({
                page: page,
                per_page: 10,
                name: nameSearchCrit
            }, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.categoryList = result;
                tableState.pagination.numberOfPages = 1 * headers('X-Total-Pages');
                tableState.pagination.number = 1 * headers('X-Size');
                tableState.pagination.start = tableState.pagination.number * (page - 1);
                $scope.isLoading = false;

                // console.log('tableState.pagination.start: ' + tableState.pagination.start);
                // console.log('tableState.pagination.numberOfPages: ' + tableState.pagination.numberOfPages);
                // console.log('tableState.pagination.number: ' + tableState.pagination.number);

                // $state.go('setting-produk');
            });

        };

        $scope.selectCategoryAc = function(selected) {

            if (selected != undefined) {
                // console.log(JSON.stringify(selected));

                $scope.product.category = selected.originalObject;
            }

        }

        $scope.clearInput = function(id) {
            if (id) {
                $scope.$broadcast('angucomplete-alt:clearInput', id);
            } else {
                $scope.$broadcast('angucomplete-alt:clearInput');
            }
        }

    });
