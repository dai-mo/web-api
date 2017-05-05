import {MenuItem} from "primeng/primeng"
/**
 * Created by cmathew on 04.05.17.
 */


export interface ContextMenu {
  mcItems(): MenuItem[]
  onTrigger(mcItem: MenuItem): void
  addCMItem(mcItem: MenuItem): void
}