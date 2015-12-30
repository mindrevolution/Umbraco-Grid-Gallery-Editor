var app = angular.module("umbraco");

// - required angular modules
app.requires.push("dndLists");

app.controller("mindrevolution.PropertyEditors.Grid.Gallery.Controller",
    function ($scope, $rootScope, $timeout, dialogService) {

        //console.log("init", $scope.control.value, $scope.control.value.images);

        $scope.addImages = function () {
            dialogService.mediaPicker({
                startNodeId: $scope.control.editor.config && $scope.control.editor.config.startNodeId ? $scope.control.editor.config.startNodeId : undefined,
                multiPicker: true,
                cropSize: $scope.control.editor.config && $scope.control.editor.config.size ? $scope.control.editor.config.size : undefined,
                showDetails: false,
                callback: function (data) {
                    // - loop over picked media items
                    data.forEach(function(item) {
                        var media = {
                            id: item.id,
                            image: item.image,
                            name: item.name,
                            focalPoint: item.focalPoint,
                            altText: item.altText
                        };

                        // - build crop url, etc.
                        media = $scope.constructUrls(media);

                        // - add to control's image array
                        if ($scope.control.value === null) {
                            $scope.control.value = {
                                images: new Array
                            }
                        };
                        $scope.control.value.images.push(media);

                        //console.log("added image", media, $scope.control.value.images);
                    });
                }
            });
        };

        $scope.removeImage = function (index) {
            $scope.control.value.images.splice(index, 1);
        };

        $scope.constructUrls = function (media) {
            if (media.image) {
                var url = media.image;

                if ($scope.control.editor.config && $scope.control.editor.config.size) {
                    url += "?width=" + $scope.control.editor.config.size.width;
                    url += "&height=" + $scope.control.editor.config.size.height;

                    if (media.focalPoint) {
                        url += "&center=" + media.focalPoint.top + "," + media.focalPoint.left;
                        url += "&mode=crop";
                    }
                }

                media.url = url;
            }

            return media;
        };

        $scope.thumbnailUrl = function (url) {
            if (url.indexOf("?") == -1) {
                url = url + "?width=200&height=200";
            } else {
                url = url.replace(/(width=)[^\&]+/, '$1' + 200);
                url = url.replace(/(height=)[^\&]+/, '$1' + 200);
            }
            url += "&mode=crop";

            return url;
        };

        $timeout(function () {
            if ($scope.control.$initializing) {
                $scope.addImages();
            } else if ($scope.control.value) {
                //$scope.setUrl();
            }
        }, 200);

    });