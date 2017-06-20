import {Component, Input, OnInit} from "@angular/core"
import {Processor} from "../analyse/flow.model"
import {AvroSchema, AvroSchemaField, AvroSchemaType, SchemaService} from "./schema.service"
import {TreeNode} from "primeng/primeng"
/**
 * Created by cmathew on 23.05.17.
 */

@Component({
  selector: "schema-panel",
  templateUrl: "partials/schemapanel.html"
})
export class SchemaPanelComponent  implements OnInit {

  @Input() processor: Processor
  baseSchema: AvroSchema

  nodes: TreeNode[] = []

  selectedNodes: TreeNode[] = []



  constructor(private schemaService: SchemaService) {}

  ngOnInit(): void {
    this.selectedNodes = []
    this.baseSchema = this.schemaService.baseSchema(this.processor.properties)
    let writeSchema = this.schemaService.writeSchema(this.processor.properties)
    let rootNode: TreeNode = {label: "$"}
    rootNode.expanded = true
    this.selectedNodes.push(rootNode)

    if(this.schemaService.isSameNamespaceId(this.baseSchema, writeSchema))
      this.buildTree(this.baseSchema, writeSchema, rootNode)
    else
      this.buildTree(this.baseSchema, this.baseSchema, rootNode)
    this.nodes.push(rootNode)
  }

  buildTree(baseSchemaType: AvroSchemaType, writeSchemaType: AvroSchemaType, parentTreeNode: TreeNode) {
    if(baseSchemaType.fields.length === 0) return

    let children: TreeNode[] = baseSchemaType.fields.map(f => {
      let child: TreeNode
      let writeField: any
      if(writeSchemaType) {
        writeField = writeSchemaType.fields.find(
          wf => AvroSchemaField.equals(wf, f))
      }
      if(f.type instanceof Array) {
        child = {label: f.name + " [" + f.type[1] + "]", leaf: true}
        if(writeField)
          this.selectedNodes.push(child)
      } else {
        child = {label: f.name,leaf: false}
        if(writeField)
          this.buildTree(f.type, writeField.type, child)
        else
          this.buildTree(f.type, undefined, child)
      }
      child.expanded = true
      return child
    })
    parentTreeNode.children = children
  }
}

