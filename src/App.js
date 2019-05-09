import Chatkit from "@pusher/chatkit-client";
import React from "react";
import "./App.css";
import MessageList from "./components/MessageList";
import NewRoomForm from "./components/NewRoomForm";
import RoomList from "./components/RoomList";
import SendMessageForm from "./components/SendMessageForm";
import { instanceLocator, tokenUrl } from "./config";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    };

    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: "Mike",
      tokenProvider: new Chatkit.TokenProvider({
        url: tokenUrl
      })
    });

    chatManager.connect().then(currentUser => {
      this.currentUser = currentUser;

      this.currentUser.getJoinableRooms()
        .then(joinableRooms => {
          this.setState({
            joinableRooms,
            joinedRooms: this.currentUser.rooms
          })
        })
        .catch(err => console.log('error on joinableRooms: ', err))


      this.currentUser.subscribeToRoom({
        roomId: "20547498",
        hooks: {
          onMessage: message => {
            console.log("message.text: ", message.text);
            this.setState({
              messages: [...this.state.messages, message]
            });
          }
        }
      });
    });
  }

  sendMessage(text) {
    this.currentUser.sendMessage({
      text,
      roomId: "20547498"
    });
  }

  render() {
    console.log("this.state.messages:", this.state.messages);
    return (
      <div className="app">
        <RoomList rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
        <MessageList messages={this.state.messages} />
        <SendMessageForm sendMessage={this.sendMessage} />
        <NewRoomForm />
      </div>
    );
  }
}

export default App;
