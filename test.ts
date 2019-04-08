import * as os from 'os';
import * as internalIp from 'internal-ip';

const nifs     = os.networkInterfaces();
const external = Object
    .keys(nifs)
    .map(key => nifs[ key ])
    .map(ifs => ifs.filter(details => details.family === 'IPv4' && details.internal === false));


console.dir({
    hostname: os.hostname(),
    ...nifs,
    external,
    ip      : internalIp.v4.sync(),
});

