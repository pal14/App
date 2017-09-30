var FDApp = angular.module('FDApp',[]);
FDApp.controller('FDctrl', ['$scope','$http',function($scope,$http) {
	console.log("controller");

var refresh = function() {

	$http.get('/investment')
	.then(function(response) {
		console.log("got data");
		$scope.investment = response.data;
		console.log($scope.investment);
		
	});
	

};

refresh();

	$scope.addInvestment = function() {
		console.log($scope.inv);
		$http.post('/investmentlist', $scope.inv)
		.then(function(response) {
			console.log(response.data)
			refresh();
			$scope.inv = {};
		});
	};



	$scope.remove = function(id) {
		console.log(id);
		$http.delete('/investmentlist/' + id)
		.then(function(response) {
			console.log(response)
			refresh();
		});
		
	};


	$scope.edit = function(id) {
		console.log(id);
		$http.get('/investmentlist/' + id)
		.then(function(response) {
			$scope.inv = response.data;
			console.log($scope.inv)

		})
	};

	$scope.update = function() {
		console.log($scope.inv._id);
		$http.put('/investmentlist/' + $scope.inv._id, $scope.inv)
		.then(function(response) {
			console.log(response)
			refresh();
			$scope.inv = {};
		})
	};

}]);



