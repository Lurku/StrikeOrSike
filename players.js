// map players to rooms
const players = {}

// map rooms to players
const rooms = {}

const DEFAULT_ROOM = {
    name: "",
    players: []
}

const createRoom = (name, roomName) => {
    if (rooms[roomName])
        return { error: "Room has already been taken" };
    if (!name && !roomName)
        return { error: "Username and room are required" };
    if (!name)
        return { error: "Username is required" };
    if (!roomName)
        return { error: "Room is required" };

    // clone default room
    const room = { ...DEFAULT_ROOM };
    room.name = roomName;
    rooms[roomName] = room;
    room.players.push({
       id: '',
       name,
       leader: true,
       active: false,
    });
    console.log(rooms);
    return { room };
}

const joinRoom = (id, name, roomName) => {
    const roomResult = isRoomJoinable(name, roomName);
    if( roomResult.error ) return roomResult;
    const room = roomResult.room;

    const existingPlayer = room.players.find(player => player.name === name);
    if(existingPlayer){
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

    players[id] = room;
    return { room }
}

const isRoomJoinable = (name, roomName) => {
    const room = rooms[roomName];
    if (!room)
        return { error: "Room does not exist" };
    if (!name && !roomName)
        return { error: "Username and room are required" };
    if (!name)
        return { error: "Username is required" };
    if (!roomName)
        return { error: "Room is required" };

    const existingPlayer = room.players.find(player => player.name === name && player.active === true);
    if(existingPlayer)
        return {error: "Name already taken"};

    console.log(rooms);

    return { room };
}

const getRoom = roomName => {
    return rooms[roomName];
}

const disconnectPlayer = id => {
    const room = players[id];
    const player = room.players.find(player => player.id === id);
    player.active = false;
    // if no players are still active delete the room
    const activePlayer = room.players.find(player => player.active);
    if(!activePlayer)
        rooms.remove(room.name);
    if(player.leader)
        activePlayer.leader = true;
}


module.exports = {createRoom, joinRoom, getRoom, isRoomJoinable, disconnectPlayer }