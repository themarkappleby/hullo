import Peer from 'peerjs';

/** Superset of PeerJS, with mesh networking capabilities
 * 
 * connections: An array of connections
 * eventListeners: An array of event listeners
 * 
 * broadcast: Sends a message to all connections
 * 
 * When a new peer connects to this instance, it automatically shares all known connections with the new peer.
 * When this instances connects to a new peer, it automatically listens for known connections to be shared (and connects to them if necessary).
 */

export default class MeshPeer extends Peer {
    connections = [];
    eventListeners = [];

    constructor(options) {
        super(options);
        this.connections = [];
    }

    on(event, callback) {
        this.eventListeners.push({event, callback})
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

    broadcast(message) {
        this.connections.forEach(connection => {
            connection.send(message)
        })
    }

    connect(id) {
        if (this.connections.find(c => c.peer === id)) return;
        const self = this;
        const connection = super.connect(id);
        connection.on('data', (data) => {
            if (data.startsWith('meshpeerjs-connections:')) {
                const connections = data.split(':').pop().split(',')
                connections.forEach(id => {
                    const innerConnection = self.connect(id)
                    innerConnection?.on('open', () => {
                        this.eventListeners.forEach(({event, callback}) => {
                            if (event === 'connection') callback(innerConnection)
                        })
                    })
                })
            }
        })
        this.connections.push(connection);
        return connection;
    }
}
