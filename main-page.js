Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var color_1 = require("tns-core-modules/color");
var platform = require("tns-core-modules/platform");
var Sqlite = require("nativescript-sqlite");
var FrameModule = require("ui/frame");
var createViewModel = require("./main-view-model");
var socialShare = require("nativescript-social-share");
var imageSource = require("image-source");




exports.folder = function() {
	var sound = imageSource.fromFile("~/images/nativescript.jpg");
	socialShare.shareImage(sound);
};
exports.shareText = function() {
	socialShare.shareText("I love NativeScript!");
};
exports.shareUrl = function() {
	socialShare.shareUrl("https://www.nativescript.org/", "Home of NativeScript", "How would you like to share this url?");
};



function onNavigatingTo(args) {
    var page = args.object;
    (new Sqlite("my.db")).then(db => {
        db.execSQL("CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY AUTOINCREMENT, File_name TEXT)").then(id => {
        page.bindingContext = createViewModel.createViewModel(db);
}, error => {
        console.log("CREATE TABLE ERROR", error);
    });
}, error => {
        console.log("OPEN DB ERROR", error);
    });
}

function navigateToTasks(args) {
    FrameModule.topmost().navigate({moduleName: "Recorder", context: {listId: args.object.bindingContext.lists.getItem(args.index).id}});
}

exports.onNavigatingTo = onNavigatingTo;
exports.navigateToTasks = navigateToTasks;


function pageLoaded(args) {
    var page = args.object;

    (new Sqlite("my.db")).then(db => {
        db.execSQL("CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY AUTOINCREMENT, list_name TEXT)").then(id => {
        page.bindingContext = createViewModel.createViewModel(db);
}, error => {
        console.log("CREATE TABLE ERROR", error);
    });
}, error => {
        console.log("OPEN DB ERROR", error);
    });
    if (app.android && platform.device.sdkVersion >= "21") {
        var window = app.android.startActivity.getWindow();
        window.setNavigationBarColor(new color_1.Color("#C2185B").android);
    }

}

exports.pageLoaded = pageLoaded;
//exports.onDrawerButtonTap = onDrawerButtonTap;
exports.onNavigatingTo = onNavigatingTo;
exports.navigateToTasks = navigateToTasks;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQW9EO0FBQ3BELGdEQUErQztBQUMvQyxvREFBc0Q7QUFDdEQscURBQThDO0FBRTlDLG9CQUFvQixJQUFJO0lBQ3RCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLDJCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFMUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3RELElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLGFBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3RCxDQUFDO0FBQ0gsQ0FBQztBQUNELE9BQU8sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBDb2xvciB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2NvbG9yXCI7XG5pbXBvcnQgKiBhcyBwbGF0Zm9ybSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xuaW1wb3J0IHsgQXVkaW9EZW1vIH0gZnJvbSBcIi4vbWFpbi12aWV3LW1vZGVsXCI7XG5cbmZ1bmN0aW9uIHBhZ2VMb2FkZWQoYXJncykge1xuICB2YXIgcGFnZSA9IGFyZ3Mub2JqZWN0O1xuICBwYWdlLmJpbmRpbmdDb250ZXh0ID0gbmV3IEF1ZGlvRGVtbyhwYWdlKTtcblxuICBpZiAoYXBwLmFuZHJvaWQgJiYgcGxhdGZvcm0uZGV2aWNlLnNka1ZlcnNpb24gPj0gXCIyMVwiKSB7XG4gICAgdmFyIHdpbmRvdyA9IGFwcC5hbmRyb2lkLnN0YXJ0QWN0aXZpdHkuZ2V0V2luZG93KCk7XG4gICAgd2luZG93LnNldE5hdmlnYXRpb25CYXJDb2xvcihuZXcgQ29sb3IoXCIjQzIxODVCXCIpLmFuZHJvaWQpO1xuICB9XG59XG5leHBvcnRzLnBhZ2VMb2FkZWQgPSBwYWdlTG9hZGVkO1xuIl19*/
