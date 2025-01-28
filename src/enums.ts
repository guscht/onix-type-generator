import * as fs from "fs"
import { XMLParser } from "fast-xml-parser"

// Helper function to format a string as a valid TypeScript enum key
const formatEnumKey = (key: string): string =>
  key.replace(/\s+/g, "_").replace(/[^\w]/g, "").toUpperCase()

// Function to parse the XSD file and generate enums
const generateEnumsFromXSD = (xsdFilePath: string, outputDir: string) => {
  // Read and parse the XSD file
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_", // you have assign this so use this to access the attribute
  }
  const parser = new XMLParser(options)
  const xsdContent = fs.readFileSync(xsdFilePath, "utf-8")
  const parsedXSD = parser.parse(xsdContent)

  // Navigate to the code lists in the parsed XSD (modify this path if needed)
  const codeLists = parsedXSD?.["xs:schema"]?.["xs:simpleType"]

  if (!codeLists || !Array.isArray(codeLists)) {
    console.error("Could not find code lists in the XSD file.")
    return
  }

  // Iterate over each code list and generate a TypeScript enum
  codeLists.forEach((codeList: any) => {
    const codeListNumber = codeList["@_name"]
    const codeListName =
      codeList["xs:annotation"]?.["xs:documentation"]?.["#text"] ||
      `CodeList${codeListNumber}`
    const enumName = formatEnumKey(codeListName)

    const values = codeList["xs:restriction"]?.["xs:enumeration"]
    if (!values || !Array.isArray(values)) {
      console.warn(`No values found for ${codeListName}. Skipping.`)
      return
    }

    const enumEntries = values.map((value: any) => {
      const codeValue = value["@_value"]
      const description =
        value["xs:annotation"]?.["xs:documentation"][0] || codeValue
      const key = formatEnumKey(description)
      return `  ${key} = "${codeValue}"`
    })

    const enumContent = `enum ${enumName} {\n${enumEntries.join(",\n")}\n}\n`

    // Write the enum to a file
    const outputFilePath = `${outputDir}/${enumName}.ts`
    fs.writeFileSync(outputFilePath, enumContent, "utf-8")
    console.log(`Generated enum: ${enumName} -> ${outputFilePath}`)
  })
}

export { formatEnumKey, generateEnumsFromXSD }
