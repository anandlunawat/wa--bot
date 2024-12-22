const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
const dotenv = require("dotenv")
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const { AUTH_TOKEN, ACCOUNT_SID, FROM } = process.env;
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

// Webhook to receive incoming messages
app.post('/whatsapp-webhook', (req, res) => {
  const incomingMessage = req.body.Body; // Get the body of the incoming message (Confirm or Cancel)
  const from = req.body.From; // Get the sender's number

  console.log(`Incoming response: "${incomingMessage}" from ${from}`);

  const twiml = new MessagingResponse();

  // Handle the response based on the user's choice
  if (incomingMessage.toLowerCase() === 'present') {
      twiml.message('You have confirmed your action!');

      // Send another message with contentSid (media)
      sendMediaMessage(from);
  } else if (incomingMessage.toLowerCase() === 'absent') {
      twiml.message('You have canceled your action!');
  } else {
      twiml.message('Sorry, I didn’t understand that.');
  }

  // Send the response back to the user
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

// Function to send media (using contentSid)
function sendMediaMessage(to) {
  client.messages
      .create({
          from: `whatsapp:${FROM}`,  // Your Twilio WhatsApp number
          to: to, // Recipient's WhatsApp number
          contentSid: "HX92b607e6ee28bdffc6643ec2261ce4d7"
      })
      .then(message => console.log(`Media message sent with SID: ${message.sid}`))
      .catch(error => console.error('Error sending media message:', error));
}



// Function to send an automated message (this is similar to your original code)
function createMessage() {
    client.messages
        .create({
            from: `whatsapp:${FROM}`, // Twilio Sandbox number or your approved number
            to: 'whatsapp:+918390854549',  // Recipient's number
            contentSid: 'HX92b607e6ee28bdffc6643ec2261ce4d7'
            // 'HX6f27c257f671b88acd7f650ed7011627'
        })
        .then(message => console.log(`Message sent with SID: ${message.sid}`))
        .catch(error => console.error('Error sending message:', error));
}

// Test: Send a message after 1 second
setTimeout(() => {
    createMessage();
}, 1000);

// Start the server to listen for incoming webhooks
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
