# onix-type-generator

<img src="static/mascot.png" style="width: 20%; height: 20%"/>

## Setup

Build the tool by running the following:

```bash
npm install
npm run build
```

If you link the package globally, you can run the tool from anywhere:

```bash
npm link
```

You can now run it as follows from anywhere in your file system:

```bash
onixtg --version
```

## Usage

### Generating enums

To generate enums from an xsd Onix CodeList file together with a xsd BookProduct file, first download both files. They can for example be downloaded from [here](https://www.editeur.org/files/ONIX%203/ONIX_BookProduct_3.1_XSDs+codes_Issue_68.zip) (you will need to download the zip file and unpack it).

You can then run the script to generate the TypeScript enum files by amending the following command.

```bash
onixtg generate-enums -b ./data/BookProduct_sample.xsd -c ./data/CodeLists_sample.xsd -o ./data/enums
```

### Generate Analysis

To ensure that all elements have been parsed correctly, some analysis needs to be done. To get an overview over the different types of elements and their structure an elementMap can be generated. The elementMap shows the xsd-structure of the elements and the respective occurence-count of the structure. It can be generated via the following command.

```bash
onixtg generate-element-map -b ./data/BookProduct_sample.xsd -o ./data/elementMap.json"
```

At the moment this tool doesn't have more functionality. But stay tuned, there will be more.

## Development

Just run the following to hot reload (restarts on file changes) the tool using nodemon:

```bash
npm run dev
```

Manipulate the sub-commands and flags in `nodemon.json` to your liking.

If you are using VSCode switch to the Debug tab and run the code via the "Debug via NPM script" command. Now you have hot reloading with breakpoints. Set breakpoints to inspect the state of your app at runtime.

There is a small test suite that can be run via:

```bash
npm test
```
