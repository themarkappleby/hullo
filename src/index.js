import Peer from 'peerjs';

const NAMESPACE = 'hullo'
// const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const form = document.getElementById('connectForm');
form.addEventListener('submit', e => {
    e.preventDefault();
    const meetingId = `${NAMESPACE}-${form.connectTo.value}`;
    joinMeeting(meetingId).then(peer => {
        console.log('id', peer.id)
        const idEl = document.getElementById('id');
        idEl.textContent = `Your ID: ${peer.id}`;
    });
})

function joinMeeting(meetingId) {
    const promise = new Promise((resolve) => {
        let peer = new Peer(meetingId);
        peer.on('open', () => {
            resolve(peer);
        })
        peer.on('error', error => {
            if (error.type === 'unavailable-id') {
                peer = new Peer();
                peer.on('open', () => {
                    resolve(peer);
                    const connection = peer.connect(meetingId);
                    connection.on('open', function(){
                        connection.send(peer.id);
                    });
                })
            } else {
                console.error(error)
            }
        })
        peer.on('connection', function(connection) {
            connection.on('data', function(data){
                console.log('recieved', data)
            });
        });
    });
    return promise;
}

/*
const url = new URL(window.location.href);
var peer = new Peer(`${NAMESPACE}-${getRandom(1000, 9999)}`);
document.getElementById('id').textContent = `Your ID: ${peer.id}`;

peer.on('open', function(){
    // If peerId is in url, connect to it
    const peerId = url.searchParams.get('peerId');
    if (peerId) {
        console.log(peerId)
        const connection = peer.connect(peerId);
        connection.on('open', function(){
            console.log('send')
            connection.send(peer.id);
        });
    } else {
        url.searchParams.set('peerId', peer.id);
        history.pushState(null, '', url);
    }
})

peer.on('connection', function(connection) {
  connection.on('data', function(data){
    url.searchParams.set('peerId', data);
    console.log('recieved', data)
    history.pushState(null, '', url);
  });
});
*/

/*
const connectForm = document.getElementById('connectForm');
connectForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = connectForm.connectTo.value;
    connectForm.connectTo.value = '';
    var connection = peer.connect(id);
    connection.on('open', function(){
        connection.send('hi!');
    });
})
*/


/*
// Connect
var conn = peer.connect('another-peers-id');
// on open will be launch when you successfully connect to PeerServer
conn.on('open', function(){
  // here you have conn.id
  conn.send('hi!');
});
*/

/*
// Recieve
peer.on('connection', function(conn) {
  conn.on('data', function(data){
    // Will print 'hi!'
    console.log(data);
  });
});
*/
