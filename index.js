const fs = require('fs');
const p = require('path');

const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'Argparse example'
});

parser.addArgument(
  [ '--src' ],
  {
    help: 'Source folder path',
    required: true
  }
);
parser.addArgument(
  [ '--ext' ],
  {
    help: 'File extension, eg: js,jsx'
  }
);

const args = parser.parseArgs();
// console.dir(args);

function camelize(str) {
    return str.replace(/[^a-z0-9]/g, "_").replace(/_[a-z]/g, c => c[1].toUpperCase()).replace(/_/g, '');
}

function getVarName(filePath){
    return camelize(p.basename(filePath));
}

const allFileSync = function(dir, filter, filelist) {
    filelist = filelist || [];
    fs.readdirSync(dir).forEach((file) => {
        if (fs.statSync(p.join(dir, file)).isDirectory()) {
            filelist = allFileSync(p.join(dir, file), filter, filelist);
        }
        else {
            if(!filter || filter.test(file.toLowerCase())){
                filelist.push(p.join(dir, file));
            }
        }
    });
    return filelist;
};

const processFile = (srcFile) => {
    const fileContent = fs.readFileSync(srcFile, 'utf8');
    const re = RegExp(/src=\"([^\"]+)\"/g);
    let m;
    const imports = [];
    let fileContentAfter = fileContent;
    do {
        m = re.exec(fileContentAfter);
        if (!m) break;
        
        const match = m[0];
        const filePath = m[1];
        const varName = getVarName(filePath);
        imports.push(`import ${varName} from 'assets/${filePath}';`);
        fileContentAfter = fileContentAfter.replace(new RegExp(match , 'g'), `src={${varName}}`);
    } while (1);

    if(imports.length > 0){
        fileContentAfter = imports.join('\n') + '\n\n' + fileContentAfter;
    }

    fs.writeFileSync(srcFile, fileContentAfter);

    console.log(`Success! Process file ${srcFile} successfully.`)
}


const src = args.src;
const ext = (args.ext || "js").replace(/,/g, "|");
const filter = new RegExp(`\.(${ext})$`, "i");

if(fs.statSync(src).isDirectory()){
    const files = allFileSync(src, filter);
    files.forEach(processFile);
} else {
    processFile(src);
}
