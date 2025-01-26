#!/usr/bin/env node
import * as fs from 'fs';
import { generateEnumsFromXSD } from './enums.js';
import { generateElementMapFromXSD } from './analysis.js';
import { Command } from 'commander';

const program = new Command()

program
    .command("generate-enums")
    .description("Generate enums from a BookProduct-file")
    .requiredOption(
        "-b, --bookProduct <bookProduct>",
        "The source xsd file that contains the BookProduct-elements",
    )
    .requiredOption(
        "-c, --codeList <codeList>",
        "The source xsd file that contains the CodeLists Information",
    )
    .option(
        "-o, --output <output>",
        "The output directory where the enums should be saved",
        "./data/codelist/output",
    )
    .action((options) => {
        console.log(`Generating enums in ${options.output}`)

        if (!fs.existsSync(options.output)) {
            fs.mkdirSync(options.output, { recursive: true })
        }

        generateEnumsFromXSD(options.bookProduct, options.codeList, options.output)
    })

program
    .command("generate-element-map")
    .description("Generate an element map from a xsd file for analysis")
    .requiredOption(
        "-b, --bookProduct <bookProduct>",
        "The source xsd file that contains the BookProduct-elements",
    )
    .requiredOption(
        "-o, --output <output>",
        "The output file where the element map should be saved"
    )
    .action((options) => {
        console.log(`Generating elementMap from ${options.bookProduct} in ${options.output}`)
        generateElementMapFromXSD(options.bookProduct, options.output)
    })

program
    .name("onix-type-generator")
    .description(
        "An CLI tool that allows to generate Typescript types from Onix files.",
    )
    .version("1.0.0")
    .parse(process.argv)
