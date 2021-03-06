'use strict';

function UserCtrl($scope, backend) {
    $scope.user = null;
    $scope.login = function () {
        backend.user().then(function (response) {
            $scope.user = response.data;
        });
    }
    $scope.login();
}

var max = 18;

function getId(i, j) {
    var x = String.fromCharCode(97 + i);
    var y = String.fromCharCode(97 + j);
    return x+y;
}

function GobanCtrl($scope, $log, viewer, Player, StoneColor, SetupTools, MarkupTools, PlayerModes) {
	this.node = null;
	$scope.node = null;
	
	//Create board in local variable
	//$scope.board = new Board({ width: 19, height: 19 });
	$scope.Game = Player.game;
	//Set setup tools and markup tools in scope
	$scope.SetupTools = SetupTools;
	$scope.MarkupTools = MarkupTools;
		
}

function GameInfoCtrl($scope, $log, doc, backend) {
	$scope.doc = doc;
	$scope.save = function() {
		$log.info("save: ", $scope.doc.node.properties);
		backend.saveNode($scope.doc, $scope.doc.node);
	}

	$scope.saveInfo = function($event) {
		$log.info("saveInfo: ", $scope.gameInfo.$dirty, $scope.gameInfo.$valid);
		if ($scope.gameInfo.$dirty) {
			$log.info("save: ", $scope.doc.info.properties);
			backend.saveInfo($scope.doc, $scope.doc.info);
			$scope.gameInfo.$setPristine();
		}
	}
}

function NavCtrl($scope, backend) {
    $scope.start = function () {
    	this.viewer.start(); 
    };
    $scope.next = function () {
    	this.viewer.next(); 
    };
    $scope.prev = function () {
    	this.viewer.prev(); 
    };
    $scope.next5 = function () {
    	this.viewer.next(); 
    };
    $scope.prev5 = function () {
    	this.viewer.prev(); 
    };

    $scope.end = function () {
    	this.viewer.end(); 
    };
}

function PlayCtrl($scope, $location, $routeParams, $timeout, $log, viewer, doc) {
    $log.info("PlayCtrl: routeParams=", $routeParams);
    $scope.viewer = viewer;
    $scope.doc = doc;
    $scope.$on('saved',
        function (event) {
            $location.path('view/' + doc.resource_id);
        });
    if ($routeParams.id) {
        viewer.load($routeParams.id);
    } else {
        // New doc, but defer to next event cycle to ensure init
        $timeout(function () {
                viewer.create();
            },
            1);
    }
}

function ShareCtrl($scope, appId, doc) {
    /*
     var client = gapi.drive.share.ShareClient(appId);
     $scope.enabled = function() {
     return doc.resource_id != null;
     };
     $scope.share = function() {
     client.setItemIds([doc.resource_id]);
     client.showSharingSettings();
     }
     */
}

function MenuCtrl($scope, $location, viewer, appId) {
    var onFilePicked = function (data) {
        $scope.$apply(function () {
            if (data.action == 'picked') {
            	console.log("File picked: " + data.docs[0]);
                var id = data.docs[0].id;
                $location.path('view/' + id);
            }
        });
    };
    $scope.open = function () {
        var view = new google.picker.View(google.picker.ViewId.DOCS);
        var appElement = document.querySelector('[ng-controller=UserCtrl]');
        var accessToken = angular.element(appElement).scope().user['access_token']
        view.setMimeTypes('application/x-go-sgf');
        var picker = new google.picker.PickerBuilder()
            .setAppId(appId)
            .addView(view)
            .setOAuthToken(accessToken)
            .setCallback(angular.bind(this, onFilePicked))
            .build();
        picker.setVisible(true);
    };

    $scope.save = function () {
        viewer.save(true);
    }
}

function RenameCtrl($scope, doc) {
    $('#rename-dialog').on('show',
        function () {
            $scope.$apply(function () {
                $scope.newFileName = doc.info.title;
            });
        });
    $scope.save = function () {
        doc.info.title = $scope.newFileName;
        $('#rename-dialog').modal('hide');
    };
}

function AboutCtrl($scope, backend) {
    $('#about-dialog').on('show',
        function () {
            backend.about().then(function (result) {
                $scope.info = result.data;
            });
        });
}