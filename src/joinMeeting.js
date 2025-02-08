import Peer from 'peerjs';

export const joinMeeting = meetingId => {
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
