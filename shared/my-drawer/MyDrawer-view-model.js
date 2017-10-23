const observableModule = require("data/observable");
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
var Dialogs = require("ui/dialogs");

/* ***********************************************************
 * Keep data that is displayed in your app drawer in the MyDrawer custom component view model.
 *************************************************************/
function MyDrawerViewModel(selectedPage) {
    const viewModel = observableModule.fromObject({
        /* ***********************************************************
         * Use the MyDrawer view model to initialize the properties data values.
         *************************************************************/
        selectedPage: selectedPage
    });

    return viewModel;
}

module.exports = MyDrawerViewModel;