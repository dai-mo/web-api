import {Injectable} from "@angular/core"
import {BehaviorSubject, Observable} from "rxjs/Rx"
import {FlowInstance, FlowTab} from "../analyse/flow.model"

@Injectable()
export class UIStateStore {

  private _selectedProcessorId: BehaviorSubject<string> = new BehaviorSubject(null)
  private _flowInstanceToAdd: BehaviorSubject<FlowInstance> = new BehaviorSubject(null)
  private _flowTabs:BehaviorSubject<FlowTab[]> = new BehaviorSubject([])

  private store: {
    flowTabs : FlowTab[]
  }

  constructor() {
    this.store = {
      flowTabs: []
    }
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


}