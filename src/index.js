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