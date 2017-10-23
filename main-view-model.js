"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_system_1 = require("tns-core-modules/file-system");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var Sqlite = require("nativescript-sqlite");
var Dialogs = require("ui/dialogs");

function createViewModel(database) {
    var viewModel = new Observable();
    viewModel.lists = new ObservableArray([]);

    console.log("inside view model")

    viewModel.insert = function() {
        console.log("prompting");
        Dialogs.prompt("Folder Name?", "").then(result => {
            database.execSQL("INSERT INTO lists (list_name) VALUES (?)", [result.text]).then(id => {
        //var Folderpath =  file_system_1.path.join( file_system_1.knownFolders.documents().path, result.text);
            viewModel.lists.push({id: id, list_name: result.text});

        }, error => {
            console.log("INSERT ERROR", error);
        });
    });

    }



    viewModel.select = function() {
        this.lists = new ObservableArray([]);
        database.all("SELECT id, list_name FROM lists").then(rows => {
            for(var row in rows) {
            this.lists.push({id: rows[row][0], list_name: rows[row][1]});
        }
    }, error => {
            console.log("SELECT ERROR", error);
        });
    }

    //viewModel.refresh = refreshList(viewModel.lists);
    viewModel.select();

    return viewModel;
}

exports.createViewModel = createViewModel;

function refreshList(args, ObservableArray) {

    // Get reference to the PullToRefresh;
    var pullRefresh = args.object;

    // Do work here... and when done call set refreshing property to false to stop the refreshing
    ObservableArray.then(function (resp) {
        // ONLY USING A TIMEOUT TO SIMULATE/SHOW OFF THE REFRESHING
        setTimeout(function () {
            pullRefresh.refreshing = false;
        }, 10);
    }, function (err) {
        pullRefresh.refreshing = false;
    });
}
exports.refreshList = refreshList;

