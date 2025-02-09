import MeshPeer from './meshpeerjs'

const newMeetingButton = document.getElementById('newMeetingButton');
newMeetingButton.addEventListener('click', () => {
    document.getElementById('id').textContent = 'loading...';
    const peer = new MeshPeer();
    peer.on('open', () => {
        document.getElementById('id').textContent = peer.id;
        peer.on('connection', connection => {
            document.getElementById('connections').innerHTML += `<li>${connection.peer}</li>` ;
            connection.on('data', (data) => {
                console.log('recieved', data)
            });
        })
    });
    window.peer = peer;
});

const joinMeetingForm = document.getElementById('joinMeetingForm');
joinMeetingForm.addEventListener('submit', e => {
    document.getElementById('id').textContent = 'loading...';
    e.preventDefault();
    const meetingId = joinMeetingForm.meetingId.value;
    const peer = new MeshPeer();
    peer.on('open', () => {
        document.getElementById('id').textContent = peer.id;
        const connection = peer.connect(meetingId);
        connection.on('open', () => {
            document.getElementById('connections').innerHTML += `<li>${connection.peer}</li>` ;
            connection.send(peer.id);
            connection.on('data', (data) => {
                console.log('recieved', data)
            });
        });
    });
    window.peer = peer;
});

/*
import { joinMeeting } from './joinMeeting'
import { getRandom } from './helpers'
import { NAMESPACE } from './constants'

const newMeetingButton = document.getElementById('newMeetingButton');
newMeetingButton.addEventListener('click', () => {
    document.getElementById('id').textContent = 'loading...';
    const randomId = getRandom(1000, 9999)
    joinMeeting(`${NAMESPACE}-${randomId}`).then(handlePeer);
})

const joinMeetingForm = document.getElementById('joinMeetingForm');
joinMeetingForm.addEventListener('submit', e => {
    document.getElementById('id').textContent = 'loading...';
    e.preventDefault();
    const meetingId = joinMeetingForm.meetingId.value;
    joinMeeting(`${NAMESPACE}-${meetingId}`).then(handlePeer);
})

function handlePeer(peer) {
    document.getElementById('id').textContent = peer.id.replace(`${NAMESPACE}-`, '');
}
*/

/*
import { createRoom, joinRoom } from './peerjs-mesh'

createRoom({namespace: 'hullo'}).then((room, peer) => {
    peer.broadcast('hello');
});

joinRoom('hullo-1234').then(room => {
    room.broadcast('hello');
});
*/