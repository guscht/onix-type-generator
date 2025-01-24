import * as fs from 'fs';
import { generateEnumsFromXSD } from './enums';

// Define the structure of an ONIX code list entry
interface CodeListEntry {
  CodeValue: string;
  Description: string;
}

// Define the structure of a parsed ONIX code list
interface CodeList {
  CodeListNumber: string;
  CodeListName: string;
  Codes: CodeListEntry[];
}

// Entry point
const main = () => {
  const xsdFilePath = './data/ONIX_BookProduct_CodeLists.xsd'; // Replace with the actual path to the XSD file
  const outputDir = './data/codelist/output/';

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  generateEnumsFromXSD(xsdFilePath, outputDir);
};

main();
