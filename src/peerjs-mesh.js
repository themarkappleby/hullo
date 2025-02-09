import Peer from 'peerjs';

class Room {
    members = [];

    constructor() {
    }
}

export const createRoom = ({ namespace }) => {
    const promise = new Promise((resolve) => {
        const room = new Room();
        const peer = new Peer();
        resolve(room, peer);
    });
}

export const joinRoom = (roomId) => {
}