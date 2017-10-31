"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var platform = require("tns-core-modules/platform");
var dialogs = require("tns-core-modules/ui/dialogs");
var timer = require("tns-core-modules/timer");
var observable_1 = require("tns-core-modules/data/observable");
var file_system_1 = require("tns-core-modules/file-system");
var nativescript_snackbar_1 = require("nativescript-snackbar");
var nativescript_audio_1 = require("nativescript-audio");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var Sqlite = require("nativescript-sqlite");
var dialogs = require("ui/dialogs");

function createViewModel() {
    var viewModel = new Observable();
    viewModel.files = new ObservableArray([]);
    console.log("here")
    var documents = file_system_1.knownFolders.currentApp().documents();
    documents.getEntities()
        .then(function (entities) {
            console.log("trying to get entities")
            // entities is array with the document's files and folders.
            entities.forEach(function (entity) {
                console.log(entity.name);
                viewModel.files.push(entity.name);
            });
        }, function (error) {
            console.log("Didnt work either no files or couldnt read folder")
            // Failed to obtain folder's contents.
            // globalConsole.error(error.message);
        });

    // viewModel.select = function() {
    //     viewModel.files = new ObservableArray([]);
    //     database.all("SELECT task_name FROM tasks WHERE list_id = ?", [this.listId]).then(rows => {
    //         for(var row in rows) {
    //         this.tasks.push(rows[row]);
    //     }
    // }, error => {
    //         console.log("SELECT ERROR", error);
    //     });
    // }

    // viewModel.select();

    return viewModel;
}

exports.createViewModel = createViewModel;


var AudioDemo = (function (_super) {
    __extends(AudioDemo, _super);
    function AudioDemo(page) {
        var _this = _super.call(this) || this;
        _this.audioUrls = [
            {
                name: "Fight Club",
                pic: "~/pics/canoe_girl.jpeg",
                url: "http://www.noiseaddicts.com/samples_1w72b820/2514.mp3"
            },
            {
                name: "To The Bat Cave!!!",
                pic: "~/pics/bears.jpeg",
                url: "http://www.noiseaddicts.com/samples_1w72b820/17.mp3"
            },
            {
                name: "Marlon Brando",
                pic: "~/pics/northern_lights.jpeg",
                url: "http://www.noiseaddicts.com/samples_1w72b820/47.mp3"
            }
        ];
        _this.player = new nativescript_audio_1.TNSPlayer();
        _this.recorder = new nativescript_audio_1.TNSRecorder();
        _this._SnackBar = new nativescript_snackbar_1.SnackBar();
        _this.set("currentVolume", 1);
        _this._slider = page.getViewById("slider");
        if (_this._slider) {
            _this._slider.on("valueChange", function (data) {
                _this.player.volume = _this._slider.value / 100;
            });
        }
        _this.startDurationTracking();
        return _this;
    }
    // AudioDemo.prototype.changeFolder = function (args)
    // {
    //     var audioFolder = file_system_1.knownFolders.currentApp().getFolder();
    // }
    AudioDemo.prototype.startRecord = function (args) {
        var _this = this;
        var audioFolder = file_system_1.knownFolders.currentApp().getFolder("audio");
        if (nativescript_audio_1.TNSRecorder.CAN_RECORD()) {
            console.log("Is trying to record");
            console.log(JSON.stringify(audioFolder));
            var androidFormat = void 0;
            var androidEncoder = void 0;
            if (platform.isAndroid) {
                androidFormat = 2;
                androidEncoder = 3;
            }
            // dialogs.prompt({
            //     message: "Your message",
            //     okButtonText: "Your button text",
            //     cancelButtonText: "Cancel text",
            // }).then(function (r) {
            //     console.log("Dialog result: " + r.result + ", text: " + r.text);
            //     var recordingPath = audioFolder.path + "/" + r.text + this.platformExtension();
            // });
            var recordingPath = audioFolder.path + "/recording." + this.platformExtension();
            var recorderOptions_1 = {
                filename: recordingPath,
                format: androidFormat,
                encoder: androidEncoder,
                metering: true,
                infoCallback: function (infoObject) {
                    console.log(JSON.stringify(infoObject));
                },
                errorCallback: function (errorObject) {
                    console.log(JSON.stringify(errorObject));
                }
            };
            this.recorder.start(recorderOptions_1).then(function (result) {
                _this.set("isRecording", true);
                if (recorderOptions_1.metering) {
                    _this.initMeter();
                }
            }, function (err) {
                _this.set("isRecording", false);
                _this.resetMeter();
                dialogs.alert(err);
            });
        }
        else {
            dialogs.alert("This device cannot record audio.");
        }
    };
    AudioDemo.prototype.stopRecord = function (args) {
        var _this = this;
        this.resetMeter();
        this.recorder.stop().then(function () {
            _this.set("isRecording", false);
            _this._SnackBar.simple("Recorder stopped");
            _this.resetMeter();
        }, function (ex) {
            console.log(ex);
            _this.set("isRecording", false);
            _this.resetMeter();
        });
    };
    AudioDemo.prototype.initMeter = function () {
        var _this = this;
        this.resetMeter();
        this.meterInterval = setInterval(function () {
            console.log(_this.recorder.getMeters());
        }, 500);
    };
    AudioDemo.prototype.resetMeter = function () {
        if (this.meterInterval) {
            clearInterval(this.meterInterval);
            this.meterInterval = undefined;
        }
    };
    AudioDemo.prototype.getFile = function (args) {
        try {
            var audioFolder = file_system_1.knownFolders.currentApp().getFolder("audio");
            var recordedFile = audioFolder.getFile("recording." + this.platformExtension());
            console.log(JSON.stringify(recordedFile));
            console.log("recording exists: " + file_system_1.File.exists(recordedFile.path));
            this.set("recordedAudioFile", recordedFile.path);
        }
        catch (ex) {
            console.log(ex);
        }
    };
    AudioDemo.prototype.playRecordedFile = function (args) {
        var _this = this;
        var audioFolder = file_system_1.knownFolders.currentApp().getFolder("audio");
        var recordedFile = audioFolder.getFile("recording." + this.platformExtension());
        console.log("RECORDED FILE : " + JSON.stringify(recordedFile));
        var playerOptions = {
            audioFile: "~/audio/recording." + this.platformExtension(),
            loop: false,
            completeCallback: function () {
                _this._SnackBar.simple("Audio file complete");
                _this.set("isPlaying", false);
                if (!playerOptions.loop) {
                    _this.player.dispose().then(function () {
                        console.log("DISPOSED");
                    }, function (err) {
                        console.log(err);
                    });
                }
            },
            errorCallback: function (errorObject) {
                console.log(JSON.stringify(errorObject));
                dialogs.alert("Error callback");
                _this.set("isPlaying", false);
            },
            infoCallback: function (infoObject) {
                console.log(JSON.stringify(infoObject));
                dialogs.alert("Info callback");
            }
        };
        this.player.playFromFile(playerOptions).then(function () {
            _this.set("isPlaying", true);
        }, function (err) {
            console.log(err);
            _this.set("isPlaying", false);
        });
    };
    AudioDemo.prototype.playAudio = function (filepath, fileType) {
        var _this = this;
        try {
            var playerOptions = {
                audioFile: filepath,
                loop: false,
                completeCallback: function () {
                    _this._SnackBar.simple("Audio file complete");
                    _this.player.dispose().then(function () {
                        _this.set("isPlaying", false);
                        console.log("DISPOSED");
                    }, function (err) {
                        console.log("ERROR disposePlayer: " + err);
                    });
                },
                errorCallback: function (errorObject) {
                    _this._SnackBar.simple("Error occurred during playback.");
                    console.log(JSON.stringify(errorObject));
                    _this.set("isPlaying", false);
                },
                infoCallback: function (args) {
                    console.log(JSON.stringify(args));
                    dialogs.alert("Info callback: " + args.info);
                    console.log(JSON.stringify(args));
                }
            };
            this.set("isPlaying", true);
            if (fileType === "localFile") {
                this.player.playFromFile(playerOptions).then(function () {
                    _this.set("isPlaying", true);
                }, function (err) {
                    console.log(err);
                    _this.set("isPlaying", false);
                });
            }
            else if (fileType === "remoteFile") {
                this.player.playFromUrl(playerOptions).then(function () {
                    _this.set("isPlaying", true);
                }, function (err) {
                    console.log(err);
                    _this.set("isPlaying", false);
                });
            }
        }
        catch (ex) {
            console.log(ex);
        }
    };
    AudioDemo.prototype.playRemoteFile = function (args) {
        console.log("playRemoteFile");
        var filepath = "http://www.noiseaddicts.com/samples_1w72b820/2514.mp3";
        this.playAudio(filepath, "remoteFile");
    };
    AudioDemo.prototype.resumePlayer = function () {
        console.log(JSON.stringify(this.player));
        this.player.resume();
    };
    AudioDemo.prototype.playLocalFile = function (args) {
        var filepath = "~/audio/angel.mp3";
        this.playAudio(filepath, "localFile");
    };
    AudioDemo.prototype.pauseAudio = function (args) {
        var _this = this;
        this.player.pause().then(function () {
            _this.set("isPlaying", false);
        }, function (err) {
            console.log(err);
            _this.set("isPlaying", true);
        });
    };
    AudioDemo.prototype.stopPlaying = function (args) {
        var _this = this;
        this.player.dispose().then(function () {
            _this._SnackBar.simple("Media Player Disposed");
        }, function (err) {
            console.log(err);
        });
    };
    AudioDemo.prototype.resumePlaying = function (args) {
        console.log("START");
        this.player.play();
    };
    AudioDemo.prototype.platformExtension = function () {
        return "" + (app.android ? "m4a" : "caf");
    };
    AudioDemo.prototype.startDurationTracking = function () {
        var _this = this;
        if (this.player) {
            var duration_1;
            this.player.getAudioTrackDuration().then(function (result) {
                console.log("Audio track duration = " + result);
                duration_1 = result;
                var timerId = timer.setInterval(function () {
                    _this.remainingDuration = duration_1 - _this.player.currentTime;
                    //console.log("this.remainingDuration = " + _this.remainingDuration);
                }, 1000);
            });
        }
    };
    return AudioDemo;
}(observable_1.Observable));
exports.AudioDemo = AudioDemo;







function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
exports.getRandomColor = getRandomColor;

function setRandomColor() {
    $("#cardStyle").css("background-color", getRandomColor());
}
exports.setRandomColor = setRandomColor;



//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi12aWV3LW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi12aWV3LW1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQW9EO0FBRXBELG9EQUFzRDtBQUN0RCxxREFBdUQ7QUFDdkQsOENBQWdEO0FBQ2hELCtEQUE4RDtBQUM5RCw0REFBa0U7QUFHbEUsK0RBQWlEO0FBQ2pELHlEQUs0QjtBQUk1QjtJQUErQiw2QkFBVTtJQThCdkMsbUJBQVksSUFBVTtRQUF0QixZQUNFLGlCQUFPLFNBZ0JSO1FBdENPLGVBQVMsR0FBZTtZQUM5QjtnQkFDRSxJQUFJLEVBQUUsWUFBWTtnQkFDbEIsR0FBRyxFQUFFLHdCQUF3QjtnQkFDN0IsR0FBRyxFQUFFLHVEQUF1RDthQUM3RDtZQUNEO2dCQUNFLElBQUksRUFBRSxvQkFBb0I7Z0JBQzFCLEdBQUcsRUFBRSxtQkFBbUI7Z0JBQ3hCLEdBQUcsRUFBRSxxREFBcUQ7YUFDM0Q7WUFDRDtnQkFDRSxJQUFJLEVBQUUsZUFBZTtnQkFDckIsR0FBRyxFQUFFLDZCQUE2QjtnQkFDbEMsR0FBRyxFQUFFLHFEQUFxRDthQUMzRDtTQUNGLENBQUM7UUFRQSxLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksOEJBQVMsRUFBRSxDQUFDO1FBQzlCLEtBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxnQ0FBVyxFQUFFLENBQUM7UUFDbEMsS0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGdDQUFRLEVBQUUsQ0FBQztRQUNoQyxLQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixLQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFXLENBQUM7UUFHcEQsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDakIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFVBQUMs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QUFBLE1BQU07Z0JBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTBCLE1BQVEsQ0FBQyxDQUFDO2dCQUNoRCxVQUFRLEdBQUcsTUFBTSxDQUFDO2dCQUNsQixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO29CQUNoQyxLQUFJLENBQUMsaUJBQWlCLEdBQUcsVUFBUSxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO29CQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE0QixLQUFJLENBQUMsaUJBQW1CLENBQUMsQ0FBQztnQkFDcEUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQWhWRCxDQUErQix1QkFBVSxHQWdWeEM7QUFoVlksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgKiBhcyBmcyBmcm9tICdmaWxlLXN5c3RlbSc7XG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb25cIjtcbmltcG9ydCAqIGFzIGNvbG9yIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2NvbG9yXCI7XG5pbXBvcnQgKiBhcyBwbGF0Zm9ybSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9kaWFsb2dzXCI7XG5pbXBvcnQgKiBhcyB0aW1lciBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy90aW1lclwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2RhdGEvb2JzZXJ2YWJsZVwiO1xuaW1wb3J0IHsga25vd25Gb2xkZXJzLCBGaWxlIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvZmlsZS1zeXN0ZW1cIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9wYWdlXCI7XG5pbXBvcnQgeyBTbGlkZXIgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9zbGlkZXJcIjtcbmltcG9ydCB7IFNuYWNrQmFyIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zbmFja2JhclwiO1xuaW1wb3J0IHtcbiAgVE5TUmVjb3JkZXIsXG4gIFROU1BsYXllcixcbiAgQXVkaW9QbGF5ZXJPcHRpb25zLFxuICBBdWRpb1JlY29yZGVyT3B0aW9uc1xufSBmcm9tIFwibmF0aXZlc2NyaXB0LWF1ZGlvXCI7XG5cbmRlY2xhcmUgdmFyIGFuZHJvaWQ7XG5cbmV4cG9ydCBjbGFzcyBBdWRpb0RlbW8gZXh0ZW5kcyBPYnNlcnZhYmxlIHtcbiAgcHVibGljIGlzUGxheWluZzogYm9vbGVhbjtcbiAgcHVibGljIGlzUmVjb3JkaW5nOiBib29sZWFuO1xuICBwdWJsaWMgcmVjb3JkZWRBdWRpb0ZpbGU6IHN0cmluZztcbiAgcHVibGljIHJlbWFpbmluZ0R1cmF0aW9uOyAvLyB1c2VkIHRvIHNob3cgdGhlIHJlbWFpbmluZyB0aW1lIG9mIHRoZSBhdWRpbyB0cmFja1xuICBwcml2YXRlIHJlY29yZGVyO1xuICBwcml2YXRlIHBsYXllcjogVE5TUGxheWVyO1xuICBwcml2YXRlIGF1ZGlvU2Vzc2lvbklkO1xuICBwcml2YXRlIHBhZ2U7XG4gIHByaXZhdGUgYXVkaW9VcmxzOiBBcnJheTxhbnk+ID0gW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiRmlnaHQgQ2x1YlwiLFxuICAgICAgcGljOiBcIn4vcGljcy9jYW5vZV9naXJsLmpwZWdcIixcbiAgICAgIHVybDogXCJodHRwOi8vd3d3Lm5vaXNlYWRkaWN0cy5jb20vc2FtcGxlc18xdzcyYjgyMC8yNTE0Lm1wM1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiBcIlRvIFRoZSBCYXQgQ2F2ZSEhIVwiLFxuICAgICAgcGljOiBcIn4vcGljcy9iZWFycy5qcGVnXCIsXG4gICAgICB1cmw6IFwiaHR0cDovL3d3dy5ub2lzZWFkZGljdHMuY29tL3NhbXBsZXNfMXc3MmI4MjAvMTcubXAzXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IFwiTWFybG9uIEJyYW5kb1wiLFxuICAgICAgcGljOiBcIn4vcGljcy9ub3J0aGVybl9saWdodHMuanBlZ1wiLFxuICAgICAgdXJsOiBcImh0dHA6Ly93d3cubm9pc2VhZGRpY3RzLmNvbS9zYW1wbGVzXzF3NzJiODIwLzQ3Lm1wM1wiXG4gICAgfVxuICBdO1xuICBwcml2YXRlIG1ldGVySW50ZXJ2YWw6IGFueTtcbiAgcHJpdmF0ZSBfU25hY2tCYXI6IFNuYWNrQmFyO1xuICBwcml2YXRlIF9zbGlkZXI6IFNsaWRlcjtcblxuICBjb25zdHJ1Y3RvcihwYWdlOiBQYWdlKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucGxheWVyID0gbmV3IFROU1BsYXllcigpO1xuICAgIHRoaXMucmVjb3JkZXIgPSBuZXcgVE5TUmVjb3JkZXIoKTtcbiAgICB0aGlzLl9TbmFja0JhciA9IG5ldyBTbmFja0JhcigpO1xuICAgIHRoaXMuc2V0KFwiY3VycmVudFZvbHVtZVwiLCAxKTtcbiAgICB0aGlzLl9zbGlkZXIgPSBwYWdlLmdldFZpZXdCeUlkKFwic2xpZGVyXCIpIGFzIFNsaWRlcjtcblxuICAgIC8vIFNldCBwbGF5ZXIgdm9sdW1lXG4gICAgaWYgKHRoaXMuX3NsaWRlcikge1xuICAgICAgdGhpcy5fc2xpZGVyLm9uKFwidmFsdWVDaGFuZ2VcIiwgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICB0aGlzLnBsYXllci52b2x1bWUgPSB0aGlzLl9zbGlkZXIudmFsdWUgLyAxMDA7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXJ0RHVyYXRpb25UcmFja2luZygpO1xuICB9XG5cbiAgcHVibGljIHN0YXJ0UmVjb3JkKGFyZ3MpIHtcbiAgICBpZiAoVE5TUmVjb3JkZXIuQ0FOX1JFQ09SRCgpKSB7XG4gICAgICB2YXIgYXVkaW9Gb2xkZXIgPSBrbm93bkZvbGRlcnMuY3VycmVudEFwcCgpLmdldEZvbGRlcihcImF1ZGlvXCIpO1xuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoYXVkaW9Gb2xkZXIpKTtcblxuICAgICAgbGV0IGFuZHJvaWRGb3JtYXQ7XG4gICAgICBsZXQgYW5kcm9pZEVuY29kZXI7XG4gICAgICBpZiAocGxhdGZvcm0uaXNBbmRyb2lkKSB7XG4gICAgICAgIC8vIG00YVxuICAgICAgICAvLyBzdGF0aWMgY29uc3RhbnRzIGFyZSBub3QgYXZhaWxhYmxlLCB1c2luZyByYXcgdmFsdWVzIGhlcmVcbiAgICAgICAgLy8gYW5kcm9pZEZvcm1hdCA9IGFuZHJvaWQubWVkaWEuTWVkaWFSZWNvcmRlci5PdXRwdXRGb3JtYXQuTVBFR180O1xuICAgICAgICBhbmRyb2lkRm9ybWF0ID0gMjtcbiAgICAgICAgLy8gYW5kcm9pZEVuY29kZXIgPSBhbmRyb2lkLm1lZGlhLk1lZGlhUmVjb3JkZXIuQXVkaW9FbmNvZGVyLkFBQztcbiAgICAgICAgYW5kcm9pZEVuY29kZXIgPSAzO1xuICAgICAgfVxuXG4gICAgICBsZXQgcmVjb3JkaW5nUGF0aCA9IGAke2F1ZGlvRm9sZGVyLnBhdGh9L3JlY29yZGluZy4ke3RoaXMucGxhdGZvcm1FeHRlbnNpb24oKX1gO1xuICAgICAgbGV0IHJlY29yZGVyT3B0aW9uczogQXVkaW9SZWNvcmRlck9wdGlvbnMgPSB7XG4gICAgICAgIGZpbGVuYW1lOiByZWNvcmRpbmdQYXRoLFxuXG4gICAgICAgIGZvcm1hdDogYW5kcm9pZEZvcm1hdCxcblxuICAgICAgICBlbmNvZGVyOiBhbmRyb2lkRW5jb2RlcixcblxuICAgICAgICBtZXRlcmluZzogdHJ1ZSxcblxuICAgICAgICBpbmZvQ2FsbGJhY2s6IGluZm9PYmplY3QgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGluZm9PYmplY3QpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBlcnJvckNhbGxiYWNrOiBlcnJvck9iamVjdCA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZXJyb3JPYmplY3QpKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdGhpcy5yZWNvcmRlci5zdGFydChyZWNvcmRlck9wdGlvbnMpLnRoZW4oXG4gICAgICAgIHJlc3VsdCA9PiB7XG4gICAgICAgICAgdGhpcy5zZXQoXCJpc1JlY29yZGluZ1wiLCB0cnVlKTtcbiAgICAgICAgICBpZiAocmVjb3JkZXJPcHRpb25zLm1ldGVyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRNZXRlcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICB0aGlzLnNldChcImlzUmVjb3JkaW5nXCIsIGZhbHNlKTtcbiAgICAgICAgICB0aGlzLnJlc2V0TWV0ZXIoKTtcbiAgICAgICAgICBkaWFsb2dzLmFsZXJ0KGVycik7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpYWxvZ3MuYWxlcnQoXCJUaGlzIGRldmljZSBjYW5ub3QgcmVjb3JkIGF1ZGlvLlwiKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RvcFJlY29yZChhcmdzKSB7XG4gICAgdGhpcy5yZXNldE1ldGVyKCk7XG4gICAgdGhpcy5yZWNvcmRlci5zdG9wKCkudGhlbihcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5zZXQoXCJpc1JlY29yZGluZ1wiLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuX1NuYWNrQmFyLnNpbXBsZShcIlJlY29yZGVyIHN0b3BwZWRcIik7XG4gICAgICAgIHRoaXMucmVzZXRNZXRlcigpO1xuICAgICAgfSxcbiAgICAgIGV4ID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXgpO1xuICAgICAgICB0aGlzLnNldChcImlzUmVjb3JkaW5nXCIsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5yZXNldE1ldGVyKCk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdE1ldGVyKCkge1xuICAgIHRoaXMucmVzZXRNZXRlcigpO1xuICAgIHRoaXMubWV0ZXJJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMucmVjb3JkZXIuZ2V0TWV0ZXJzKCkpO1xuICAgIH0sIDUwMCk7XG4gIH1cblxuICBwcml2YXRlIHJlc2V0TWV0ZXIoKSB7XG4gICAgaWYgKHRoaXMubWV0ZXJJbnRlcnZhbCkge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLm1ldGVySW50ZXJ2YWwpO1xuICAgICAgdGhpcy5tZXRlckludGVydmFsID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRGaWxlKGFyZ3MpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIGF1ZGlvRm9sZGVyID0ga25vd25Gb2xkZXJzLmN1cnJlbnRBcHAoKS5nZXRGb2xkZXIoXCJhdWRpb1wiKTtcbiAgICAgIHZhciByZWNvcmRlZEZpbGUgPSBhdWRpb0ZvbGRlci5nZXRGaWxlKFxuICAgICAgICBgcmVjb3JkaW5nLiR7dGhpcy5wbGF0Zm9ybUV4dGVuc2lvbigpfWBcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZWNvcmRlZEZpbGUpKTtcbiAgICAgIGNvbnNvbGUubG9nKFwicmVjb3JkaW5nIGV4aXN0czogXCIgKyBGaWxlLmV4aXN0cyhyZWNvcmRlZEZpbGUucGF0aCkpO1xuICAgICAgdGhpcy5zZXQoXCJyZWNvcmRlZEF1ZGlvRmlsZVwiLCByZWNvcmRlZEZpbGUucGF0aCk7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIGNvbnNvbGUubG9nKGV4KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcGxheVJlY29yZGVkRmlsZShhcmdzKSB7XG4gICAgdmFyIGF1ZGlvRm9sZGVyID0ga25vd25Gb2xkZXJzLmN1cnJlbnRBcHAoKS5nZXRGb2xkZXIoXCJhdWRpb1wiKTtcbiAgICB2YXIgcmVjb3JkZWRGaWxlID0gYXVkaW9Gb2xkZXIuZ2V0RmlsZShcbiAgICAgIGByZWNvcmRpbmcuJHt0aGlzLnBsYXRmb3JtRXh0ZW5zaW9uKCl9YFxuICAgICk7XG4gICAgY29uc29sZS5sb2coXCJSRUNPUkRFRCBGSUxFIDogXCIgKyBKU09OLnN0cmluZ2lmeShyZWNvcmRlZEZpbGUpKTtcblxuICAgIHZhciBwbGF5ZXJPcHRpb25zOiBBdWRpb1BsYXllck9wdGlvbnMgPSB7XG4gICAgICBhdWRpb0ZpbGU6IGB+L2F1ZGlvL3JlY29yZGluZy4ke3RoaXMucGxhdGZvcm1FeHRlbnNpb24oKX1gLFxuICAgICAgbG9vcDogZmFsc2UsXG4gICAgICBjb21wbGV0ZUNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuX1NuYWNrQmFyLnNpbXBsZShcIkF1ZGlvIGZpbGUgY29tcGxldGVcIik7XG4gICAgICAgIHRoaXMuc2V0KFwiaXNQbGF5aW5nXCIsIGZhbHNlKTtcbiAgICAgICAgaWYgKCFwbGF5ZXJPcHRpb25zLmxvb3ApIHtcbiAgICAgICAgICB0aGlzLnBsYXllci5kaXNwb3NlKCkudGhlbihcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJESVNQT1NFRFwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGVycm9yQ2FsbGJhY2s6IGVycm9yT2JqZWN0ID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZXJyb3JPYmplY3QpKTtcblxuICAgICAgICBkaWFsb2dzLmFsZXJ0KFwiRXJyb3IgY2FsbGJhY2tcIik7XG4gICAgICAgIHRoaXMuc2V0KFwiaXNQbGF5aW5nXCIsIGZhbHNlKTtcbiAgICAgIH0sXG5cbiAgICAgIGluZm9DYWxsYmFjazogaW5mb09iamVjdCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGluZm9PYmplY3QpKTtcblxuICAgICAgICBkaWFsb2dzLmFsZXJ0KFwiSW5mbyBjYWxsYmFja1wiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5wbGF5ZXIucGxheUZyb21GaWxlKHBsYXllck9wdGlvbnMpLnRoZW4oXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0KFwiaXNQbGF5aW5nXCIsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIHRoaXMuc2V0KFwiaXNQbGF5aW5nXCIsIGZhbHNlKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgLyoqKioqIEFVRElPIFBMQVlFUiAqKioqKi9cblxuICBwdWJsaWMgcGxheUF1ZGlvKGZpbGVwYXRoOiBzdHJpbmcsIGZpbGVUeXBlOiBzdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGxheWVyT3B0aW9uczogQXVkaW9QbGF5ZXJPcHRpb25zID0ge1xuICAgICAgICBhdWRpb0ZpbGU6IGZpbGVwYXRoLFxuICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgY29tcGxldGVDYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX1NuYWNrQmFyLnNpbXBsZShcIkF1ZGlvIGZpbGUgY29tcGxldGVcIik7XG5cbiAgICAgICAgICB0aGlzLnBsYXllci5kaXNwb3NlKCkudGhlbihcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5zZXQoXCJpc1BsYXlpbmdcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRJU1BPU0VEXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1IgZGlzcG9zZVBsYXllcjogXCIgKyBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXJyb3JDYWxsYmFjazogZXJyb3JPYmplY3QgPT4ge1xuICAgICAgICAgIHRoaXMuX1NuYWNrQmFyLnNpbXBsZShcIkVycm9yIG9jY3VycmVkIGR1cmluZyBwbGF5YmFjay5cIik7XG4gICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZXJyb3JPYmplY3QpKTtcbiAgICAgICAgICB0aGlzLnNldChcImlzUGxheWluZ1wiLCBmYWxzZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5mb0NhbGxiYWNrOiBhcmdzID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShhcmdzKSk7XG5cbiAgICAgICAgICBkaWFsb2dzLmFsZXJ0KFwiSW5mbyBjYWxsYmFjazogXCIgKyBhcmdzLmluZm8pO1xuICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGFyZ3MpKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdGhpcy5zZXQoXCJpc1BsYXlpbmdcIiwgdHJ1ZSk7XG5cbiAgICAgIGlmIChmaWxlVHlwZSA9PT0gXCJsb2NhbEZpbGVcIikge1xuICAgICAgICB0aGlzLnBsYXllci5wbGF5RnJvbUZpbGUocGxheWVyT3B0aW9ucykudGhlbihcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldChcImlzUGxheWluZ1wiLCB0cnVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgdGhpcy5zZXQoXCJpc1BsYXlpbmdcIiwgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoZmlsZVR5cGUgPT09IFwicmVtb3RlRmlsZVwiKSB7XG4gICAgICAgIHRoaXMucGxheWVyLnBsYXlGcm9tVXJsKHBsYXllck9wdGlvbnMpLnRoZW4oXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXQoXCJpc1BsYXlpbmdcIiwgdHJ1ZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIHRoaXMuc2V0KFwiaXNQbGF5aW5nXCIsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIGNvbnNvbGUubG9nKGV4KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUExBWSBSRU1PVEUgQVVESU8gRklMRVxuICAgKi9cbiAgcHVibGljIHBsYXlSZW1vdGVGaWxlKGFyZ3MpIHtcbiAgICBjb25zb2xlLmxvZyhcInBsYXlSZW1vdGVGaWxlXCIpO1xuICAgIHZhciBmaWxlcGF0aCA9IFwiaHR0cDovL3d3dy5ub2lzZWFkZGljdHMuY29tL3NhbXBsZXNfMXc3MmI4MjAvMjUxNC5tcDNcIjtcblxuICAgIHRoaXMucGxheUF1ZGlvKGZpbGVwYXRoLCBcInJlbW90ZUZpbGVcIik7XG4gIH1cblxuICBwdWJsaWMgcmVzdW1lUGxheWVyKCkge1xuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRoaXMucGxheWVyKSk7XG4gICAgdGhpcy5wbGF5ZXIucmVzdW1lKCk7XG4gIH1cblxuICAvKipcbiAgICogUExBWSBMT0NBTCBBVURJTyBGSUxFIGZyb20gYXBwIGZvbGRlclxuICAgKi9cbiAgcHVibGljIHBsYXlMb2NhbEZpbGUoYXJncykge1xuICAgIGxldCBmaWxlcGF0aCA9IFwifi9hdWRpby9hbmdlbC5tcDNcIjtcblxuICAgIHRoaXMucGxheUF1ZGlvKGZpbGVwYXRoLCBcImxvY2FsRmlsZVwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQQVVTRSBQTEFZSU5HXG4gICAqL1xuICBwdWJsaWMgcGF1c2VBdWRpbyhhcmdzKSB7XG4gICAgdGhpcy5wbGF5ZXIucGF1c2UoKS50aGVuKFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnNldChcImlzUGxheWluZ1wiLCBmYWxzZSk7XG4gICAgICB9LFxuICAgICAgZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgdGhpcy5zZXQoXCJpc1BsYXlpbmdcIiwgdHJ1ZSk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBzdG9wUGxheWluZyhhcmdzKSB7XG4gICAgdGhpcy5wbGF5ZXIuZGlzcG9zZSgpLnRoZW4oXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMuX1NuYWNrQmFyLnNpbXBsZShcIk1lZGlhIFBsYXllciBEaXNwb3NlZFwiKTtcbiAgICAgIH0sXG4gICAgICBlcnIgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUkVTVU1FIFBMQVlJTkdcbiAgICovXG4gIHB1YmxpYyByZXN1bWVQbGF5aW5nKGFyZ3MpIHtcbiAgICBjb25zb2xlLmxvZyhcIlNUQVJUXCIpO1xuICAgIHRoaXMucGxheWVyLnBsYXkoKTtcbiAgICAvLyBzdGFydCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBwbGF0Zm9ybUV4dGVuc2lvbigpIHtcbiAgICAvLydtcDMnXG4gICAgcmV0dXJuIGAke2FwcC5hbmRyb2lkID8gXCJtNGFcIiA6IFwiY2FmXCJ9YDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnREdXJhdGlvblRyYWNraW5nKCkge1xuICAgIGlmICh0aGlzLnBsYXllcikge1xuICAgICAgbGV0IGR1cmF0aW9uO1xuICAgICAgdGhpcy5wbGF5ZXIuZ2V0QXVkaW9UcmFja0R1cmF0aW9uKCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgQXVkaW8gdHJhY2sgZHVyYXRpb24gPSAke3Jlc3VsdH1gKTtcbiAgICAgICAgZHVyYXRpb24gPSByZXN1bHQ7XG4gICAgICAgIGNvbnN0IHRpbWVySWQgPSB0aW1lci5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZW1haW5pbmdEdXJhdGlvbiA9IGR1cmF0aW9uIC0gdGhpcy5wbGF5ZXIuY3VycmVudFRpbWU7XG4gICAgICAgICAgY29uc29sZS5sb2coYHRoaXMucmVtYWluaW5nRHVyYXRpb24gPSAke3RoaXMucmVtYWluaW5nRHVyYXRpb259YCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=