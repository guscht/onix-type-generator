#!/usr/bin/env node

import * as fs from "fs"
import { generateEnumsFromXSD } from "./enums.js"
import { Command } from "commander"

const program = new Command()

program
    .command("generate-enums")
    .description("Generate enums from a CodeList file")
    .requiredOption(
        "-s, --source <source>",
        "The source xsd file that contains the CodeLists",
    )
    .option(
        "-o, --output <output>",
        "The output directory where the enums should be saved",
        "./data/codelist/output",
    )
    .action((options) => {
        console.log(`Generating enums from ${options.source} in ${options.output}`)

        if (!fs.existsSync(options.output)) {
            fs.mkdirSync(options.output, { recursive: true })
        }

        generateEnumsFromXSD(options.source, options.output)
    })

program
    .command("generate-types")
    .description("Generate typescript types from a xsd file")
    .requiredOption(
        "-s, --source <source>",
        "The source xsd file that contains the definition of the types",
    )
    .option(
        "-o, --output <output>",
        "The output directory where the types should be saved",
        "./data/types/output",
    )
    .action((options) => {
        console.log(`Generating types from ${options.source} in ${options.output}`)

        //TODO: Add type generation code here.
    })


// Add a global help option and parse the command line arguments
program
    .name("onix-type-generator")
    .description(
        "An CLI tool that allows to generate Typescript types from Onix files.",
    )
    .version("1.0.0")
    .parse(process.argv)
