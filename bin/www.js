import http from 'http';

import app from '../index';
import config from '../config';

const port = config.port;

const server = http.createServer(app);

server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

    console.log('Listening on ' + bind);
});

server.on('error', (err) => {
    if (err.syscall !== 'listen') {
        throw err;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (err.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw err;
    }
});

server.listen(port);
