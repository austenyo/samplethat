"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_system_1 = require("tns-core-modules/file-system");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var Sqlite = require("nativescript-sqlite");
var Dialogs = require("ui/dialogs");
var index = 0;

function createViewModel(database) {
    var viewModel = new Observable();
    viewModel.lists = new ObservableArray([]);
    
    console.log("inside view model")

    viewModel.insert = function() {
        console.log("prompting");
        Dialogs.prompt(
            
            "Folder Name?", ""
        
        
        
        ).then(result => {
            database.execSQL("INSERT INTO lists (list_name) VALUES (?)", [result.text]).then(id => {
        //var Folderpath =  file_system_1.path.join( file_system_1.knownFolders.documents().path, result.text);
            viewModel.lists.push({id: id, list_name: result.text}); 
        }, error => {
            console.log("INSERT ERROR", error);
        });
    });
    
    }

viewModel.delete = function(args) {
    console.log("in delete")
    var id = args.object;
            
            Dialogs.action({
                message: "Would you Like to Delete this Folder?",
                cancelButtonText: "Cancel",
                actions: ["Yes", "No"]
            }).then(function (result) {
                console.log("Dialog result: " + result);
                if(result == "Yes"){
                    viewModel.lists.pop(id);
                }else if(result == "NO"){
                    console.log('We kept it captain')
                }
            });
        }

    // viewModel.select = function() {
    //     this.lists = new ObservableArray([]);
    //     database.all("SELECT id, list_name FROM lists").then(rows => {
    //         for(var row in rows) {
    //         this.lists.push({id: rows[row][0], list_name: rows[row][1]});
    //     }
    // }, error => {
    //         console.log("SELECT ERROR", error);
    //     });
    // }

    // viewModel.refresh = function refreshList(args) {

    // // Get reference to the PullToRefresh;
    // var pullRefresh = args.object;
    // console.log("refreshing")
    //     // Do work here... and when done call set refreshing property to false to stop the refreshing
    //     viewModel.lists.then(function (resp) {
    //         // ONLY USING A TIMEOUT TO SIMULATE/SHOW OFF THE REFRESHING
    //         setTimeout(function () {
    //             pullRefresh.refreshing = false;
    //         }, 10);
    //     }, function (err) {
    //         pullRefresh.refreshing = false;
    //     });
    // }
    

    return viewModel;
}

exports.createViewModel = createViewModel;


// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     console.log(color)
//     return color;
//   }
  
//   exports.getRandomColor = getRandomColor;
  
//   function setRandomColor() {
//     page.addCss("cardstyle {background-color: getRandomColor()}");
//   }
// exports.setRandomColor = setRandomColor;



