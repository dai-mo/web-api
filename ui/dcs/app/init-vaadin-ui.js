
var ignoreVaadin = getUrlValue('igv');

//<![CDATA[
    if (typeof ignoreVaadin == 'undefined' && !window.vaadin)
      alert("Failed to load the bootstrap JavaScript: "+
        "../VAADIN/vaadinBootstrap.js");

    /* The UI Configuration */
    window.vaadin.initApplication("vapp-mobilise", {
      "browserDetailsUrl": "../vapp/mobilise/",      
      "serviceUrl": "../vapp/mobilise/",
      "widgetset": "org.dcs.MyAppWidgetset",
      "theme": "mytheme",
      "versionInfo": {"vaadinVersion": "7.5.10"},
      "vaadinDir": "../VAADIN/",
      "heartbeatInterval": 300,
      "debug": true,
      "standalone": false,
      "authErrMsg": {
        "message": "Take note of any unsaved data, "+
        "and <u>click here<\/u> to continue.",
        "caption": "Authentication problem"
      },
      "comErrMsg": {
        "message": "Take note of any unsaved data, "+
        "and <u>click here<\/u> to continue.",
        "caption": "Communication problem"
      },
      "sessExpMsg": {
        "message": "Take note of any unsaved data, "+
        "and <u>click here<\/u> to continue.",
        "caption": "Session Expired"
      }
    });

    window.vaadin.initApplication("vapp-visualise", {
      "browserDetailsUrl": "../vapp/",
      "serviceUrl": "../vapp/",
      "widgetset": "org.dcs.MyAppWidgetset",
      "theme": "mytheme",
      "versionInfo": {"vaadinVersion": "7.5.10"},
      "vaadinDir": "../VAADIN/",
      "heartbeatInterval": 300,
      "debug": true,
      "standalone": false,
      "authErrMsg": {
        "message": "Take note of any unsaved data, "+
        "and <u>click here<\/u> to continue.",
        "caption": "Authentication problem"
      },
      "comErrMsg": {
        "message": "Take note of any unsaved data, "+
        "and <u>click here<\/u> to continue.",
        "caption": "Communication problem"
      },
      "sessExpMsg": {
        "message": "Take note of any unsaved data, "+
        "and <u>click here<\/u> to continue.",
        "caption": "Session Expired"
      }
    });

    window.vaadin.initApplication("vapp-analyse", {
      "browserDetailsUrl": "../vapp/",
      "serviceUrl": "../vapp/",
      "widgetset": "org.dcs.MyAppWidgetset",
      "theme": "mytheme",
      "versionInfo": {"vaadinVersion": "7.5.10"},
      "vaadinDir": "../VAADIN/",
      "heartbeatInterval": 300,
      "debug": true,
      "standalone": false,
      "authErrMsg": {
        "message": "Take note of any unsaved data, "+
        "and <u>click here<\/u> to continue.",
        "caption": "Authentication problem"
      },
      "comErrMsg": {
        "message": "Take note of any unsaved data, "+
        "and <u>click here<\/u> to continue.",
        "caption": "Communication problem"
      },
      "sessExpMsg": {
        "message": "Take note of any unsaved data, "+
        "and <u>click here<\/u> to continue.",
        "caption": "Session Expired"
      }
    });    
    //]]>