import {platformBrowserDynamic} from "@angular/platform-browser-dynamic"
import {NgModule} from "@angular/core"
import {HttpModule} from "@angular/http"
import {App} from "./app.component"
import {ErrorService} from "./shared/util/error.service"
import {FlowService} from "./shared/flow.service"
import {ViewManagerService} from "./shared/view-manager.service"
import {BrowserModule} from "@angular/platform-browser"
import {DataTableModule,SharedModule} from "primeng/primeng"
import {OverlayPanelModule} from "primeng/components/overlaypanel/overlaypanel"
import {MultiSelectModule} from "primeng/components/multiselect/multiselect"
import {DropdownModule} from "primeng/components/dropdown/dropdown"
import {SelectButtonModule} from "primeng/components/selectbutton/selectbutton"
import {InputTextModule} from "primeng/components/inputtext/inputtext"
import {ButtonModule} from "primeng/components/button/button"
import {PaginatorModule} from "primeng/components/paginator/paginator"
import {OrderListModule} from "primeng/components/orderlist/orderlist"
import {MessagesModule} from "primeng/components/messages/messages"
import {MenubarModule} from "primeng/components/menubar/menubar"
import {MenuModule} from "primeng/components/menu/menu"
import {MegaMenuModule} from "primeng/components/megamenu/megamenu"
import {ListboxModule} from "primeng/components/listbox/listbox"
import {LightboxModule} from "primeng/components/lightbox/lightbox"
import {InputTextareaModule} from "primeng/components/inputtextarea/inputtextarea"
import {InputSwitchModule} from "primeng/components/inputswitch/inputswitch"
import {DataGridModule} from "primeng/components/datagrid/datagrid"
import {ContextMenuModule} from "primeng/components/contextmenu/contextmenu"
import {CodeHighlighterModule} from "primeng/components/codehighlighter/codehighlighter"
import {CheckboxModule} from "primeng/components/checkbox/checkbox"
import {ChartModule} from "primeng/components/chart/chart"
import {CarouselModule} from "primeng/components/carousel/carousel"
import {CalendarModule} from "primeng/components/calendar/calendar"
import {BreadcrumbModule} from "primeng/components/breadcrumb/breadcrumb"
import {AutoCompleteModule} from "primeng/components/autocomplete/autocomplete"
import {AccordionModule} from "primeng/components/accordion/accordion"
import {ReactiveFormsModule, FormsModule} from "@angular/forms"
import {DataListModule} from "primeng/components/datalist/datalist"
import {DataScrollerModule} from "primeng/components/datascroller/datascroller"
import {DialogModule} from "primeng/components/dialog/dialog"
import {DragDropModule} from "primeng/components/dragdrop/dragdrop"
import {EditorModule} from "primeng/components/editor/editor"
import {FieldsetModule} from "primeng/components/fieldset/fieldset"
import {GalleriaModule} from "primeng/components/galleria/galleria"
import {GMapModule} from "primeng/components/gmap/gmap"
import {GrowlModule} from "primeng/components/growl/growl"
import {InputMaskModule} from "primeng/components/inputmask/inputmask"
import {PanelModule} from "primeng/components/panel/panel"
import {PanelMenuModule} from "primeng/components/panelmenu/panelmenu"
import {PasswordModule} from "primeng/components/password/password"
import {PickListModule} from "primeng/components/picklist/picklist"
import {ProgressBarModule} from "primeng/components/progressbar/progressbar"
import {RadioButtonModule} from "primeng/components/radiobutton/radiobutton"
import {RatingModule} from "primeng/components/rating/rating"
import {ScheduleModule} from "primeng/components/schedule/schedule"
import {SlideMenuModule} from "primeng/components/slidemenu/slidemenu"
import {SliderModule} from "primeng/components/slider/slider"
import {SpinnerModule} from "primeng/components/spinner/spinner"
import {SplitButtonModule} from "primeng/components/splitbutton/splitbutton"
import {TabMenuModule} from "primeng/components/tabmenu/tabmenu"
import {TabViewModule} from "primeng/components/tabview/tabview"
import {TerminalModule} from "primeng/components/terminal/terminal"
import {TieredMenuModule} from "primeng/components/tieredmenu/tieredmenu"
import {ToggleButtonModule} from "primeng/components/togglebutton/togglebutton"
import {ToolbarModule} from "primeng/components/toolbar/toolbar"
import {TooltipModule} from "primeng/components/tooltip/tooltip"
import {TreeModule} from "primeng/components/tree/tree"
import {TreeTableModule} from "primeng/components/treetable/treetable"

@NgModule({
  declarations: [App],
  providers:[{provide: Window, useValue: window},
    FlowService,
    ViewManagerService,
    ErrorService,],
  imports: [BrowserModule,
    HttpModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    CodeHighlighterModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    GalleriaModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule],
  bootstrap: [App]

})
export class AppModule {

}

platformBrowserDynamic().bootstrapModule(AppModule)