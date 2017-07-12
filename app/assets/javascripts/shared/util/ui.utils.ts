import {FlowInstance, FlowTab} from "../../analyse/flow.model"
import * as SI from "seamless-immutable"
import {isEmpty} from "rxjs/operator/isEmpty"

/**
 * Created by cmathew on 14/07/16.
 */

export class UIUtils {
  static toFlowTab(flowInstance: FlowInstance): FlowTab {
    return SI.from(new FlowTab("#",
      flowInstance.id,
      flowInstance.name,
      flowInstance))
  }
}

export class JSUtils {

  static isEmpty(obj: any): boolean {
    for (let x in obj)
      return false
    return true
  }

  static isUndefinedOrEmpty(obj: any): boolean {
    return obj === undefined || JSUtils.isEmpty(obj)
  }
}


