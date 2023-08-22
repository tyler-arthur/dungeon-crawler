const peer = new Peer(); // Create a new Peer instance
const connectedPeers = {};

// Display your Peer ID
peer.on('open', (id) => {
    document.getElementById('peerId').textContent = id;
});

// Handle errors
peer.on('error', (err) => {
    console.error('PeerJS Error:', err);
});

// Generate a session link
document.getElementById('generateLink').addEventListener('click', () => {
    const sessionLink = `${window.location.href}?peer=${peer.id}`;
    document.getElementById('sessionLink').value = sessionLink;
});

// Parse the URL for peer ID
function getPeerIdFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('peer');
}

// Connect to another peer
function connectToPeer(otherPeerId) {
    const connection = peer.connect(otherPeerId);

    // Store the connected peer
    connectedPeers[otherPeerId] = connection;

    console.log(connectedPeers)

    // Handle data from the connected peer
    connection.on('data', (data) => {
        handleIncomingData(data, otherPeerId);
    });
}

// Automatically connect to peer from URL if available
const otherPeerId = getPeerIdFromURL();
if (otherPeerId) {
    connectToPeer(otherPeerId);
    console.log('connected')
}

// Display the list of connected peers
function updatePeerList() {
    const peerList = document.getElementById('peerList');
    peerList.innerHTML = '';
    for (const peerId in connectedPeers) {
        const listItem = document.createElement('li');
        listItem.textContent = peerId;
        peerList.appendChild(listItem);
    }
}

// Handle incoming data (chat messages)
function handleIncomingData(data, senderPeerId) {
    if (data.type === 'chat') {
        const chatMessages = document.getElementById('chatMessages');
        const messageItem = document.createElement('li');
        messageItem.textContent = `${senderPeerId}: ${data.message}`;
        chatMessages.appendChild(messageItem);
    }
}

// Send a chat message
document.getElementById('sendButton').addEventListener('click', () => {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    if (message !== '') {
        const chatData = {
            type: 'chat',
            message: message
        };

        for (const peerId in connectedPeers) {
            const connection = connectedPeers[peerId];
            connection.send(chatData);
        }

        const chatMessages = document.getElementById('chatMessages');
        const messageItem = document.createElement('li');
        messageItem.textContent = `You: ${message}`;
        chatMessages.appendChild(messageItem);

        chatInput.value = '';
    }
});

// Listen for connections from other peers
peer.on('connection', (connection) => {
    connectedPeers[connection.peer] = connection;

    connection.on('data', (data) => {
        handleIncomingData(data, connection.peer);
    });

    connection.on('close', () => {
        delete connectedPeers[connection.peer];
        updatePeerList();
    });

    updatePeerList();
    console.log(connectedPeers)
});