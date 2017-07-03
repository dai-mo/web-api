import {Injectable} from "@angular/core"
import {UIStateStore} from "../ui.state.store"
import {Msg, MsgGroup} from "../ui.models"
/**
 * Created by cmathew on 14/07/16.
 */

@Injectable()
export class ErrorService {

    constructor(private uiStateStore: UIStateStore) {}

    handleError(error: any) {
        let errorBody = JSON.parse(error._body)

        if ((<ErrorResponse>errorBody).code) {

            let msg: Msg = {
                severity: "error",
                summary: errorBody.message,
                detail: errorBody.errorMessage
            }
            let msgGroup: MsgGroup = {
                messages: [msg],
                sticky: false,
                delay: 3000
            }
            this.uiStateStore
              .setDisplayMessages(msgGroup)
        }
    }

}

export class ErrorResponse {
    code: string
    message: string
    httpStatusCode: number
    errorMessage: string
}