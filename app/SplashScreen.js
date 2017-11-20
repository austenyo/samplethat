const app = require("application");
"use strict"
com.viksaa.sssplash.lib.activity.AwesomeSplash.extend("com.fitcom.SplashScreen", {
    initSplash: function (configSplash) {

        //Customize Circular Reveal
        configSplash.setBackgroundColor(getResource("color","black")); //any color you want form colors.xml ("md_blue_900")
        configSplash.setAnimCircularRevealDuration(0000); //int ms
        //configSplash.setRevealFlagX(com.viksaa.sssplash.lib.cnst.Flags.REVEAL_RIGHT);  //or Flags.REVEAL_LEFT
        //configSplash.setRevealFlagY(com.viksaa.sssplash.lib.cnst.Flags.REVEAL_BOTTOM); //or Flags.REVEAL_TOP


        //Choose LOGO OR PATH; if you don't provide String value for path it's logo by default

        //Customize Logo
        configSplash.setLogoSplash(getResource("drawable", "splash_logo")); //or any other drawable
        configSplash.setAnimLogoSplashDuration(2000); //int ms
        //configSplash.setAnimLogoSplashTechnique(com.daimajia.androidanimations.library.Techniques.Bounce); //choose one form Techniques (ref: https://github.com/daimajia/AndroidViewAnimations)

        const title = "SampleThat"  //SplashScreen Title
        //Customize Title
        configSplash.setTitleSplash(title);
        configSplash.setTitleTextColor(getResource("color","md_white_1000"));
        configSplash.setTitleTextSize(30);
        configSplash.setAnimTitleDuration(0500); //int ms
        configSplash.setAnimTitleTechnique(com.daimajia.androidanimations.library.Techniques.FlipInX);
        configSplash.setTitleFont("app/fonts/future.ttf"); //provide string to your font located in app/fonts/

    },
    animationsFinished: function () {
        const intent = new android.content.Intent(app.android.context, java.lang.Class.forName("com.tns.NativeScriptActivity"))
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        app.android.foregroundActivity.startActivity(intent);
    }
});

function getResource(type,name){
    return app.android.context.getResources().getIdentifier(name, type, app.android.context.getPackageName());
}​
