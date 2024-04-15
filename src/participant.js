import Peer from 'peerjs';
import getRandom from './helpers/getRandom';

const NAMESPACE = 'hullo'
const CONNECTION_DATA_FLAG = 'c';
const MOVE_DATA_FLAG = 'm';

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
                if (dataType === CONNECTION_DATA_FLAG) {
                    let ids = data.split(',').map(id => `${NAMESPACE}-${id}`).filter(id => id !== this.id);
                    ids = ids.filter(id => !this.connections.some(conn => conn.peer === id))
                    ids.forEach(this.connect.bind(this));
                } else if (dataType === MOVE_DATA_FLAG) {
                    this.events.forEach(({event, cb}) => {
                        if (event === 'recieve_location_data') cb(data)
                    })
                }
            });
        }
    }

    removeConnection(id) {
        this.connections = this.connections.filter(con => con.peer !== id);
    }

    broadcast(message) {
        this.connections.forEach(connection => {
            connection.send(message)
        })
    }

    initPeer() {
        return new Promise((resolve) => {
            this.peer = new Peer(this.id, {
                debug: 0, // 3 == full debug
                config: {
                    iceServers: [
                        {
                            urls: "stun:stun.relay.metered.ca:80",
                        },
                        {
                            urls: "turn:global.relay.metered.ca:80",
                            username: "cfd859b36d876badbf6f84c0",
                            credential: "8+5bIpSvsOfgFFHD",
                        },
                        {
                            urls: "turn:global.relay.metered.ca:80?transport=tcp",
                            username: "cfd859b36d876badbf6f84c0",
                            credential: "8+5bIpSvsOfgFFHD",
                        },
                        {
                            urls: "turn:global.relay.metered.ca:443",
                            username: "cfd859b36d876badbf6f84c0",
                            credential: "8+5bIpSvsOfgFFHD",
                        },
                        {
                            urls: "turns:global.relay.metered.ca:443?transport=tcp",
                            username: "cfd859b36d876badbf6f84c0",
                            credential: "8+5bIpSvsOfgFFHD",
                        },
                    ],
                }
            });
            this.peer.on('error', error => {
                console.error(error)
                if (window.confirm('A connection error occurred. Attempting to connect again will often fix this problem. Please try again.')) {
                    // TODO, test this: this.peer.reconnect();
                    window.location.href = '/';
                }
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
                    s.oninactive = () => {
                        this.events.forEach(({event, cb}) => {
                            if (event === 'stream_inactive') cb(call.peer)
                        })
                        this.removeConnection(call.peer)
                    }
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
                s.oninactive = () => {
                    this.events.forEach(({event, cb}) => {
                        if (event === 'stream_inactive') cb(call.peer)
                    })
                    this.removeConnection(call.peer)
                }
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