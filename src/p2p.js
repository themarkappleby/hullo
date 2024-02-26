import Peer from 'peerjs';
import getRandom from './helpers/getRandom';

const NAMESPACE = 'hullo'

export const create = (id, stream) => {
    const peer = new Peer(`${NAMESPACE}-${id}`);
    peer.on('connection', conn => {
        console.log('connection')
        conn.on('data', data => {
            console.log(data);
        });
    });
    // peer.on('call', call => {
    //     call.answer(stream)
    //     call.on('stream', s => {
    //     });
    // });
    peer.on('error', error => console.error(error));
}

export const join = (id, stream) => {
    const peer = new Peer(`${NAMESPACE}-${getRandom(1000, 9999)}`);
    const conn = peer.connect(`${NAMESPACE}-${id}`);
    conn.on('open', () => {
        console.log('open')
        conn.send('hi!');
    });
    // const call = peer.call(`${NAMESPACE}-${id}`, stream)
    // call.on('stream', stream => {
    // });
    peer.on('error', error => console.error(error));
}