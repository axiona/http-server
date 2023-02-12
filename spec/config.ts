import {copyFileSync, existsSync, readFileSync} from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let raw : string;
const file = __dirname + '/../';

if(existsSync(file)) {

    raw = readFileSync(file + '/config.json').toString();

} else {

    copyFileSync(file + '/config.json', file + '/config.json-dist');
    raw = readFileSync(file + '/config.json').toString();
}


const Config = JSON.parse(raw);
export default <{port : number}>  Config;
