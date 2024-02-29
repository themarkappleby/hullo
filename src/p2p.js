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

const getParticpant = (id) => {
    return participants.filter(participant => participant.id === id).pop();
}

const addParticipant = (participant) => {

}

const initPeer = id => {
    return new Promise((resolve) => {
        const peer = new Peer(`${NAMESPACE}-${id || getRandom(1000, 9999)}`);
        peer.on('open', () => resolve(peer));
        // Listen for incoming data
        peer.on('connection', conn => {
            conn.on('data', data => {
            });
        });
        // Answer incoming calls
        peer.on('call', call => {
            call.answer(stream)
            call.on('stream', s => {
            });
        });
        peer.on('error', error => console.error(error));
    });
}

export const create = (id, stream, onParticpantUpdate) => {
    initPeer(id).then(peer => {
    })
    return broadcast;
}

export const join = (id, stream, onParticpantUpdate) => {
    initPeer().then(peer => {
        const conn = peer.connect(`${NAMESPACE}-${id}`);
        conn.on('open', () => {
            conn.send('hi!');
        });
        const call = peer.call(`${NAMESPACE}-${id}`, stream)
        call.on('stream', s => {
        });
        peer.on('error', error => console.error(error));
        return broadcast;
    })
}