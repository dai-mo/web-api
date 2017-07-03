import {BehaviorSubject, Observable} from "rxjs/Rx"
import {NgZone} from "@angular/core"
import {Record} from "immutable"

/**
 * Created by cmathew on 01.07.17.
 */

export class State<T> {

  private _state: BehaviorSubject<T>
  private ngZone: NgZone
  state: Observable<T>

  constructor(initialState: T,
              ngZone: NgZone) {
    this._state = new BehaviorSubject(initialState)
    this.state = this._state.asObservable()
    this.ngZone = ngZone

  }

  getState(): T {
    return this._state.getValue()
  }

  setState(state: T) {
    this.ngZone.run(() => this._state.next(state))
  }

}

export class Rec<T> extends Record({}) {


  constructor(params?: T) {
    params ? super(params) : super()
  }

  with(values: T): Rec<T> {
    return this.merge(values) as this
  }
}

