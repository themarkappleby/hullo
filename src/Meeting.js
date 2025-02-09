import MeshPeer from './MeshPeer';

/** 
 * Sits on top of MeshPeer, ensures one of the present attendees always has the meeting ID.
 * Allows a mesh P2P to behave like a psuedo-meeting.
 */

export default class Meeting {
    id = null;
    members = [];
    _peer = null;
    _eventListeners = [];

    constructor(meetingId) {
        this.id = meetingId;
        this._peer = new MeshPeer(meetingId);
        this._peer.on('open', () => {
            this._eventListeners.forEach(({event, callback}) => {
                if (event === 'open') callback(this);
            })
        })
        this._peer.on('connection', connection => {
            this.members.push(connection);
            this._eventListeners.forEach(({event, callback}) => {
                if (event === 'member-joined') callback(connection);
            })
        })
        this._peer.on('error', error => {
            if (error.type === 'unavailable-id') {
                this._peer = new MeshPeer();
                this._peer.on('open', () => {
                    const connection = this._peer.connect(meetingId);
                    connection.on('open', () => {
                        this._eventListeners.forEach(({event, callback}) => {
                            if (event === 'open') callback(this);
                        })
                    });
                })
            } else {
                console.error(error)
            }
        })
    }

    on(event, callback) {
        this._eventListeners.push({event, callback})
    }
}