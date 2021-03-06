﻿
chatApp.controller('homeController', ['dataFactory', '$scope', '$routeParams', 'chatHub',
        function (dataFactory, $scope, $routeParams, chatHub) {

        // for the full image url
        var domian = location.protocol + '//' + location.host + '/';
        var imgUrl = "";

        $scope.isLoad = true;
	    $scope.title = "Home";
	    $scope.messages = [];
        $scope.message = {
            SenderName: "",
            SenderId: "",
            Body: "",
            Attachment: "",
            DateTime: new Date()
        }

        // like a start point
        function activited() {
            dataFactory.getUser($routeParams.id).then(function (response) {
                chatHub.stop();
                chatHub.connect().done(function () {
                    $scope.message.SenderName = response.data.Name;
                    $scope.message.SenderId = response.data.Id;

                    dataFactory.getMessages().then(function (response) {
                        $scope.messages = response.data;
                        $scope.isLoad = false;
                    }, function (error) {
                        console.log(error);
                    });
                });
            }, function (error) {
                console.log(error);
            });
        }
        
        $scope.newMessage = function () {
            if ($scope.message.Body || $scope.message.Attachment)
            {
                $scope.message.Body = $scope.message.Body;
                $scope.message.Attachment = imgUrl;
                
                // publish message
                chatHub.send($scope.message);
                
                $scope.OnButtonImageClick = false;
                $scope.message.Body = "";
                $scope.message.Attachment = "";
                imgUrl = "";
            }
        }

        $scope.upload = function (file) {
            if (file) {
                dataFactory.upload($scope.message.SenderName, file).then(function (response) {
                    $scope.message.Attachment = response.data;
                    imgUrl = response.data;
                    $scope.fileStyle = { "background-color": "#A9F5A9" }
                }, function(error) {
                    console.log(error);
                    $scope.fileStyle = { "background-color": "#F5A9A9" }
                });
            }
        };
            
        // event on new message
        chatHub.on(function (data) {
            $scope.message.Attachment = "";
            urlImg = data.Attachment;
            var msg = {
                SenderName: data.SenderName,
                Body: data.Body,
                Attachment: data.Attachment === "" ? "" : domian + data.Attachment,
                DateTime: data.DateTime
            }
            $scope.messages.push(msg);
            $scope.$apply();
        });

        activited();
}]);