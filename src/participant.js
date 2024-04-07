import Peer from 'peerjs';
import getRandom from './helpers/getRandom';

const NAMESPACE = 'hullo'

class Participant {
    id;
    peer;
    stream;
    events = [];
    connections = [];

    constructor(stream) {
        this.id = `${NAMESPACE}-${getRandom(1000, 9999)}`;
        this.stream = stream;
    }

    d() {
        return `${this.id}: ${this.connections.map(c => c.peer).join(', ')}`;
    }

    saveConnection(connection) {
        const existingConnection = this.connections.find(c => c.peer === connection.peer);
        if (!existingConnection) {
            this.connections.push(connection);
            connection.on('data', data => {
                const dataType = data[0]
                data = data.substring(1);
                if (dataType === 'c') {
                    let ids = data.split(',').map(id => `${NAMESPACE}-${id}`).filter(id => id !== this.id);
                    ids = ids.filter(id => !this.connections.some(conn => conn.peer === id))
                    ids.forEach(this.connect.bind(this));
                } else if (dataType === 'm') {
                    console.log(`${this.id} message - ${data}`)
                }
            });
        }
    }

    broadcast() {
        this.connections.forEach(connection => {
            connection.send('mHello world')
        })
    }

    initPeer() {
        return new Promise((resolve) => {
            this.peer = new Peer(this.id);
            this.peer.on('error', error => {
                console.error(error)
                location.reload();
            });
            this.peer.on('open', resolve);
            this.peer.on('connection', connection => {
                this.saveConnection(connection)
                const knownIds = `c${this.connections.map(conn => conn.peer.replace('hullo-', '')).join(',')}`
                connection.on('open', () => {
                    connection.send(knownIds)
                })
            });
            this.peer.on('call', call => {
                call.answer(this.stream);
                call.on('stream', s => {
                    this.events.forEach(({event, cb}) => {
                        if (event === 'stream') cb({stream: s, id: call.peer})
                    })
                });
            })
        });
    }

    on(event, cb) {
        this.events.push({ event, cb })
    }

    connect(id) {
        if (typeof id === 'object' && id.id) {
            id = id.id
        }
        return new Promise((resolve) => {
            const connections = this.connections;
            const connection = this.peer.connect(id);
            const call = this.peer.call(id, this.stream);
            call.on('stream', s => {
                this.events.forEach(({event, cb}) => {
                    if (event === 'stream') cb({stream: s, id: call.peer})
                })
            });
            connection.on('open', () => {
                this.saveConnection(connection);
                resolve();
            })
        });
    }
}

export default Participant;

export const test = () => {
    const participants = [];
    for (let i=1; i<=5; i++) {
        const participant = new Participant();
        window[`p${i}`] = participant;
        participants.push(participant)
    }
    const promises = []
    participants.forEach(participant => {
        promises.push(participant.initPeer())
    })
    Promise.all(promises).then(() => {
        participants.forEach(participant => {
            console.log(participant)
        })
    })
}