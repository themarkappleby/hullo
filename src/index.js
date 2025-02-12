import Meeting from './Meeting';

const $ = document.querySelector.bind(document);
window.meeting = null;

const joinMeetingForm = document.getElementById('joinMeetingForm');
joinMeetingForm.addEventListener('submit', e => {
    e.preventDefault();
    const meetingId = joinMeetingForm.meetingId.value;
    meeting = new Meeting(meetingId);
    $('#id').textContent = 'loading...';
    meeting.on('open', () => {
        $('#id').textContent = meeting.id;
        const peerIdEl = $('#peerId');
        if (meeting.self.id === meeting.id) {
            $('#peerId').textContent = 'host';
        } else {
            $('#peerId').textContent = meeting.self.id;
        }
    })
    meeting.on('member-joined', member => {
        $('#members').innerHTML += `<li>${member.peer}</li>` ;
    })
    meeting.on('member-left', member => {
        $('#members').innerHTML = $('#members').innerHTML.replace(`<li>${member.peer}</li>`, '');
    })
    meeting.on('data', data => {
        $('#messages').innerHTML += `<li>${data}</li>`;
    })
});

const sendMessageForm = document.getElementById('sendMessageForm');
sendMessageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = sendMessageForm.message.value;
    $('#messages').innerHTML += `<li>${message}</li>`;
    e.target.reset();
    meeting.broadcast(message);
});
