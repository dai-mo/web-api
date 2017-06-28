import {Component, Input, OnInit} from "@angular/core"
import {Processor} from "../analyse/flow.model"
import {AvroSchema, AvroSchemaField, AvroSchemaType, SchemaAction, SchemaService} from "./schema.service"
import {TreeNode} from "primeng/primeng"
import {Observable} from "rxjs/Rx"
import {ErrorService} from "./util/error.service"
import {UIStateStore} from "./ui.state.store"
/**
 * Created by cmathew on 23.05.17.
 */

@Component({
  selector: "schema-panel",
  templateUrl: "partials/schemapanel.html"
})
export class SchemaPanelComponent  implements OnInit {

  @Input() processor: Processor
  @Input() selectionMode: string

  baseSchema: Observable<AvroSchema>

  schemaNamespace: string
  schemaName: string

  nodes: TreeNode[] = []

  selectedNodes: TreeNode[] = []
  initialNodes: TreeNode[] = []

  schemaFieldPathsToCheck: string[] = []

  constructor(private schemaService: SchemaService,
              private uiStateStore: UIStateStore,
              private errorService:ErrorService) {}

  ngOnInit(): void {
    this.selectedNodes = []
    this.baseSchema = this.schemaService.baseSchema(this.processor.properties)
    let outputSchema = this.schemaService.outputSchema(this.processor.properties)
    let rootNode: TreeNode = {label: "$"}
    rootNode.expanded = true
    this.addSelectedNode(rootNode)

    this.baseSchema.flatMap(bs => outputSchema.map(ws => [bs,ws])).
    subscribe(
      (bws: [AvroSchema, AvroSchema]) => {
        this.schemaNamespace = bws[0].namespace
        this.schemaName = bws[0].name
        this.buildTree(bws[0], bws[1], rootNode)
      },
      (error: any) =>  {
        this.errorService.handleError(error)
      }
    )
    this.nodes.push(rootNode)
  }

  addSelectedNode(node: TreeNode) {
    this.selectedNodes.push(node)
    this.initialNodes.push(node)
  }

  buildTree(baseSchemaType: AvroSchemaType, writeSchemaType: AvroSchemaType, parentTreeNode: TreeNode) {

    let children: TreeNode[] = baseSchemaType.fields.map((f: AvroSchemaField) => {
      let child: TreeNode
      let writeField: any
      if(writeSchemaType !== undefined) {
        writeField = writeSchemaType.fields.find(
          (wf: AvroSchemaField) => AvroSchemaField.equals(wf, f))
      }
      if(f.type instanceof Array || typeof f.type === "string") {
        child = {label: f.name + " [" + AvroSchemaField.typeAsString(f) + "]", leaf: true}
        if(writeField !== undefined)
          this.addSelectedNode(child)
      } else {
        child = {label: f.name, leaf: false}
        if(writeField !== undefined) {
          this.addSelectedNode(child)
          this.buildTree(f.type, writeField.type, child)
        }
        else
          this.buildTree(f.type, undefined, child)
      }
      child.expanded = true
      child.data = f
      return child
    })
    parentTreeNode.children = children
  }

  updateNode(event: any) {
    this.uiStateStore.setSchemaUpdatable(this.canUpdate())
  }

  // FIXME: Should use schema paths to test equality

  nodesToRemove(): TreeNode[] {
    return this.initialNodes.
    filter(n => this.selectedNodes.find(sn => sn === n) === undefined).
    filter(n => n.partialSelected === undefined || !n.partialSelected)
  }

  nodesToAdd(): TreeNode[] {
    let nodes = this.selectedNodes.
    filter(sn => this.initialNodes.find(n => sn === n) === undefined).
    filter(sn => sn.partialSelected === undefined || !sn.partialSelected)

    return nodes
  }

  schemaFieldPath(node: TreeNode): string {
    if(node.parent === undefined)
      return node.label
    else
      return this.schemaFieldPath(node.parent) + "." + node.data.name
  }

  schemaActionFromTreeNodeToUpdate(node: TreeNode, action: string, path: string): SchemaAction {
    return new SchemaAction(action, path, JSON.parse(JSON.stringify(node.data)))
  }

  schemaActions(): SchemaAction[] {
    return this.cleanSchemaActions(
      this.nodesToRemove()
        .map(n => this.schemaActionFromTreeNodeToUpdate(n, "rem", this.schemaFieldPath(n)))
        .concat(this.nodesToAdd()
          .map(n => this.schemaActionFromTreeNodeToUpdate(n, "add", this.schemaFieldPath(n.parent)))))
  }

  cleanSchemaActions(schemaActions: SchemaAction[]): SchemaAction[] {
    let actions: SchemaAction[] = []
    schemaActions.
    forEach(sa => {
      if(schemaActions
          .find(a => sa.avroPath !== a.avroPath && sa.avroPath.startsWith(a.avroPath)) === undefined) {
        // if(sa.field.type instanceof Array)
        //   sa.field.type = sa.field.type[1]
        // if((<AvroSchemaType>sa.field.type).type) {
        //   sa.field.schemaType = (<AvroSchemaType>sa.field.type)
        //   sa.field.type = null
        // } else {
        //   sa.field.schemaType = null
        // }
        actions.push(sa)
      }
    })
    return actions
  }

  updateSchema(): Observable<Processor[]> {
    return this.schemaService.updateSchema(this.uiStateStore.getActiveFlowTab().flowInstance.id,
      this.processor.id,
      this.schemaActions())
  }

  canUpdate(): boolean { return this.initialNodes.length !== this.selectedNodes.length }
}

