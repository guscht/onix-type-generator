import * as fs from 'fs';
import * as path from 'path';
import { XMLParser } from 'fast-xml-parser';

function readXSD(filePath: string): Object {
  const xsdContent =  fs.readFileSync(filePath, 'utf-8');

  const parser = new XMLParser({
    ignoreAttributes: false
  });
  const parsed = parser.parse(xsdContent);

  const schema = parsed['xs:schema'];
  if (!schema) throw new Error('Invalid XSD file: Missing xs:schema');

  return schema
}


function getShortNameDecoding(element: Object): shortnameDec {
  const propertyNames = Object.getOwnPropertyNames(element).filter(name => name.startsWith('xs:'))
  for (const propertyName of propertyNames) {
    if (propertyName === 'xs:attribute') {
      if (element['xs:attribute'].length == 2) {
        let refname = ''
        let shortname = ''
        let base = element?.['@_base']
        for (const attribute of element['xs:attribute']) {
          if (attribute['@_name'] === 'refname') {
            refname = attribute['xs:simpleType']['xs:restriction']['xs:enumeration']['@_value']
          }
          if (attribute['@_name'] === 'shortname') {
            shortname = attribute['xs:simpleType']['xs:restriction']['xs:enumeration']['@_value']
          }
        }
        return {'elementname': undefined, 'shortname': shortname, 'refname': refname, 'base': base}
      } else {
        throw new TypeError("There should be exactly two attributes.");
      }
    } else {
      const dec = getShortNameDecoding(element[propertyName])
      if (dec !== undefined) {
        return dec
      }
    }
  }
}

type shortnameDec = {elementname: string, shortname: string, refname: string, base: string}

function getShortnameArray(schema: Object): shortnameDec[] {
  const shortnameDecArray: shortnameDec[] = [];

  // Iterate over elements in schema to get shortname and refname
  const elements = Array.isArray(schema['xs:element'])
    ? schema['xs:element']
    : [schema['xs:element']];
  for (const element of elements) {
    if (!element) continue;
    const shortnameDecoding = getShortNameDecoding(element)
    shortnameDecoding.elementname = element['@_name']
    if (shortnameDecoding.elementname != shortnameDecoding.shortname) {
      console.log(shortnameDecoding)
    }
    shortnameDecArray.push(shortnameDecoding)
  }

  return shortnameDecArray
}

function generateShortnameEnum(schema: Object): string {

  const shortnameArray = getShortnameArray(schema)

  // Create shortname enum
  const enumEntries = shortnameArray.map((value: shortnameDec) => {
      if (value.base !== undefined) {
        return `  ${value.shortname} = "${value.refname}",  // elementName: ${value.elementname} // base: ${value.base}`
      }
      return `  ${value.shortname} = "${value.refname}", // elementName: ${value.elementname} `
    })
  const enumContent = `export enum shortnames {\n${enumEntries.join("\n")}\n}\n`

  return enumContent
}

// Helper function to format a string as a valid TypeScript enum key
const formatEnumKey = (key: string): string =>
  key.replace(/\s+/g, "_").replace(/[^\w]/g, "").toUpperCase()

function generateEnums(schema: Object, codeListFilePath: string, outputFolder: string) {
  const shortnameArray = getShortnameArray(schema).filter(name => name['base'] !== undefined && name['base'].startsWith('List'))
  for (const shortnameDec of shortnameArray) {
    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: "@_", // you have assign this so use this to access the attribute
    }

    const parser = new XMLParser(options)
    const xsdContent = fs.readFileSync(`${codeListFilePath}`, "utf-8")
    const parsedXSD = parser.parse(xsdContent)

    // Navigate to the code lists in the parsed XSD (modify this path if needed)
    const codeLists = parsedXSD?.["xs:schema"]?.["xs:simpleType"]

    if (!codeLists || !Array.isArray(codeLists)) {
      console.error("Could not find code lists in the XSD file.")
      return
    }

    const relevantList = codeLists.filter(list => list['@_name'] === shortnameDec['base'])[0]
    const enumName = shortnameDec['refname']

    let values = relevantList["xs:restriction"]?.["xs:enumeration"]
    if (!values) {
      console.warn(`No values found for ${enumName}.`)
      values = []
    } else if (!Array.isArray(values)) {
      console.log(`Only one value in code list for ${enumName}.`)
      values = [values]
    }

    type CodeListRecord = {key: string, value: string, documentation: string}

    const codeListRecords = values.map((value: any) : CodeListRecord => {
      return {'key': formatEnumKey(value["xs:annotation"]?.["xs:documentation"][0]), 'value': value["@_value"], 'documentation': value["xs:annotation"]?.["xs:documentation"][1]}
    })


    const seenKeys = new Set<string>();

    const deduplicatedCodeListRecords = codeListRecords.map((item) : CodeListRecord => {
      let newKey = item.key;
      let counter = 1;

      // Increment key if it already exists in the set
      while (seenKeys.has(newKey)) {
        newKey = `${item.key}${counter}`;
        counter++;
      }

      seenKeys.add(newKey);
      return { ...item, key: newKey };
    });

    const enumEntries = deduplicatedCodeListRecords.map((record: CodeListRecord) => {
      return `  /** ${record.documentation} */\n  "${record.key}" = "${record.value}"`
    })

    const enumContent = `export enum ${enumName} {\n${enumEntries.join(",\n")}\n}\n`

    // Write the enum to a file
    const outputFilePath = path.resolve(`${outputFolder}/${enumName}.ts`)
    fs.writeFileSync(outputFilePath, enumContent, "utf-8")
    console.log(`Generated enum: ${enumName} -> ${outputFilePath}`)
  }
}


const generateEnumsFromXSD = (bookProductFilePath: string, codeListFilePath: string, outputFolder: string) => {
  const xsdPath = path.resolve(bookProductFilePath)
  const schema = readXSD(xsdPath)

  console.log('Generating shortname enum...')
  const shortnameEnum = generateShortnameEnum(schema)
  const shortnamePath = path.resolve(`${outputFolder}/shortname.ts`)
  fs.writeFileSync(shortnamePath, shortnameEnum, 'utf-8')

  console.log('Generating enums...')
  generateEnums(schema, codeListFilePath, outputFolder)

  console.log(`TypeScript enums have been generated.`);
}

export { generateEnumsFromXSD, formatEnumKey };
