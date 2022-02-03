import { Component } from 'react';
import Talk from 'talkjs';

class InboxComponent extends Component {
    componentDidMount() {
        const currentUser = this.props.currentUser;

        Talk.ready.then(() => {
            var me = new Talk.User({
                id: '187324',
                name: 'Tom',
                email: 'Tom@example.com',
                photoUrl: 'https://demo.talkjs.com/img/sebastian.jpg',
                welcomeMessage: 'Hey there! How are you? :-)',
                role: 'default',
            });

            inbox.mount(this.talkjsContainer.current);
        });

        var other = new Talk.User({
            id: '654321',
            name: 'Sebastian',
            email: 'Sebastian@example.com',
            photoUrl: 'https://demo.talkjs.com/img/sebastian.jpg',
            welcomeMessage: 'Hey, how can I help?',
            role: 'default',
        });

        window.talkSession = new Talk.Session({
            appId: 't6NhgaOQ',
            me: me,
        });

        var conversation = window.talkSession.getOrCreateConversation(
            Talk.oneOnOneId(me, other)
        );

        conversation.setParticipant(me);
        conversation.setParticipant(other);

        var inbox = window.talkSession.createInbox({ selected: conversation });
    }

    constructor(props) {
        super(props);
        this.talkjsContainer = React.createRef();
    }

    render() {
        return () => {
            <div ref={this.talkjsContainer}></div>
        }
    }
}

export default InboxComponent;