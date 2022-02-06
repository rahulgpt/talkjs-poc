import React, { useState } from "react";
import { Button, List, Input, Typography } from "antd";
import "antd/dist/antd.css";
import moralis from "lib/moralis";
import { useRouter } from "next/router";

const { Search } = Input;

//TODO:
//Send to multiple people
//Search token by SYMBOL
const LoggedOutState = () => {
  /* Authentication code */
  async function login() {
    let user = moralis.User.current();
    if (!user) {
      user = await moralis
        .authenticate({
          signingMessage: "Log in using Moralis",
        })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
          window.location.reload();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  return (
    <div>
      <Button onClick={login} type="primary">
        Log In
      </Button>
    </div>
  );
};

const LogOut = () => {
  async function logOut() {
    await moralis.User.logOut();
    console.log("logged out");
    window.location.reload();
  }
  return (
    <div>
      <Button onClick={logOut} type="dashed">
        Log Out
      </Button>
    </div>
  );
};

const Suffix = ({ tokenAddress }) => {
  const router = useRouter();
  const onSendToAll = () => {
    router.push(`/chat/${tokenAddress}`);
  };
  return (
    <Button onClick={onSendToAll} type="dashed">
      Send to all
    </Button>
  );
};

//add debounce
const SearchTokens = () => {
  // "0x3883f5e181fccaf8410fa61e12b59bad963fb645";
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenHolders, setTokenHolders] = useState([]);
  const router = useRouter();
  const user = moralis.User.current();
  const onSearch = async (value) => {
    const res = await moralis.Plugins.covalent.getBlockTokenHolders({
      chainId: 1,
      contractAddress: value,
      blockHeight: "latest", //how to get latest blockheight
      // startingBlock: "",
      // endingBlock: "",
      // pageNumber: 0,
      // pageSize: "",
      // quoteCurrency: "USD",
    });
    const data = res.data.items;
    const tokenHoldersPubKeys = data.map((each) => each.address);
    // setTokenHolders(tokenHoldersPubKeys);
    setTokenHolders([
      "0x5401E082ED965b134a27Ef3e0b48a7B4d89f426c",
      "0xB8268407A0B6b2292BB9cd61663AAaB6175A97dA",
    ]);
  };

  const onOpenChatWithTokenHolder = (tokenholder) => () => {
    router.push(`/chat/${user.get("ethAddress")}/${tokenholder}`);
  };

  const onSearchValueChange = (e) => {
    setTokenAddress(e.target.value);
  };
  return (
    <>
      <LogOut />
      <Search
        onChange={onSearchValueChange}
        suffix={Suffix({ tokenAddress })}
        placeholder="Insert Token Contract Address"
        onSearch={onSearch}
        enterButton
      />
      <List
        bordered
        dataSource={tokenHolders}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: "pointer" }}
            onClick={onOpenChatWithTokenHolder(item)}
          >
            <Typography.Text mark>{item}</Typography.Text>
          </List.Item>
        )}
      />
    </>
  );
};

const Home = () => {
  const user = moralis.User.current();

  return user ? <SearchTokens /> : <LoggedOutState />;
};

export default Home;

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userId: "",
//       targetId: "",
//     };

//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.handleUserIdChange = this.handleUserIdChange.bind(this);
//     this.handleTargetIdChange = this.handleTargetIdChange.bind(this);
//   }

//   handleSubmit(event) {
//     event.preventDefault();

//     this.props.router.push(`/chat/${this.state.userId}/${this.state.targetId}`);
//   }

//   handleUserIdChange(e) {
//     this.setState({ userId: e.target.value });
//   }

//   handleTargetIdChange(e) {
//     this.setState({ targetId: e.target.value });
//   }

//   render() {
//     return (
//       <div className={styles.container}>
//         <h1>Welcome</h1>
//         <form onSubmit={this.handleSubmit}>
//           <label>
//             Your Id:
//             <input
//               type="text"
//               name="name"
//               value={this.state.value}
//               onChange={this.handleUserIdChange}
//             />
//           </label>

//           <label>
//             Target Id:
//             <input
//               type="text"
//               name="name"
//               value={this.state.value}
//               onChange={this.handleTargetIdChange}
//             />
//           </label>
//           <input type="submit" value="Submit" />
//         </form>
//       </div>
//     );
//   }
// }

// export default withRouter(App);
