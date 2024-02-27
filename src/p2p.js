import Peer from 'peerjs';
import getRandom from './helpers/getRandom';

const NAMESPACE = 'hullo'

export const create = (id, stream) => {
    const peer = new Peer(`${NAMESPACE}-${id}`);
    peer.on('open', () => {
        peer.on('connection', conn => {
            conn.on('data', data => {
                console.log(data);
            });
        });
        peer.on('call', call => {
            call.answer(stream)
            call.on('stream', s => {
                console.log(s);
            });
        });
    })
    peer.on('error', error => console.error(error));
}

export const join = (id, stream) => {
    const peer = new Peer(`${NAMESPACE}-${getRandom(1000, 9999)}`);
    peer.on('open', () => {
        const conn = peer.connect(`${NAMESPACE}-${id}`);
        conn.on('open', () => {
            conn.send('hi!');
        });
        const call = peer.call(`${NAMESPACE}-${id}`, stream)
        call.on('stream', s => {
            console.log(s)
        });
    })
    peer.on('error', error => console.error(error));
}