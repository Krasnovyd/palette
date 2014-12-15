'use strict';

var palette = angular.module('palette', []);

palette.controller('paletteCtrl', function($scope, $http) {
	$scope.colors = [
		{
			"name": "Red",
			"color": "#ff1"
		},
		{
			"name": "Green",
			"color": "green"
		},
		{
			"name": "Blue",
			"color": "blue"
		},
		{
			"name": "Black",
			"color": "black"
		}
	];

	$http.get('json/grid.json').success(function(data) {
		$scope.gridColors = data;
	});

	$scope.reset = function(){
		angular.forEach($scope.gridColors, function(cell) {
			cell.color = cell.color == "rgb(255, 255, 255)" ? "rgb(255,255,255)" : "rgb(255, 255, 255)";
		});
	};
	$scope.save = function(){
		$http.post('json/saved.json', $scope.gridColors).then(function(data) {
			console.log(data.config.data);
		});
	};
	$scope.load = function(){
		$http.get('json/grid.json').then(function(data) {
			$scope.gridColors = data.data;
		});
	};
});
palette.directive("drag", function(){
	return {
		link: function(scope, elem){
			elem.draggable({
				helper: "clone"
			});
		}
	}
});
palette.directive("drop", function(){
	return {
		link: function(scope, elem){
			elem.droppable({
				drop:function(event, ui){
					var newColor = mixer(ui.draggable.css("backgroundColor"), event.target.attributes.datacolor.value);
					event.target.attributes.datacolor.value = newColor;
					$(this).css("backgroundColor", newColor);
				}
			});
		}
	}
});

function mixer(color1, color2){
	var rgb = [],
		regExp = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
		color1 = color1.match(regExp),
		color2 = color2.match(regExp);

	for(var i = 1; i < 4; i++){
		rgb[i-1] = Math.round((parseFloat(color1[i]) + parseFloat(color2[i]))/2);
	};
	return "rgb("+ rgb[0] +"," + rgb[1] + "," + rgb[2] + ")";
}