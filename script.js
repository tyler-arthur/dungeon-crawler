// Initialize PeerJS
const peer = new Peer();

peer.on('open', (peerId) => {
    console.log('My peer ID is: ' + peerId);

    // Establish connection
    const connections = {};

    // Listen for incoming connections
    peer.on('connection', (connection) => {
        connections[connection.peer] = connection;
        connection.on('data', (data) => {
            displayMessage(connection.peer, data);
        });
    });

    let connection;
    // Connect to a peer using their id
    document.getElementById('connectButton').addEventListener('click', () => {
        const targetPeer = document.getElementById('peerConnect').value;
        console.log(targetPeer)
        connection = peer.connect(targetPeer);
        console.log(`Connected to: ${targetPeer}`)
        connection.on('open', () => {
            connection.send(`${peerId} has connected.`)
            displayMessage('You', `You are connected to ${targetPeer}`);
        })
    })

    const sendMessage = () => {
        if (connection) {
            console.log(connection)
            connection.on('open', () => {
                connection.send(document.getElementById('messageInput').value);
                displayMessage('You', document.getElementById('messageInput').value);
                document.getElementById('messageInput').value = '';
            });
        }
    }

    // Send message to connected peer
    document.getElementById('sendButton').addEventListener('click', () => sendMessage());
    document.getElementById('messageInput').addEventListener('keyup', (event) => {
        if (event.key === 'enter') sendMessage();
    });

    // Display messages in the chat log
    const displayMessage = (sender, message) => {
        const chatLog = document.getElementById('chatLog');
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatLog.appendChild(messageDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
});
