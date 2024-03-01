import Peer from 'peerjs';
import getRandom from './helpers/getRandom';

const NAMESPACE = 'hullo'

class Participant {
    id;
    peer;
    connections = [];

    constructor() {
        this.id = `${NAMESPACE}-${getRandom(1000, 9999)}`;
    }

    d() {
        // Debug method
        return `${this.id}: ${this.connections.map(c => c.peer).join(', ')}`;
    }

    saveConnection(connection) {
        // Only add connection if it is new
        const existingConnection = this.connections.find(c => c.peer === connection.peer);
        if (!existingConnection) {
            this.connections.push(connection);
        }
    }

    initPeer() {
        return new Promise((resolve) => {
            this.peer = new Peer(this.id);
            this.peer.on('open', resolve);
            // Handle someone connecting to you
            this.peer.on('connection', connection => {
                // connection.on('open', this.answerConnection.bind(this, connection));
                this.saveConnection(connection)
                const knownIds = `c${this.connections.map(conn => conn.peer.replace('hullo-', '')).join(',')}`
                connection.on('open', () => {
                    connection.send(knownIds)
                })
            });
        });
    }

    connect(id) {
        if (typeof id === 'object' && id.id) {
            id = id.id
        }
        return new Promise((resolve) => {
            const connections = this.connections;
            const connection = this.peer.connect(id);
            connection.on('open', () => {
                this.saveConnection(connection);
                resolve();
                connection.on('data', data => {
                    const dataType = data[0]
                    data = data.substring(1);
                    if (dataType === 'c') {
                        let ids = data.split(',').map(id => `${NAMESPACE}-${id}`).filter(id => id !== this.id);
                        ids = ids.filter(id => !connections.some(conn => conn.peer === id))
                        ids.forEach(this.connect.bind(this));
                    }
                });
            })
        });
        // Handle you connecting to someone
        // connection.on('open', this.answerConnection.bind(this, connection));
    }

    // answerConnection(connection) {
    //     this.connections.push(connection)
    //     const knownIds = `c${this.connections.map(conn => conn.peer.replace('hullo-', '')).join(',')}`
    //     connection.send(knownIds)
    //     connection.on('data', data => {
    //         console.log('------------------------')
    //         console.log(`${this.id} incoming`, data)
    //         console.log('------------------------')
    //     });
    // }
}

export default () => {
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