// map model to rooms
const playerRoom = {}

// map rooms to model
const rooms = {}

const createRoom = (id, name, roomName) => {
    if (rooms[roomName])
        return { error: "roomTaken" };
    if (!name)
        return { error: "badName" };
    if (!roomName)
        return { error: "badRoom" };
    roomName = roomName.toLowerCase();

    // clone default room
    const room = {
        name: roomName,
        players: [{
            id,
            name,
            leader: true,
            active: true,
        }]
    };
    rooms[roomName] = room;
    playerRoom[id] = room;
    return { room };
}

const joinRoom = (id, name, roomName) => {
    if (!roomName)
        return { error: "badRoom" };
    if (!name)
        return { error: "badName" };
    const room = rooms[roomName];
    if (!room)
        return { error: "noRoom" };

    const existingPlayer = room.players.find(player => player.name === name);
    if(existingPlayer && existingPlayer.active){
        return { error: "nameTaken" };
    } else if(existingPlayer){
        // if player disconnected, let them join back in as who they were previously
        existingPlayer.active = true;
        existingPlayer.id = id;
        return { room };
    }

    room.players.push({
        id,
        name,
        leader: false,
        active: true,
    });

    playerRoom[id] = room;
    return { room }
}

const getRoomByName = roomName => {
    return rooms[roomName];
}

const getRoomById = id => {
    return playerRoom[id];
}

const disconnectPlayer = id => {
    const room = playerRoom[id];
    if(!room)
        return;
    delete playerRoom[id];
    const player = room.players.find(player => player.id === id);
    player.active = false;
    // if no model are still active delete the room
    const activePlayer = room.players.find(player => player.active);
    if(!activePlayer)
        delete rooms[room.name];
    else if(player.leader)
        activePlayer.leader = true;
}


module.exports = {createRoom, joinRoom, getRoomById, getRoomByName, disconnectPlayer}