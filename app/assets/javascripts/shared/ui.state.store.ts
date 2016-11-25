import {Injectable} from "@angular/core"
import {BehaviorSubject, Observable} from "rxjs/Rx"
import {FlowInstance, FlowTab, Provenance, VisTab} from "../analyse/flow.model"

@Injectable()
export class UIStateStore {

  private _resizeView: BehaviorSubject<MouseEvent> = new BehaviorSubject(null)

  private _selectedProcessorId: BehaviorSubject<string> = new BehaviorSubject(null)

  private _flowInstanceToAdd: BehaviorSubject<FlowInstance> = new BehaviorSubject(null)
  private _flowTabs:BehaviorSubject<FlowTab[]> = new BehaviorSubject([])

  private _provenances: BehaviorSubject<Provenance[]> = new BehaviorSubject([])
  private _provenancesUpdated: BehaviorSubject<boolean> = new BehaviorSubject(false)

  private _selectedVisType: BehaviorSubject<string> = new BehaviorSubject(null)


  private store: {
    flowTabs : FlowTab[],
    visTabs: VisTab[]
  }

  constructor() {
    this.store = {
      flowTabs: [],
      visTabs: []
    }
  }

  resizeView: Observable<MouseEvent> = this._resizeView.asObservable()

  setResizeView(event: MouseEvent) {
    this._resizeView.next(event)
  }

  selectedProcessorId: Observable<string> = this._selectedProcessorId.asObservable()

  setSelectedProcessorId(processorId: string) {
    this._selectedProcessorId.next(processorId)
  }

  flowInstanceToAdd: Observable<FlowInstance> = this._flowInstanceToAdd.asObservable()

  setFlowInstanceToAdd(flowInstance: FlowInstance) {
    this._flowInstanceToAdd.next(flowInstance)
  }

  flowTabs: Observable<FlowTab[]> = this._flowTabs.asObservable()

  getFlowTabs(): Array<FlowTab> {
    return this._flowTabs.getValue()
  }

  addFlowTab(flowTab: FlowTab) {
    this.store.flowTabs.push(flowTab)
    this._flowTabs.next(this.store.flowTabs)
  }

  removeFlowTab(flowTab: FlowTab) {
    this.store.flowTabs.filter((t: FlowTab) => t.id === flowTab.id)
      .forEach((t: FlowTab) => this.store.flowTabs.splice(this.store.flowTabs.indexOf(flowTab), 1))
    this._flowTabs.next(this.store.flowTabs)
  }

  updateFlowTabs() {
    this._flowTabs.next(this.store.flowTabs)
  }

  addFlowTabs(flowTabs: FlowTab[]) {
    this.store.flowTabs = flowTabs
    this._flowTabs.next(this.store.flowTabs)
  }

  provenancesUpdated: Observable<boolean> = this._provenancesUpdated.asObservable()

  hasProvenances(): boolean {
    return this._provenances != null && this.getProvenances().length > 0
  }

  provenances = this._provenances.asObservable()

  getProvenances(): Provenance[] { return this._provenances.getValue() }

  setProvenances(provenances: Provenance[]) {

    this._provenances.next(provenances)
    let p = this.hasProvenances()
    this._provenancesUpdated.next(p)
  }

  selectedVisType: Observable<string> = this._selectedVisType.asObservable()

  setSelectedVisType(visType: string) {
    this._selectedVisType.next(visType)
  }

  addVisTab(visTab: VisTab) {
    this.store.visTabs.push(visTab)
  }

  removeVisTab(visTab: VisTab) {
    this.store.visTabs.filter((t: VisTab) => t.visType === visTab.visType)
      .forEach((t: VisTab) => this.store.visTabs.splice(this.store.visTabs.indexOf(visTab), 1))
  }

}