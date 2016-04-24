/**
 * Created by matthewmicallef on 28/03/2016.
 */

var app = angular.module('App', ['ngRoute', 'ngAnimate', 'ngMaterial']);

app.config(appConfig);

//services
app.service('animationService', animationService);

//directives
app.directive('animationMenu', animationMenuDirective);
app.directive('mapReduce', mapReduceDirective);
app.directive('animationControls', animationControlsDirective);