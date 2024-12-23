const express = require("express");
const bodyParser = require("body-parser");
const { MessagingResponse } = require("twilio").twiml;
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const { AUTH_TOKEN, ACCOUNT_SID, FROM } = process.env;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

// Webhook to receive incoming messages
app.post("/whatsapp-webhook", (req, res) => {
    const incomingMessage = req.body.Body; // Get the body of the incoming message (Confirm or Cancel)
    const from = req.body.From; // Get the sender's number

    console.log(`Incoming response: "${incomingMessage}" from ${from}`);

    const twiml = new MessagingResponse();

    // Handle the response based on the user's choice
    if (incomingMessage.trim().toLowerCase() === "present") {
        twiml.message("You have confirmed your action!");
        sendMediaMessage(from);
    } else if (incomingMessage.trim().toLowerCase() === "absent") {
        twiml.message("You have canceled your action!");
    } else if (incomingMessage.trim().toLowerCase().includes("hii")) {
        twiml.message("Hello Welcome!!!");
        createMessage(from);
    } else {
        twiml.message("Sorry, I didn’t understand that.");
    }

    // Send the response back to the user
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
});

// Function to send media (using contentSid)
async function sendMediaMessage(to) {
    try {
        const message = await client.messages.create({
            from: `whatsapp:${FROM}`, // Twilio Sandbox number or your approved number
            to: to, // Recipient's number
            contentSid: "HX92b607e6ee28bdffc6643ec2261ce4d7",
        });
    } catch (e) {
        console.error("Error sending message:", e);
    }
}

// Function to send an automated message (this is similar to your original code)
async function createMessage(to) {
    try {
        const message = await client.messages.create({
            from: `whatsapp:${FROM}`, // Twilio Sandbox number or your approved number
            to: to, // Recipient's number
            contentSid: "HX6f27c257f671b88acd7f650ed7011627",
        });
        console.log(`Message sent with SID: ${message.sid}`);
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Start the server to listen for incoming webhooks
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
