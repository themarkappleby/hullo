import MeshPeer from './meshpeerjs'

window.peer = new MeshPeer();
document.getElementById('id').textContent = 'loading...';
peer.on('open', () => {
    document.getElementById('id').textContent = peer.id;
    peer.on('connection', initConnection);
});

const joinMeetingForm = document.getElementById('joinMeetingForm');
joinMeetingForm.addEventListener('submit', e => {
    e.preventDefault();
    const meetingId = joinMeetingForm.meetingId.value;
    const connection = peer.connect(meetingId);
    connection.on('open', () => initConnection(connection));
});

function initConnection (connection) {
    document.getElementById('connections').innerHTML += `<li>${connection.peer}</li>` ;
    connection.on('data', (data) => {
        console.log(data)
    });
}