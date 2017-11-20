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
    AudioDemo.prototype.startRecord = function (args) {
        var _this = this;
        if (nativescript_audio_1.TNSRecorder.CAN_RECORD()) {
            var audioFolder = file_system_1.knownFolders.currentApp().getFolder("audio");
            console.log(JSON.stringify(audioFolder));
            var androidFormat = void 0;
            var androidEncoder = void 0;
            if (platform.isAndroid) {
                androidFormat = 2;
                androidEncoder = 3;
            }
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