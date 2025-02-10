import MeshPeer from './MeshPeer'
import Meeting from './Meeting';


const joinMeetingForm = document.getElementById('joinMeetingForm');
joinMeetingForm.addEventListener('submit', e => {
    e.preventDefault();
    const meetingId = joinMeetingForm.meetingId.value;
    window.meeting = new Meeting(meetingId);
    document.getElementById('id').textContent = 'loading...';
    meeting.on('open', () => {
        document.getElementById('id').textContent = meeting.id;
    })
    meeting.on('member-joined', member => {
        document.getElementById('connections').innerHTML += `<li>${member.peer}</li>` ;
    })
    // meeting.on('data', data => {
    //     document.getElementById('messages').innerHTML += `<li>${data}</li>`;
    // })
});

/*
window.peer = new MeshPeer();
document.getElementById('id').textContent = 'loading...';
peer.on('open', () => {
    document.getElementById('id').textContent = peer.id;
    peer.on('connection', handleConnection);
});

const joinMeetingForm = document.getElementById('joinMeetingForm');
joinMeetingForm.addEventListener('submit', e => {
    e.preventDefault();
    const meetingId = joinMeetingForm.meetingId.value;
    const connection = peer.connect(meetingId);
    connection.on('open', () => handleConnection(connection));
});

const sendMessageForm = document.getElementById('sendMessageForm');
sendMessageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = sendMessageForm.message.value;
    document.getElementById('messages').innerHTML += `<li>${message}</li>`;
    e.target.reset();
    peer.broadcast(message);
});

function handleConnection (connection) {
    document.getElementById('connections').innerHTML += `<li>${connection.peer}</li>` ;
    connection.on('data', (data) => {
        document.getElementById('messages').innerHTML += `<li>${data}</li>`;
    });
}
*/