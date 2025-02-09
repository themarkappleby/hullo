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
            connection.on('data', (data) => {
                console.log('recieved', data)
            });
        });
    });
    peer.on('connection', connection => {
        document.getElementById('connections').innerHTML += `<li>${connection.peer}</li>` ;
        connection.on('data', (data) => {
            console.log('recieved', data)
        });
    });
    window.peer = peer;
});
