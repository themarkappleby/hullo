import Meeting from './Meeting';

window.meeting = null;

const joinMeetingForm = document.getElementById('joinMeetingForm');
joinMeetingForm.addEventListener('submit', e => {
    e.preventDefault();
    const meetingId = joinMeetingForm.meetingId.value;
    meeting = new Meeting(meetingId);
    document.getElementById('id').textContent = 'loading...';
    meeting.on('open', () => {
        document.getElementById('id').textContent = meeting.id;
        const self = meeting.members.find(m => m.self);
        const peerIdEl = document.getElementById('peerId');
        if (self.id === meeting.id) {
            document.getElementById('peerId').textContent = 'host';
        } else {
            document.getElementById('peerId').textContent = self.id;
        }
    })
    meeting.on('member-joined', member => {
        document.getElementById('members').innerHTML += `<li>${member.peer}</li>` ;
    })
    meeting.on('member-left', member => {
        document.getElementById('members').innerHTML = document.getElementById('members').innerHTML.replace(`<li>${member.peer}</li>`, '');
        console.log(member)
    })
    meeting.on('data', data => {
        document.getElementById('messages').innerHTML += `<li>${data}</li>`;
    })
});

const sendMessageForm = document.getElementById('sendMessageForm');
sendMessageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = sendMessageForm.message.value;
    document.getElementById('messages').innerHTML += `<li>${message}</li>`;
    e.target.reset();
    meeting.broadcast(message);
});
