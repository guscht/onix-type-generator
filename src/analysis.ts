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

function mapElement(element: object) {
  const map = {};
  if (typeof element === 'string' || element instanceof String) {
    return 1;
  }
  const propertyNames = Object.getOwnPropertyNames(element);
  if (propertyNames.includes('length')) {
    return element['length'];
  }
  for (const propertyName of propertyNames) {
    if (propertyName === 'xs:annotation' || propertyName === 'xs:attributeGroup') {
      map[propertyName] = 'x'
    }
    else if (propertyName.startsWith('xs:')) {
      map[propertyName] = mapElement(element[propertyName])
    }
  };
  if (Object.keys(map).length == 0) {
    return 1;
  }
  return map;
}


function generateElementMap(schema: Object): Object {
  const elementMaps: Object[] = [];

  // Iterate over elements in schema and create element maps
  const elements = Array.isArray(schema['xs:element'])
    ? schema['xs:element']
    : [schema['xs:element']];
  for (const element of elements) {
    if (!element) continue;
    elementMaps.push(mapElement(element))
  }

  // Count same element maps to get an understand of which element maps exist
  const result = elementMaps.reduce((acc, item) => {
    const key = JSON.stringify(item)
    if (!acc.hasOwnProperty(key)) {
      acc[key] = 0
    }
    acc[key] += 1
    return acc
  }, {})
  return result;
}

const generateElementMapFromXSD = (xsdFilePath: string, outputFile: string) => {
  const xsdPath = path.resolve(xsdFilePath)
  const schema = readXSD(xsdPath)

  console.log('Generating element map...')
  const elementMap = generateElementMap(schema)
  const elementMapPath = path.resolve(outputFile)
  fs.writeFileSync(elementMapPath, JSON.stringify(elementMap), 'utf-8')

  console.log(`Element map has been generated.`);
}

export { generateElementMapFromXSD };
