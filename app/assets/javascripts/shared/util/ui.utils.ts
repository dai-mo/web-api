import {FlowInstance, FlowTab} from "../../analyse/flow.model"
import * as SI from "seamless-immutable"

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


