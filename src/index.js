import Meeting from './Meeting';

const $ = (selector) => {
    if (selector.startsWith('#')) return document.querySelector(selector);
    return document.querySelectorAll(selector);
}

const meetingIdEl = $('#id');
const peerIdEl = $('#peerId');
const membersEl = $('#members');
const messagesEl = $('#messages');

window.meeting = null;

const joinMeetingForm = document.getElementById('joinMeetingForm');
joinMeetingForm.addEventListener('submit', e => {
    e.preventDefault();
    const meetingId = joinMeetingForm.meetingId.value;
    meeting = new Meeting(meetingId);
    meetingIdEl.textContent = 'loading...';
    meeting.on('open', () => {
        meetingIdEl.textContent = meeting.id;
        if (meeting.self.id === meeting.id) {
            peerIdEl.textContent = 'host';
        } else {
            peerIdEl.textContent = meeting.self.id;
        }
    })
    meeting.on('member-joined', member => {
        membersEl.innerHTML += `<li>${member.peer}</li>` ;
    })
    meeting.on('member-left', member => {
        membersEl.innerHTML = membersEl.innerHTML.replace(`<li>${member.peer}</li>`, '');
    })
    meeting.on('data', data => {
        messagesEl.innerHTML += `<li>${data}</li>`;
    })
});

const sendMessageForm = document.getElementById('sendMessageForm');
sendMessageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = sendMessageForm.message.value;
    messagesEl.innerHTML += `<li>${message}</li>`;
    e.target.reset();
    meeting.broadcast(message);
});
