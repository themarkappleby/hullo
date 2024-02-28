import Peer from 'peerjs';
import getRandom from './helpers/getRandom';

const NAMESPACE = 'hullo'

const participants = [{
    id: 'hullo-1234',
    stream: {},
    connection: {
        send: () => {},
    },
    self: true,
    position: [0, 0.75, 0],
    rotation: [0, 0, 0],
}];

const broadcast = (data) => {
    participants.forEach(participant => {
        if (!participant.self) {
            participant.connection.send(data);
        }
    })
}

export const create = (id, stream, onParticpantUpdate) => {
    const peer = new Peer(`${NAMESPACE}-${id}`);
    peer.on('open', () => {
        peer.on('connection', conn => {
            conn.on('data', data => {
            });
        });
        peer.on('call', call => {
            call.answer(stream)
            call.on('stream', s => {
            });
        });
    })
    peer.on('error', error => console.error(error));
    return broadcast;
}

export const join = (id, stream, onParticpantUpdate) => {
    const peer = new Peer(`${NAMESPACE}-${getRandom(1000, 9999)}`);
    peer.on('open', () => {
        const conn = peer.connect(`${NAMESPACE}-${id}`);
        conn.on('open', () => {
            conn.send('hi!');
        });
        const call = peer.call(`${NAMESPACE}-${id}`, stream)
        call.on('stream', s => {
        });
    })
    peer.on('error', error => console.error(error));
    return broadcast;
}