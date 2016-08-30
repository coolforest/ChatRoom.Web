﻿
chatApp.controller('homeController', ['dataFactory', '$scope', '$routeParams', 'chatHub', '$upload', '$sce',
        function (dataFactory, $scope, $routeParams, chatHub, $upload, $sce) {

	    $scope.title = "Home";
	    $scope.name = "Guest";
        $scope.imageUr = "";

	    $scope.message = {
            senderName: "",
	        body: "",
	        attachment: ""
	    };

	    $scope.messages = [];

	    

        function getMock() {
            return dataFactory.getUsers().then(function (response) {
                console.log(response.data);
            }, function(error) {
                console.log(error);
            });
        }

        //find & remove protocol (http, ftp, etc.) and get domain
        function extractDomain(url) {
            var domain;
            if (url.indexOf("://") > -1) {
                domain = url.split('/')[2];
            }
            else {
                domain = url.split('/')[0];
            }
            return domain.split(':')[0];
        }

        function urlify(text) {
            var urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, function (url) {
                return '<a href="' + url + '">' + extractDomain(url) + '</a>';
            });
        }

        function activited() {
            //updateScroll();
            chatHub.connect();
            console.log($scope.title + 'activited');
            getMock();
        }
        
        $scope.newMessage = function () {

            if ($scope.message.body || $scope.imageUr)
            {
                $scope.fileStyle = { "background-color": "white" }

                var newMessage = {
                    senderName: $scope.name,
                    body: urlify($scope.message.body),
                    attachment: $scope.imageUr
                }
                chatHub.send(newMessage);
                
                $scope.OnButtonImageClick = false;
                $scope.message.body = "";
                $scope.imageUr = "";
            }
        }

        $scope.upload = function (file) {
            if (file) {
                dataFactory.upload($scope.name, file).then(function (response) {
                    console.log(response.data);
                    $scope.imageUr = response.data;
                    $scope.fileStyle = { "background-color": "#A9F5A9" }
                }, function(error) {
                    console.log(error);
                    $scope.fileStyle = { "background-color": "#F5A9A9" }
                });
            }
        };
            
        chatHub.on(function (data) {
            var newMessage = {
                senderName: data.SenderName,
                body: data.Body,
                attachment: data.Attachment
            }
            $scope.messages.push(newMessage);
            console.log(data);
            $scope.$apply();
        });

        activited();

        function updateScroll() {
            var element = document.getElementById("chat");
            element.scrollTop = element.scrollHeight;
        }
}]);