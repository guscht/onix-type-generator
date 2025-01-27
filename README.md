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

To generate enums from a xsd Onix CodeList file, first download such a file. They can for example be downloaded from [here](https://www.editeur.org/14/Code-Lists/#CodeListFiles) (you will need to download the zip file and unpack it).

You can then run the script to generate the TypeScript enum files via:

```bash
onixtg generate-enums -s ./data/ONIX_BookProduct_CodeLists.xsd -o ./data/codelist/
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
