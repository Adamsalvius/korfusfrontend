import { useState, useEffect } from "react";
import { io } from "socket.io-client";

let socket = io("https://backendkk1.herokuapp.com");

function App() {
  const [room, setRoom] = useState("first");
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMesg, setNewMesg] = useState("");
  const [isShown, setIsShown] = useState(false);

  function joinRoom(roomName) {
    socket.emit("join_room", roomName, (res) => {
      console.log(res.status);
    });
    setRoom(roomName);
  }

  function createRoom() {
    let goodRoom = rooms.some((room_name) => room_name.room_name === newRoom);
    if (goodRoom) {
      alert("that room is already born!");
    } else if (newRoom) {
      socket.emit("create_room", newRoom, (res) => {
        console.log(res.status);
      });
    } else {
      alert("the name is just wrong, or too short!");
    }
  }

  function sentMessage() {
    if (newMesg) {
      socket.emit("post_message", newMesg, socket.id, (res) => {
        console.log(res.status);
      });
    } else {
      alert("Enter your message");
    }
  }

  function deleteRoom(id, room) {
    console.log(id, room);
    socket.emit("delete_room", id, room, (res) => {
      console.log(res.status);
    });
  }

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("ready", (res) => {
        console.log(res.status);
      });
      socket.on("get_rooms", (data) => {
        setRooms(data);
      });
      socket.on("get_messages", (data) => {
        setMessages(data);
      });
    });
  }, []);

  return (
    <>
      <p>Active room: {room} </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          onChange={(event) => [setNewRoom(event.target.value)]}
          placeholder="new room"
        />
        <button onClick={() => [createRoom()]}>{"+"}</button>
      </form>
      <p>Rooms:</p>
      <div>
        {rooms.map((room) => (
          <div>
            <h2
              onClick={() => {
                [joinRoom(room.room_name)];
              }}
            >
              {room.room_name}
            </h2>

            <button onClick={() => [deleteRoom(room.id, room.room_name)]}>
              delete^
            </button>
          </div>
        ))}

        <h3>______end of rooms______</h3>
      </div>

      <div>
        {messages.map((message) => (
          <div
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
          >
            <div>
              <p>{message.user} says: </p>
            </div>
            <h3>{message.value} </h3>

            {isShown && <p>{"^^^^^^" + message.date + "^^^^^"}</p>}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          onChange={(event) => setNewMesg(event.target.value)}
          placeholder="write something cool"
        />
        <button onClick={() => [sentMessage()]}>{">"}</button>
      </form>
    </>
  );
}

export default App;
