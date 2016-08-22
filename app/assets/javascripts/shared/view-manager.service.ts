/**
 * Created by cmathew on 15/08/16.
 */

import {Injectable} from "@angular/core"

@Injectable()
export class ViewManagerService {
  public selectedProcessorId: string = null
  public awaitingProcessorOutput: boolean = false
}
