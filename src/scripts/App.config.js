/**
 * Created by matthewmicallef on 16/04/2016.
 */

var appConfig = function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'pages/Home.html',
            controller: homeController
        })

        //TODO: route for the home page
        .when('/about', {
            templateUrl: 'pages/About.html',
            controller: aboutController
        })

        // route for the word count animation page
        .when('/wordcount', {
            templateUrl: 'pages/WordCount.html',
            controller: wordCountController
        })

        // route for the mean count animation page
        .when('/mean', {
            templateUrl: 'pages/Mean.html',
            controller: meanController
        })

        // route for the relative frequencies animation page
        .when('/relativefrequencies', {
            templateUrl: 'pages/RelativeFrequencies.html',
            controller: relativeFrequenciesController
        })
};