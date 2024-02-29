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

    initPeer() {
        return new Promise((resolve) => {
            this.peer = new Peer(this.id);
            this.peer.on('open', resolve);
            // Handle someone connecting to you
            this.peer.on('connection', connection => {
                // connection.on('open', this.answerConnection.bind(this, connection));
                this.connections.push(connection)
                const knownIds = `c${this.connections.map(conn => conn.peer.replace('hullo-', '')).join(',')}`
                connection.on('open', () => {
                    connection.send(knownIds)
                })
            });
        });
    }

    connect(id) {
        return new Promise((resolve) => {
            const connection = this.peer.connect(id);
            connection.on('open', () => {
                resolve();
                connection.on('data', data => {
                    // TODO connect to all unknown ids
                    console.log('------------------------')
                    console.log(`${this.id} recieved data: ${data}`)
                    console.log('------------------------')
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
    const p1 = new Participant()
    const p2 = new Participant();
    const p3 = new Participant();
    Promise.all([p1.initPeer(), p2.initPeer(), p3.initPeer()]).then(() => {
        console.log(p1.id, p1.connections.map(conn => conn.peer.replace('hullo-', '')).join(','));
        console.log(p2.id, p2.connections.map(conn => conn.peer.replace('hullo-', '')).join(','));
        console.log(p3.id, p3.connections.map(conn => conn.peer.replace('hullo-', '')).join(','));
        p2.connect(p1.id).then(() => {
            p3.connect(p1.id)
        })
    })
}