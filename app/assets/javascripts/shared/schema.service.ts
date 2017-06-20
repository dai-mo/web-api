/**
 * Created by cmathew on 23.05.17.
 */

import {Injectable} from "@angular/core"
import {ProcessorProperties} from "../analyse/flow.model"


export class AvroSchemaField {
  name: string
  type: string[] | AvroSchemaType
  default: string | boolean | number

  static equals(fa:AvroSchemaField, fb: AvroSchemaField): boolean {
    if(!fa && !fb) return true
    if(!fa || !fb) return false
    let fat: string[] | AvroSchemaType = fa.type
    let fbt: string[] | AvroSchemaType = fb.type
    if(fat instanceof Array && fbt instanceof Array){
      if(fa.name === fb.name && fat[1] === fbt[1]) return true
    }
    return false
  }
}

export class AvroSchemaType {
  type: string
  name: string
  fields: AvroSchemaField[]
}

export class AvroSchema extends AvroSchemaType {
  namespace: string
}



@Injectable()
export class SchemaService {

  schema(schemaId: string): AvroSchema {
    return {
      "namespace": "org.dcs.processor",
      "type": "record",
      "name": "GBIFOccurrence",
      "fields": [
        {"name": "scientificName",   "type": ["null", "string"], "default": null},
        {"name": "decimalLongitude", "type": ["null", "double"], "default": null},
        {"name": "decimalLatitude",  "type": ["null", "double"], "default": null},
        {"name": "institutionCode",  "type": ["null", "string"], "default": null},
        {"name": "institutionCode1",  "type": ["null", "string"], "default": null},
        {"name": "scientificName1",   "type": ["null", "string"], "default": null},
        {"name": "decimalLongitude1", "type": ["null", "double"], "default": null},
        {"name": "decimalLatitude1",  "type": ["null", "double"], "default": null},
        {"name": "institutionCode2",  "type": ["null", "string"], "default": null},
        {"name": "institutionCode3",  "type": ["null", "string"], "default": null},
        {"name": "scientificName2",   "type": ["null", "string"], "default": null},
        {"name": "decimalLongitude2", "type": ["null", "double"], "default": null},
        {"name": "decimalLatitude2",  "type": ["null", "double"], "default": null},
        {"name": "institutionCode4",  "type": ["null", "string"], "default": null},
        {"name": "institutionCode5",  "type": ["null", "string"], "default": null}
      ]
    }
  }

  wSchema: AvroSchema = {
    "namespace": "org.dcs.processor",
    "type": "record",
    "name": "GBIFOccurrence",
    "fields": [
      {"name": "scientificName",   "type": ["null", "string"], "default": null},
      {"name": "decimalLongitude", "type": ["null", "double"], "default": null},
      {"name": "decimalLatitude",  "type": ["null", "double"], "default": null},
      {"name": "institutionCode",  "type": ["null", "string"], "default": null}

    ]
  }

  isSameNamespaceId(schema: AvroSchema, schemaToCompare: AvroSchema): boolean {
    if(schema && schemaToCompare &&
      schema.namespace === schemaToCompare.namespace && schema.name === schemaToCompare.name)
      return true
    else
      return false
  }

  baseSchema(processorProperties: ProcessorProperties): AvroSchema {
    let readSchema: AvroSchema = this.readSchema(processorProperties)

    let writeSchema: AvroSchema = this.writeSchema(processorProperties)

    if(this.isSameNamespaceId(readSchema, writeSchema))
      return readSchema

    return writeSchema
  }

  outputSchema(processorProperties: ProcessorProperties): AvroSchema {
    let readSchema: AvroSchema = this.readSchema(processorProperties)

    let writeSchema: AvroSchema = this.writeSchema(processorProperties)

    if(writeSchema) return writeSchema

    return readSchema
  }

  readSchema(processorProperties: ProcessorProperties): AvroSchema {
    if(processorProperties._READ_SCHEMA_ID)
      return this.schema(processorProperties._READ_SCHEMA_ID)

    if(processorProperties._READ_SCHEMA)
      return JSON.parse(processorProperties._READ_SCHEMA)

    return undefined
  }

  writeSchema(processorProperties: ProcessorProperties): AvroSchema {
    return this.wSchema

    // if(processorProperties._WRITE_SCHEMA_ID)
    //   return this.schema(processorProperties._READ_SCHEMA_ID)
    //
    // if(processorProperties._WRITE_SCHEMA)
    //   return JSON.parse(processorProperties._READ_SCHEMA)
    //
    // return undefined
  }
}