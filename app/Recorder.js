Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var color_1 = require("tns-core-modules/color");
var platform = require("tns-core-modules/platform");
var main_view_model_1 = require("./Recorder-view-model");
var Sqlite = require("nativescript-sqlite");
var createViewModel = require("./Recorder-view-model").createViewModel;
var createViewModel1 = require("./main-view-model");
var FrameModule = require("ui/frame");
var action = require("tns-core-modules/ui/action-bar")
var SocialShare = require("nativescript-social-share");



function onShare(args)
{
    SocialShare.shareText("Sending recording", "How would you like to upload your recording");

}
exports.onShare = onShare;

function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = new main_view_model_1.AudioDemo(page);
    if (app.android && platform.device.sdkVersion >= "21") {
        var window = app.android.startActivity.getWindow();
        window.setNavigationBarColor(new color_1.Color("#C2185B").android);
    }

}

function navigateToTasks(args) {
    FrameModule.topmost().navigate({moduleName: "main-page"});
}

exports.onNavigatingTo = onNavigatingTo;
exports.navigateToTasks = navigateToTasks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQW9EO0FBQ3BELGdEQUErQztBQUMvQyxvREFBc0Q7QUFDdEQscURBQThDO0FBRTlDLG9CQUFvQixJQUFJO0lBQ3RCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLDJCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFMUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3RELElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLGFBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3RCxDQUFDO0FBQ0gsQ0FBQztBQUNELE9BQU8sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBDb2xvciB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2NvbG9yXCI7XG5pbXBvcnQgKiBhcyBwbGF0Zm9ybSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9wbGF0Zm9ybVwiO1xuaW1wb3J0IHsgQXVkaW9EZW1vIH0gZnJvbSBcIi4vbWFpbi12aWV3LW1vZGVsXCI7XG5cbmZ1bmN0aW9uIHBhZ2VMb2FkZWQoYXJncykge1xuICB2YXIgcGFnZSA9IGFyZ3Mub2JqZWN0O1xuICBwYWdlLmJpbmRpbmdDb250ZXh0ID0gbmV3IEF1ZGlvRGVtbyhwYWdlKTtcblxuICBpZiAoYXBwLmFuZHJvaWQgJiYgcGxhdGZvcm0uZGV2aWNlLnNka1ZlcnNpb24gPj0gXCIyMVwiKSB7XG4gICAgdmFyIHdpbmRvdyA9IGFwcC5hbmRyb2lkLnN0YXJ0QWN0aXZpdHkuZ2V0V2luZG93KCk7XG4gICAgd2luZG93LnNldE5hdmlnYXRpb25CYXJDb2xvcihuZXcgQ29sb3IoXCIjQzIxODVCXCIpLmFuZHJvaWQpO1xuICB9XG59XG5leHBvcnRzLnBhZ2VMb2FkZWQgPSBwYWdlTG9hZGVkO1xuIl19