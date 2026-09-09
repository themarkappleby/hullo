function calculateDistance(participant1, participant2) {
    const [x1, y1, z1] = participant1.position;
    const [x2, y2, z2] = participant2.position;
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
    return distance;
}

function calculateDistances(localParticipant, remoteParticipants) {
    const orderedParticipants = remoteParticipants
        .map(remoteParticipant => ({
            id: remoteParticipant.id,
            distance: calculateDistance(localParticipant, remoteParticipant)
        }))
        .filter(participant => participant.id !== localParticipant.id)
        .sort((a, b) => a.distance - b.distance);
    
    return orderedParticipants;
}

export default calculateDistances;
