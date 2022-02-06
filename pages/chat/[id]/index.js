import React, { Component } from "react";
import Talk from "talkjs";
import { withRouter } from "next/router";
import moralis from "lib/moralis";
import { v4 as uuidv4 } from "uuid";

async function getBulletin(tokenAddress) {
  const Bulletin = moralis.Object.extend("TokenBulletin");
  const query = new moralis.Query(Bulletin);
  query.equalTo("tokenAddress", tokenAddress);
  const results = await query.find();
  return results;
}

function createNewBulletin(tokenAddress, chatId) {
  const Bulletin = moralis.Object.extend("TokenBulletin");
  const publicBulletin = new Bulletin();
  const bulletinACL = new moralis.ACL(moralis.User.current());
  //TODO: Only token holders should have read and write access
  //one solution is to set private read, write access to only the contract owner, the user needs to be manually verified.
  //Alternatively, have read, write access given to rogue admin which hides behind a proxy server to verify token holders when they pass the mark i.e. min amoount of tokens held. In other to meet security requirements, chatJS + moralis needs to interfaced with behind a proxy server.
  //Token holders sign in through us
  //Behind our servers
  //We sign the user in to moralis
  //get token information about the user
  //if all passes, we give the user bulletin read and write access
  bulletinACL.setPublicReadAccess(true);
  bulletinACL.setPublicWriteAccess(true);
  publicBulletin.setACL(bulletinACL);
  publicBulletin.set("tokenAddress", tokenAddress);
  publicBulletin.set("chatId", chatId);
  publicBulletin.save();
}

class GroupChat extends Component {
  constructor(props) {
    super(props);

    this.inbox = undefined;
    this.state = {
      tokenAddress: "",
    };
  }

  async componentDidMount() {
    Talk.ready
      .then(async () => {
        const pathname = window.location.pathname;
        const query = pathname.split("/");
        const tokenAddress = query[2].toUpperCase();

        const res = await moralis.Plugins.covalent.getBlockTokenHolders({
          chainId: 1,
          contractAddress: tokenAddress.toLowerCase(),
          blockHeight: "latest", //how to get latest blockheight
          // startingBlock: "",
          // endingBlock: "",
          // pageNumber: 0,
          // pageSize: "",
          // quoteCurrency: "USD",
        });
        const data = res.data.items;
        // const tokenHoldersPubKeys = data.map((each) => each.address);
        const tokenHoldersPubKeys = [
          "0x5401E082ED965b134a27Ef3e0b48a7B4d89f426c",
          "0xB8268407A0B6b2292BB9cd61663AAaB6175A97dA",
        ];

        const myPubKey = moralis.User.current().get("ethAddress");
        const me = new Talk.User({
          id: myPubKey,
          name: myPubKey,
          email: `${myPubKey}@gmail.com`,
        });

        if (!window.talkSession) {
          window.talkSession = new Talk.Session({
            appId: "t6NhgaOQ",
            me,
          });
        }

        const bulletinBoard = await getBulletin(tokenAddress);
        const chatId = bulletinBoard.length
          ? bulletinBoard[0].attributes.chatId
          : uuidv4();

        if (bulletinBoard.length === 0) {
          createNewBulletin(tokenAddress, chatId);
        }

        const conversation = window.talkSession.getOrCreateConversation(chatId);

        conversation.setParticipant(me);

        tokenHoldersPubKeys
          .filter((each) => each.id !== me.id.toUpperCase())
          .forEach((each) => {
            const newUser = new Talk.User({
              id: each,
              name: each,
              email: `${each}@gmail.com`,
            });
            conversation.setParticipant(newUser);
          });

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

export default withRouter(GroupChat);
