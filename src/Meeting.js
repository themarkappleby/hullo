import MeshPeer from './MeshPeer';

/** 
 * Sits on top of MeshPeer, ensures one of the present attendees always has the meeting ID.
 * Allows a mesh P2P to behave like a psuedo-meeting.
 */

export default class Meeting {
    id = null;
    members = [];
    host = false;
    _peer = null;
    _eventListeners = [];

    constructor(meetingId) {
        this.id = meetingId;
        this._peer = new MeshPeer(meetingId);
        this._initConnectionListener();
        this._peer.on('open', () => {
            this.host = true;
            this.members.push(this._peer);
            this._eventListeners.forEach(({event, callback}) => {
                if (event === 'open') callback(this);
            })
        })
        this._peer.on('error', error => {
            if (error.type === 'unavailable-id') {
                this._peer = new MeshPeer();
                this._peer.on('open', () => {
                    this.members.push(this._peer);
                    this._eventListeners.forEach(({event, callback}) => {
                        if (event === 'open') callback(this);
                    })
                    const connection = this._peer.connect(meetingId);
                    connection.on('open', () => {
                        this._handleNewConnection(connection);
                    });
                })
                this._initConnectionListener();
            } else {
                console.error(error)
            }
        })
    }

    on(event, callback) {
        this._eventListeners.push({event, callback})
    }

    broadcast(message) {
        this.members.forEach(member => {
            if (member.send) {
                member.send(message)
            }
        })
    }

    _initConnectionListener() {
        this._peer.on('connection', connection => {
            this._handleNewConnection(connection);
        })
    }

    _handleNewConnection(connection) {
        this.members.push(connection);
        this._eventListeners.forEach(({event, callback}) => {
            if (event === 'member-joined') callback(connection);
        })
        connection.on('data', data => {
            // TODO: Figure out how to filter out meshpeerjs messages within MeshPeer instead of Meeting
            if (!data.startsWith('meshpeerjs-connections:')) {
                this._eventListeners.forEach(({event, callback}) => {
                    if (event === 'data') callback(data, connection);
                })
            }
        })
        connection.on('close', () => {
            // TODO: If host leaves, make someone else the host
            this.members = this.members.filter(member => member !== connection);
            this._eventListeners.forEach(({event, callback}) => {
                if (event === 'member-left') callback(connection);
            })
        })
    }
}