const { exec, execSync } = require('child_process');
const  fs  = require('fs');
const Path = require('path');

const lexems = require('./lexems.json');

let solcVersion; //Highest compiler version, requires that contracts use progressive versions

const startPos = 2;
const infoPos = 3;
let shift = 0;

let current_tool;

const parse_args = (argv) => {
    var dockerArgs = [];
    var toolArgs = [];
    flag = false;

    const mapTools = new Map(Object.entries(lexems.tools));

    for (words of argv) {
        if (mapTools.has(words)) {
            current_tool = words;
            flag = true;
            if(words == "myth" || words == "mythrill"){
                words = mapTools.get(words) + " analyze";
            } else {
                words = mapTools.get(words);
            }
        } else if(words == "--container") {
            flag = false;
        }

        if (!flag) {
            dockerArgs.push(words);
        } else {
            toolArgs.push(words);
        }
    }

    return {dockerArgs, toolArgs};
}

const parse_version = (path) => {
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

function set_compiler_version(version, tool) {
    this.filehandle = fs.readFileSync(`${__dirname}/docker/${tool}/.dockerfile`);
    this.res = this.filehandle.toString().replace(/VERSION/gi, version);
    fs.writeFileSync(`${__dirname}/docker/${tool}/dockerfile`, this.res);
}

async function start() {
    if(process.argv.length < 3) {
        console.log("Use -h || --help for additional info");
    } else if (process.argv[startPos] == "-h" || process.argv[startPos] == "--help") {
        console.log("Supported commands via: \n\tgbs --container ... tool ...");
        console.log("\tgbs tool ... --container ...");
        console.log("-l || --list gives you info what tools are supported");
        console.log("-i tool_name gives you additional info of tools");
        console.log("-arg || --arguments tool_name gives you every correct arguments for supported tool");
        console.log("-f tool_name contract_name gives you full info about contract");
        console.log("-c analyze certain contract in given file");
    } else if (process.argv[startPos] == "-l" || process.argv[startPos] == "--list") {
        console.log("Supported tools:\n\tmythrill\n\tslither\n\techidna");
    } else if (process.argv[startPos] == "-i") {
        console.log("If you get any info that container can`t find @openzeppelin");
        console.log("use: --solc-remap @openzeppelin=node_modules/@openzeppelin");
        if (process.argv.length != 4) {
            console.log("Use correct syntax: -i tool_name");
            console.log("Example: scc -i myth");
        }else if (process.argv[infoPos] == "echidna") {
            console.log("Echidna through docker\n",
                        "docker pull trailofbits/eth-security-toolbox\n",
                        "docker run -it -v pwd:/home/training trailofbits/eth-security-toolbox\n",
                        "The last command runs eth-security-toolbox in a docker container that has access to your current directory.\n",
                        "You can change the files from your host and run the tools on the files through the container.\n\n",
                        "Inside docker, run :\n\n",
                        "solc-select use 0.5.11\n",
                        "cd /home/training");
            console.log("For additional info: https://github.com/crytic/echidna");
        } else if (process.argv[infoPos] == "myth" || process.argv[infoPos] == "mythrill") {
            console.log("For additional info: https://github.com/ConsenSys/mythril");
        } else if (process.argv[infoPos] == "slither") {
            console.log("For additional info: https://github.com/crytic/slither");
        } else if (process.argv[infoPos] == "manticore") {
            console.log("Use: manticore -h");
            console.log("For additional info: https://github.com/trailofbits/manticore");
        } else if (process.argv[infoPos] == "maian") {
            console.log("For additional info: https://github.com/smartbugs/MAIAN");
        } else {
            console.log("ERR: Unexpected token");
        }
    } else if (process.argv[startPos] == "-arg" || process.argv[startPos] == "--arguments") {
        if (process.argv[infoPos].length != 4) {
            console.log("Use correct syntax: -arg tool_name || --arguments tool_name");
            console.log("Example: scc -arg myth");
        } else if (process.argv[infoPos] == "myth" || process.argv[infoPos] == "mythrill") {
            console.log(lexems.myth);
        } else if (process.argv[infoPos] == "echidna") {
            console.log(lexems.echidna);
        } else if (process.argv[infoPos] == "slither") {
            console.log(lexems.slither);
        } else if (process.argv[infoPos] == "manticore") {
            console.log(lexems.manticore);
        } else {
            console.log("ERR: Unexpected token");
        }
    } else {
        let default_print = " --disable-color --print human-summary";
        this.regex = new RegExp("[0-9].[0-9]*.[0-9]*"); 

        let Highest;

        if(process.argv[startPos] == "-f"){
            default_print = "";
            shift = 1;
        }

        const argument = parse_args(process.argv.slice(shift + startPos, process.argv.length));
        const path = argument.toolArgs[1];

        if(process.argv[process.argv.length - 2] == '--compiler') {
            Highest = process.argv[process.argv.length - 1].match(this.regex)[0];
            console.log('Highest version: ', Highest);
        } else {
            parse_version(path);
            console.log(solcVersion);
            let version = solcVersion.split(' ')[2];
            if(version[0] == '^'){
                version = version.split('^')[1];
            }
            Highest = version.slice(0, version.length - 1);
        }

        this.path = Path.parse(argument.toolArgs[1]);

        if(current_tool == "myth" || current_tool == "mythrill") {
            console.log('docker run -v ' + process.env.PWD + ':/tmp ' + argument.toolArgs[0] + ' /tmp/' + argument.toolArgs[1] + ' --solv ' + Highest + ' --max-depth 22');
            exec('docker run -v ' + process.env.PWD + ':/tmp ' + argument.toolArgs[0] + ' /tmp/' + argument.toolArgs[1] + ' --solv ' + Highest + ' --max-depth 22', (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(stdout);
                console.log(stderr);
            });
        } else if (current_tool == "slither") {
            console.log('docker run -a stdin -a stderr -a stdout --rm --entrypoint="" -v ' + process.env.PWD + ':/home/ethsec/contracts ' + argument.toolArgs[0] + " slither " + "./contracts/" + argument.toolArgs[1] + default_print +' --solc-disable-warnings --solc-solcs-select ' + Highest);
            exec('docker run -a stdin -a stderr -a stdout --rm --entrypoint="" -v ' + process.env.PWD + ':/home/ethsec/contracts ' + argument.toolArgs[0] + " slither " + "./contracts/" + this.path.dir + '/' + this.path.base + default_print +' --solc-disable-warnings --solc-solcs-select ' + Highest, (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(stdout);
                console.log(stderr);
            })
        } else if (current_tool == "echidna") {

            set_compiler_version(Highest, echidna)

            await exec(`docker build ${__dirname}/docker/echidna -t echidna`, (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(stdout);
                console.log(stderr);
            });

            console.log('docker run -a stdin -a stderr -a stdout --rm --entrypoint="" --ulimit stack=100000000:100000000 --log-driver=journald --name echidna -v ' + process.env.PWD + ':/home/ethsec/contracts ' + argument.toolArgs[0] + " echidna-parade " + "--config conf.yaml" + ' ./contracts/' + argument.toolArgs[1].slice(0, argument.toolArgs[1].length));
            exec('docker run -a stdin -a stderr -a stdout --rm --entrypoint="" --ulimit stack=100000000:100000000 --log-driver=journald --name echidna -v ' + process.env.PWD + ':/home/ethsec/contracts ' + "echidna" + " echidna-parade " + "--config conf.yaml " + ' ./contracts/' + argument.toolArgs[1].slice(0, argument.toolArgs[1].length), {maxBuffer: 1048576 * 1024}, (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(stdout);
                console.log(stderr);
            });
        } else if (current_tool == "manticore") {
            console.log('docker run -a stdin -a stderr -a stdout --ulimit stack=100000000:100000000 --rm --entrypoint="" -v ' + process.env.PWD + ':/home/ethsec/contracts ' + argument.toolArgs[0] + " manticore " + "./home/ethsec/contracts/" + argument.toolArgs[1].slice(0, argument.toolArgs[1].length) + ' --solc-disable-warnings --solc-solcs-select ' + Highest+ ' --workspace /home/ethsec/contracts/manticore');
            exec('docker run -a stdin -a stderr -a stdout --ulimit stack=100000000:100000000 --rm --entrypoint="" -v ' + process.env.PWD + ':/home/ethsec/contracts ' + argument.toolArgs[0] + " manticore " + "./home/ethsec/contracts/" + argument.toolArgs[1].slice(0, argument.toolArgs[1].length) + ' --solc-disable-warnings --solc-solcs-select ' + Highest + ' --workspace /home/ethsec/contracts/manticore', (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(stdout);
                console.log(stderr);
            });
        } 
        // else if (current_tool == "maian") {
        //     execSync(`wget -P ${process.env.PWD}/${Highest}/ https://github.com/ethereum/solidity/releases/download/v${Highest}/solc-static-linux`, (error, stdout, stderr) => {
        //         if (error) {
        //             console.log(error);
        //             return;
        //         }
        //         console.log(stdout);
        //         console.log(stderr);
        //     });

        //     fs.chmod(`${process.env.PWD}/${Highest}/solc-static-linux`, '777', (err) => {
        //         if(err) throw err;
        //         // console.log("solc-static-linux changed");
        //     });

        //     //NOTE If it gives an error EPERM or smth like, change owner of directory: $ sudo chown -R ubuntu:ubuntu MAIAN-master/

        //     fs.symlink(`${process.env.PWD}/${Highest}/solc-static-linux`, `${process.env.PWD}/MAIAN-master/venv/bin/solc`, (err) => {
        //         if(err.code != 'EEXIST') throw err;
        //         // console.log("solc-static-linux symlink added");
        //     })

        //     execSync(`./${Highest}/solc-static-linux ${argument.toolArgs[1]}  --combined-json bin --overwrite -o .`, (error, stdout, stderr) => {
        //         if (error) {
        //             console.log(error);
        //             return;
        //         }
        //         console.log(stdout);
        //         console.log(stderr);
        //     })

        //     const contracts = require("./combined.json").contracts;

        //     let keys = [];
        //     let bins = [];
        //     for(key in contracts) {
        //         keys.push(key);
        //     }
    
        //     for(kkey of keys) {
        //         bins.push(contracts[kkey].bin);
        //     }
    
        //     bins.sort();

        //     const outName = argument.toolArgs[1].slice(0, argument.toolArgs[1].length).split('/');

        //     const outFile = outName[outName.length - 1].split('.')[0];
        
        //     fs.writeFileSync("proceed.bin", bins[bins.length - 1]);

        //     this.filehandle = fs.readFileSync(`${__dirname}/.maian-start`);
        //     this.res = this.filehandle.toString().replace(/PATH/gi, `${process.env.PWD}/proceed.bin`);
        //     fs.writeFileSync(`${__dirname}/maian-start-0`, this.res);
            
        //     this.filehandle = fs.readFileSync(`${__dirname}/maian-start-0`);
        //     this.res = this.filehandle.toString().replace(/STATUS/gi, '0');
        //     fs.writeFileSync(`${__dirname}/maian-start-0`, this.res);

        //     fs.chmod(`${process.env.PWD}/maian-start-0`, '777', (err) => {
        //         if(err) throw err;
        //         // console.log("solc-static-linux changed");
        //     });

        //     execSync(`bash ./maian-start-0 >> out/${outFile}-0.res`, (error, stdout, stderr) => {
        //         if (error) {
        //             console.log(error);
        //             return;
        //         }
        //         console.log(stdout);
        //         console.log(stderr);
        //     });

        //     this.filehandle = fs.readFileSync(`${__dirname}/.maian-start`);
        //     this.res = this.filehandle.toString().replace(/PATH/gi, `${process.env.PWD}/proceed.bin`);
        //     fs.writeFileSync(`${__dirname}/maian-start-1`, this.res);

        //     this.filehandle = fs.readFileSync(`${__dirname}/maian-start-1`);
        //     this.res = this.filehandle.toString().replace(/STATUS/gi, '1');
        //     fs.writeFileSync(`${__dirname}/maian-start-1`, this.res);

        //     fs.chmod(`${process.env.PWD}/maian-start-1`, '777', (err) => {
        //         if(err) throw err;
        //         // console.log("solc-static-linux changed");
        //     });

        //     execSync(`bash ./maian-start-1 >> out/${outFile}-1.res`, (error, stdout, stderr) => {
        //         if (error) {
        //             console.log(error);
        //             return;
        //         }
        //         console.log(stdout);
        //         console.log(stderr);
        //     });

        //     this.filehandle = fs.readFileSync(`${__dirname}/.maian-start`);
        //     this.res = this.filehandle.toString().replace(/PATH/gi, `${process.env.PWD}/proceed.bin`);
        //     fs.writeFileSync(`${__dirname}/maian-start-2`, this.res);

        //     this.filehandle = fs.readFileSync(`${__dirname}/maian-start-2`);
        //     this.res = this.filehandle.toString().replace(/STATUS/gi, '2');
        //     fs.writeFileSync(`${__dirname}/maian-start-2`, this.res);

        //     fs.chmod(`${process.env.PWD}/maian-start-2`, '777', (err) => {
        //         if(err) throw err;
        //         // console.log("solc-static-linux changed");
        //     });

        //     execSync(`bash ./maian-start-2 >> out/${outFile}-2.res`, (error, stdout, stderr) => {
        //         if (error) {
        //             console.log(error);
        //             return;
        //         }
        //         console.log(stdout);
        //         console.log(stderr);
        //     });
        // }
    }    
}

start();
