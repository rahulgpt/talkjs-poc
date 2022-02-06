import React, { Component } from "react";
import Talk from "talkjs";
import { withRouter } from "next/router";

//TODO:
//how to prevent people from generating the chat id?
//1. encrypting it using HMAC?
//2. Use the API, the secret is in the backend and the user needs to authenticate in order to get the messages
//The concept of private vs public chats?
class Chat extends Component {
  constructor(props) {
    super(props);

    this.inbox = undefined;
  }

  componentDidMount() {
    // Promise can be `then`ed multiple times
    const pathname = window.location.pathname;
    const query = pathname.split("/");
    const id = query[2].toUpperCase();
    const targetId = query[3].toUpperCase();
    Talk.ready
      .then(() => {
        // const users = {
        //   12345: {
        //     name: "Aaron Jack",
        //     email: "george@looney.net",
        //     photoUrl: "https://randomuser.me/api/portraits/men/15.jpg",
        //     welcomeMessage: "Hey there! How are you? :-)",
        //   },

        //   54321: {
        //     name: "Albert Johnston",
        //     email: "ronald@teflon.com",
        //     photoUrl: "https://randomuser.me/api/portraits/men/42.jpg",
        //     welcomeMessage: "Hey there! Love to chat :-)",
        //   },
        // };

        const me = new Talk.User({
          id,
          name: id,
          email: "email1@gmail.com",
          //   name: users[id].name,
          //   email: users[id].email,
          //   photoUrl: users[id].photoUrl,
          //   welcomeMessage: users[id].welcomeMessage,
        });

        const other = new Talk.User({
          // id: "54321",
          id: targetId,
          name: targetId,
          email: "email3@gmail.com",
          //   name: users[targetId].name,
          //   email: users[targetId].email,
          //   photoUrl: users[targetId].photoUrl,
          //   welcomeMessage: users[targetId].welcomeMessage,
        });

        if (!window.talkSession) {
          window.talkSession = new Talk.Session({
            appId: "t6NhgaOQ",
            me: me,
          });
        }

        // You control the ID of a conversation. oneOnOneId is a helper method that generates
        // a unique conversation ID for a given pair of users.
        const conversationId = Talk.oneOnOneId(me, other);

        const conversation =
          window.talkSession.getOrCreateConversation(conversationId);
        conversation.setParticipant(me);
        conversation.setParticipant(other);

        this.inbox = window.talkSession.createInbox({
          selected: conversation,
        });
        this.inbox.mount(this.container);
      })
      .catch((e) => console.error(e));
  }

  componentWillUnmount() {
    if (this.inbox) {
      this.inbox.destroy();
    }
  }

  render() {
    return (
      <span>
        <div style={{ height: "500px" }} ref={(c) => (this.container = c)}>
          Loading...
        </div>
      </span>
    );
  }
}

export default withRouter(Chat);
