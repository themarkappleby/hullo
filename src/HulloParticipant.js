import HulloMeeting from './HulloMeeting';

const MOVE_DATA_FLAG = 'm';

export default class HulloParticipant {
    id = null;
    stream = null;
    meeting = null;
    events = [];
    isLocal = false;
    position = [0, 0, 0];
    rotation = [0, 0, 0];
    _calledPeers = new Set();

    constructor(stream, meetingCode = null) {
        this.stream = stream;
        this.meeting = new HulloMeeting(meetingCode);
        this._ready = new Promise((resolve) => {
            this.meeting.on('open', () => {
                this.id = this.meeting.self.id;
                this._setupCallHandlers();
                resolve();
            });
        });
        this._initData();
        this._initMedia();
    }

    initPeer() {
        return this._ready;
    }

    on(event, cb) {
        this.events.push({ event, cb });
    }

    broadcast(message) {
        this.meeting.broadcast(message);
    }

    _initData() {
        this.meeting.on('data', (data) => {
            if (data[0] === MOVE_DATA_FLAG) {
                const payload = data.substring(1);
                this.events.forEach(({ event, cb }) => {
                    if (event === 'recieve_location_data') cb(payload);
                });
            }
        });
    }

    _initMedia() {
        this.meeting.on('member-joined', (member) => {
            this._callMember(member);
        });

        this.meeting.on('member-left', (member) => {
            const peerId = member.peer || member.id;
            this._calledPeers.delete(peerId);
            this.events.forEach(({ event, cb }) => {
                if (event === 'stream_inactive') cb(peerId);
            });
        });
    }

    _setupCallHandlers() {
        this.meeting.self.on('error', (error) => {
            console.error(error);
            if (
                window.confirm(
                    'A connection error occurred. Attempting to connect again will often fix this problem. Please try again.'
                )
            ) {
                window.location.href = '/';
            }
        });

        this.meeting.self.on('call', (call) => {
            call.answer(this.stream);
            call.on('stream', (remoteStream) => {
                this._emitStream(remoteStream, call.peer);
            });
        });
    }

    _callMember(member) {
        const peerId = member.peer;
        if (!peerId || peerId === this.meeting.self.id || this._calledPeers.has(peerId)) {
            return;
        }
        this._calledPeers.add(peerId);
        const call = this.meeting.self.call(peerId, this.stream);
        call.on('stream', (remoteStream) => {
            this._emitStream(remoteStream, call.peer);
        });
    }

    _emitStream(remoteStream, peerId) {
        this.events.forEach(({ event, cb }) => {
            if (event === 'stream') cb({ stream: remoteStream, id: peerId });
        });
        remoteStream.oninactive = () => {
            this._calledPeers.delete(peerId);
            this.events.forEach(({ event, cb }) => {
                if (event === 'stream_inactive') cb(peerId);
            });
        };
    }
}
