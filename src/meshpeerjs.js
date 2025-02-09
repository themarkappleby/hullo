import Peer from 'peerjs';

export default class MeshPeer extends Peer {
    connections = [];

    constructor(options) {
        super(options);
        this.connections = [];
    }

    on(event, callback) {
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
        if (this.connections.find(c => c.peer === id)) return;
        const self = this;
        const connection = super.connect(id);
        connection.on('data', (data) => {
            if (data.startsWith('meshpeerjs-connections:')) {
                const connections = data.split(':').pop().split(',')
                connections.forEach(id => {
                    // index.js does not know about these connections
                    self.connect(id)
                })
            }
        })
        this.connections.push(connection);
        return connection;
    }
}
