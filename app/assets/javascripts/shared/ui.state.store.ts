import {Injectable, NgZone} from "@angular/core"
import {BehaviorSubject, Observable} from "rxjs/Rx"
import {FlowInstance, FlowCreation, FlowTab, Provenance, VisTab, EntityType} from "../analyse/flow.model"
import {UiId, ViewsVisible} from "./ui.models"
import {ContextStore} from "./context.store"

@Injectable()
export class UIStateStore {

  private store: {
    flowTabs: FlowTab[],
    visTabs: VisTab[]
  }

  constructor(private contextStore: ContextStore,
              private ngZone: NgZone) {
    this.store = {
      flowTabs: [],
      visTabs: []
    }
  }

  private _viewsVisible: BehaviorSubject<ViewsVisible> = new BehaviorSubject(new ViewsVisible())

  viewsVisible: Observable<ViewsVisible> = this._viewsVisible.asObservable()

  setViewsVisible(viewsVisible: ViewsVisible) {
    this.ngZone.run(() => this._viewsVisible.next(viewsVisible))
  }

  makeViewVisible(view: string) {
    let vv = this._viewsVisible.getValue()
    switch(view) {
      case UiId.ANALYSE:
        vv.analyse = true
        break
      case UiId.MOBILISE:
        vv.mobilise = true
        break
      case UiId.VISUALISE:
        vv.visualise = true
        break
    }
    this.setViewsVisible(vv)
  }

  maximiseView(view: string) {
    let vv = new ViewsVisible()
    switch(view) {
      case UiId.ANALYSE:
        vv.mobilise = false
        vv.visualise = false
        break
      case UiId.MOBILISE:
        vv.analyse = false
        vv.visualise = false
        break
      case UiId.VISUALISE:
        vv.analyse = false
        vv.mobilise = false
        break
    }
    this.setViewsVisible(vv)
  }

  private _resizeView: BehaviorSubject<MouseEvent> = new BehaviorSubject(null)

  resizeView: Observable<MouseEvent> = this._resizeView.asObservable()

  setResizeView(event: any) {
    this.ngZone.run(() => this._resizeView.next(event))
  }

  private _selectedProcessorId: BehaviorSubject<string> = new BehaviorSubject(null)

  selectedProcessorId: Observable<string> = this._selectedProcessorId.asObservable()

  setSelectedProcessorId(processorId: string) {
    this.contextStore.getContextBarItems(UiId.ANALYSE)
      .forEach(cbItem => {
        if(cbItem.entityType === EntityType.PROCESSOR)
          if(processorId === null)
            cbItem.hidden = true
          else
            cbItem.hidden = false
        else
          if(processorId === null)
            cbItem.hidden = false
          else
            cbItem.hidden = true
      })
    this.ngZone.run(() => this._selectedProcessorId.next(processorId))
  }

  getSelectedProcessorId(): string {
    return this._selectedProcessorId.getValue()
  }

  private _flowInstanceToAdd: BehaviorSubject<FlowInstance> = new BehaviorSubject(null)

  flowInstanceToAdd: Observable<FlowInstance> = this._flowInstanceToAdd.asObservable()

  setFlowInstanceToAdd(flowInstance: FlowInstance) {
    this._flowInstanceToAdd.next(flowInstance)
  }

  private _flowTabs:BehaviorSubject<FlowTab[]> = new BehaviorSubject([])
  flowTabs: Observable<FlowTab[]> = this._flowTabs.asObservable()

  getFlowTabs(): Array<FlowTab> {
    return this._flowTabs.getValue()
  }


  addFlowTab(flowTab: FlowTab) {
    this.store.flowTabs.push(flowTab)
    this.ngZone.run(() => this._flowTabs.next(this.store.flowTabs))
  }

  removeFlowTab(flowTab: FlowTab) {
    this.store.flowTabs.filter((t: FlowTab) => t.id === flowTab.id)
      .forEach((t: FlowTab) => this.store.flowTabs.splice(this.store.flowTabs.indexOf(flowTab), 1))
    this.ngZone.run(() => this._flowTabs.next(this.store.flowTabs))
  }

  updateFlowTabs() {
    this.ngZone.run(() => this._flowTabs.next(this.store.flowTabs))
  }

  addFlowTabs(flowTabs: FlowTab[]) {
    this.store.flowTabs = flowTabs
    this.ngZone.run(() => this._flowTabs.next(this.store.flowTabs))
  }

  private _visTabs:BehaviorSubject<VisTab[]> = new BehaviorSubject([])

  visTabs: Observable<VisTab[]> = this._visTabs.asObservable()

  visTabsWoMap: Observable<VisTab[]> = this.visTabs.map(vts =>
    vts.filter((t: VisTab) => t.visType !== UiId.VIS_MAP))

  mapVisTab: Observable<VisTab> = this.visTabs.map(vts =>
    vts.find((t: VisTab) => t.visType === UiId.VIS_MAP))

  addVisTab(visTab: VisTab) {
    this.store.visTabs.push(visTab)
    this.ngZone.run(() => this._visTabs.next(this.store.visTabs))
  }

  removeVisTab(visTab: VisTab) {
    this.store.visTabs.filter((t: VisTab) => t.visType === visTab.visType)
      .forEach((t: VisTab) => this.store.visTabs.splice(this.store.visTabs.indexOf(visTab), 1))
    this.ngZone.run(() => this._visTabs.next(this.store.visTabs))
  }

  getVisTabs():VisTab[] {
    return this._visTabs.getValue()
  }

  public setActiveVisTab(visTab: VisTab):void {
    visTab.active = true
    this.store.visTabs.forEach(t => {
      if(t !== visTab)
        t.active = false
    })
  }

  private _selectedVisType: BehaviorSubject<string> = new BehaviorSubject("")

  selectedVisType: Observable<string> = this._selectedVisType.asObservable()

  selectVisType(visType: string) {
    this.ngZone.run(() => this._selectedVisType.next(visType))
  }

  private _provenances: BehaviorSubject<Provenance[]> = new BehaviorSubject([])

  private _provenancesUpdated: BehaviorSubject<boolean> = new BehaviorSubject(false)

  provenancesUpdated: Observable<boolean> = this._provenancesUpdated.asObservable()

  hasProvenances(): boolean {
    return this._provenances != null && this.getProvenances().length > 0
  }

  provenances = this._provenances.asObservable()

  getProvenances(): Provenance[] { return this._provenances.getValue() }

  setProvenances(provenances: Provenance[]) {

    this.ngZone.run(() => this._provenances.next(provenances))
    let p = this.hasProvenances()
    this.ngZone.run(() => this._provenancesUpdated.next(p))
  }


  private _flowInstantiation: BehaviorSubject<FlowCreation> = new BehaviorSubject({instantiationId: undefined})
  flowInstantiationObs: Observable<FlowCreation> = this._flowInstantiation.asObservable()
  updateFlowInstantiationId(flowInstantiationId: string) {
    this.ngZone.run(() => this._flowInstantiation.next({instantiationId: flowInstantiationId}))
  }

  // ---- Dialog Flags Start ----
  public isTemplateInfoDialogVisible: boolean = false
  public isProcessorSchemaDialogVisible: boolean = false
  // ---- Dialog Flags End   ----

}