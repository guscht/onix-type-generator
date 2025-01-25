<img src="static/mascot.png" style="width: 20%; height: 20%"/>

Build the tool by running the following:

    npm install
    npx tsc

To generate enums from a xsd Onix CodeList file, first download such a file. They can for example be downloaded from [here](https://www.editeur.org/14/Code-Lists/#CodeListFiles) (you will need to download the zip file and unpack it).

You can then run the script to generate the TypeScript enum files via:

    node ./dist/index.js generate-enums -s ./data/ONIX_BookProduct_CodeLists.xsd -o ./data/codelist/

At the moment this tool doesn't have more functionality. But stay tuned, there will be more.
