const { exec, execSync } = require('child_process');
const  fs  = require('fs');
const { stdout, stderr } = require('process');

let solcVersion; //Highest compiler version, requires that contracts use progressive versions

function parse_version(path) {
    this.filehandle = fs.readFileSync(String(path));

    const regex = new RegExp("pragma solidity.*", "g");
    
    const res = this.filehandle.toString().match(regex);

    solcVersion = res.sort(function(a, b) {
        this.regex = new RegExp("[0-9]*");
        let lhsTokens = (a.split(' '))[2].split('.');
        let rhsTokens = (b.split(' '))[2].split('.');

        let lhsToken;
        let rhsToken;

        for(i = 0; i < lhsTokens.length; i++) {
            lhsToken = lhsTokens[i].match(this.regex);  
            rhsToken = rhsTokens[i].match(this.regex);

            if(Number(lhsToken) > Number(rhsToken)) {
                return 1;
            } else if (Number(lhsToken) < Number(rhsToken)) {
                return -1;
            }
        }
        return 0;
    })[res.length - 1];
}

async function start() {
    // maian path_to_contract

    //NOTE This is scenario how maian will works in docker
    //1. Parse file, does it correct, that file exists
    //2. Find highest required version of compiler and downloaded it, then added it to path
    //3. Compile file
    //4. Start scripts with maian
    // const infoPos = 3;

    let Highest;
    this.regex = new RegExp("[0-9].[0-9]*.[0-9]*"); 

    console.log(process.argv);

    //Phase 1:
    const path = process.argv[process.argv.length - 1];
    parse_version(path);
    console.log("Highest version: ", solcVersion);
    const version = solcVersion.split(' ')[2];
    Highest = version.match(this.regex)[0];

    //Phase 2:
    execSync(`wget -P ${Highest}/ https://github.com/ethereum/solidity/releases/download/v${Highest}/solc-static-linux`, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    });

    fs.chmod(`${Highest}/solc-static-linux`, '777', (err) => {
        if(err) throw err;
        // console.log("solc-static-linux changed");
    });

    // fs.readdir(`${Highest}`, function (err, files) {
    //     //handling error
    //     if (err) {
    //         return console.log('Unable to scan directory: ' + err);
    //     } 
    //     //listing all files using forEach
    //     files.forEach(function (file) {
    //         // Do whatever you want to do with the file
    //         console.log(file); 
    //     });
    // });

    // //NOTE If it gives an error EPERM or smth like, change owner of directory: $ sudo chown -R ubuntu:ubuntu MAIAN-master/

    fs.symlink(`/gbc/${Highest}/solc-static-linux`, `/gbc/MAIAN-master/venv/bin/solc`, (err) => {
        if(err) throw err;
        // console.log("solc-static-linux symlink added");
    })

    let exposeFile;

    //Phase 3:
    exec(`./${Highest}/solc-static-linux ${process.argv[process.argv.length - 1]}  --combined-json bin -o combined.json`, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    })
    
    fs.readdir('.', function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        // files.forEach(function (file) {
        //     // Do whatever you want to do with the file
        //     console.log(file); 
        // });

        console.log(files);
    });

    //Phase 4:

    // const contracts = require("./combined.json").contracts;

    // let keys = [];
    // let bins = [];
    // for(key in contracts) {
    //     keys.push(key);
    // }

    // for(kkey of keys) {
    //     bins.push(contracts[kkey].bin);
    // }

    // bins.sort();

    // const outName = argument.toolArgs[1].slice(0, argument.toolArgs[1].length).split('/');

    // const outFile = outName[outName.length - 1].split('.')[0];
    
    // fs.writeFileSync("proceed.bin", bins[bins.length - 1]);

    // this.filehandle = fs.readFileSync(`${__dirname}/.maian-start`);
    // this.res = this.filehandle.toString().replace(/PATH/gi, `gbc/proceed.bin`);
    // fs.writeFileSync(`${__dirname}/maian-start-0`, this.res);
        
    // this.filehandle = fs.readFileSync(`${__dirname}/maian-start-0`);
    // this.res = this.filehandle.toString().replace(/STATUS/gi, '0');
    // fs.writeFileSync(`${__dirname}/maian-start-0`, this.res);

    // fs.chmod(`gbc/maian-start-0`, '777', (err) => {
    //     if(err) throw err;
    //     // console.log("solc-static-linux changed");
    // });

    // fs.mkdirSync('/out', (err) => {
    //     if(err){
    //         throw err;
    //     }
    // });

    // execSync(`bash ./maian-start-0 >> out/${outFile}-0.res`, (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(error);
    //         return;
    //     }
    //     console.log(stdout);
    //     console.log(stderr);
    // });

    // this.filehandle = fs.readFileSync(`${__dirname}/.maian-start`);
    // this.res = this.filehandle.toString().replace(/PATH/gi, `gbc/proceed.bin`);
    // fs.writeFileSync(`${__dirname}/maian-start-1`, this.res);

    // this.filehandle = fs.readFileSync(`${__dirname}/maian-start-1`);
    // this.res = this.filehandle.toString().replace(/STATUS/gi, '1');
    // fs.writeFileSync(`${__dirname}/maian-start-1`, this.res);

    // fs.chmod(`gbc/maian-start-1`, '777', (err) => {
    //     if(err) throw err;
    //     // console.log("solc-static-linux changed");
    // });

    // execSync(`bash ./maian-start-1 >> out/${outFile}-1.res`, (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(error);
    //         return;
    //     }
    //     console.log(stdout);
    //     console.log(stderr);
    // });

    // this.filehandle = fs.readFileSync(`${__dirname}/.maian-start`);
    // this.res = this.filehandle.toString().replace(/PATH/gi, `gbc/proceed.bin`);
    // fs.writeFileSync(`${__dirname}/maian-start-2`, this.res);

    // this.filehandle = fs.readFileSync(`${__dirname}/maian-start-2`);
    // this.res = this.filehandle.toString().replace(/STATUS/gi, '2');
    // fs.writeFileSync(`${__dirname}/maian-start-2`, this.res);

    // fs.chmod(`gbc/maian-start-2`, '777', (err) => {
    //     if(err) throw err;
    //     // console.log("solc-static-linux changed");
    // });

    // execSync(`bash ./maian-start-2 >> out/${outFile}-2.res`, (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(error);
    //         return;
    //     }
    //     console.log(stdout);
    //     console.log(stderr);
    // });
}

start();