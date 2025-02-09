import Peer from 'peerjs';

export default class MeshPeer extends Peer {
    connections = [];

    constructor(options) {
        super(options);
        this.connections = [];
    }

    on(event, callback) {
        console.log('event', event)
        if (event === 'connection') {
            super.on('connection', connection => {
                const connectionsString = this.connections.map(c => c.peer).join(',')
                if (connectionsString) {
                    connection.on('open', () => {
                        connection.send(`meshpeerjs-connections:${connectionsString}`);
                    })
                }
                this.connections.push(connection);
                callback(connection);
            })
        } else {
            super.on(event, callback);
        }
    }

    connect(id) {
        console.log('connecting to', id)
        const self = this;
        const connection = super.connect(id);
        connection.on('data', (data) => {
            if (data.startsWith('meshpeerjs-connections:')) {
                const connections = data.split(':').pop().split(',')
                connections.forEach(id => {
                    console.log('connecting to inner', id)
                    // This isn't workring becaause a Peer instance can only have one connection at a time
                    // I need to make a new Peer instance. MeshPeer should contain X Peer instances.
                    self.connect(id)
                })
            }
        })
        this.connections.push(connection);
        return connection;
    }
}

/*
export const joinMeeting = meetingId => {
    const promise = new Promise((resolve) => {
        let peer = new Peer(meetingId);
        peer.on('open', () => {
            resolve(peer);
        })
        peer.on('error', error => {
            if (error.type === 'unavailable-id') {
                peer = new Peer();
                peer.on('open', () => {
                    resolve(peer);
                    const connection = peer.connect(meetingId);
                    connection.on('open', function(){
                        connection.send(peer.id);
                    });
                })
            } else {
                console.error(error)
            }
        })
        peer.on('connection', function(connection) {
            connection.on('data', function(data){
                console.log('recieved', data)
            });
        });
    });
    return promise;
}
*/