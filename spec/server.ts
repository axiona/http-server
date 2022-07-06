import Config from './config.js';
import Standard from '../dist/server/standard.js';

process.setMaxListeners(99);

export default function Server () {

    const server = new Standard({
        port : Config.port
    });

    function disconnect() {

        server.close();
    }

    //do something when app is closing
    process.on('exit', disconnect);

    //catches ctrl+c event
    process.on('SIGINT', disconnect);

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', disconnect);
    process.on('SIGUSR2', disconnect);

    // catch kill
    process.on('SIGTERM', disconnect);

    //catches uncaught exceptions
    process.on('uncaughtException', disconnect);

    return server;
}
