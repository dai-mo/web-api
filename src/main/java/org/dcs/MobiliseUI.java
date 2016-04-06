package org.dcs;

import javax.servlet.annotation.WebServlet;

import com.vaadin.annotations.Theme;
import com.vaadin.annotations.VaadinServletConfiguration;
import com.vaadin.annotations.Widgetset;
import com.vaadin.server.VaadinRequest;
import com.vaadin.server.VaadinServlet;
import com.vaadin.ui.Button;
import com.vaadin.ui.Button.ClickEvent;
import com.vaadin.ui.Label;
import com.vaadin.ui.UI;
import com.vaadin.ui.VerticalLayout;

/**
 *
 */
@Theme("mytheme")
@Widgetset("org.dcs.MyAppWidgetset")
public class MobiliseUI extends UI {

    @Override
    protected void init(VaadinRequest vaadinRequest) {     
        setContent(new TabularView());

    }

    @WebServlet(value = "/vapp/mobilise/*", name = "MobiliseUIServlet", asyncSupported = true)
    @VaadinServletConfiguration(ui = MobiliseUI.class, productionMode = false)
    public static class MobiliseUIServlet extends VaadinServlet {
    }
}
