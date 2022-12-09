import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN } from "./constants"
import { App } from "@slack/bolt"

const app = new App({
    token: SLACK_BOT_TOKEN,
    signingSecret: SLACK_SIGNING_SECRET,
    appToken: SLACK_APP_TOKEN,
    socketMode: true
});

// Find conversation ID using the conversations.list method
async function findConversation(name) {
    let conversationId;

    try {
      // Call the conversations.list method using the built-in WebClient
      const result = await app.client.conversations.list({
        // The token you used to initialize your app
        token: SLACK_BOT_TOKEN,
        limit: 999
      });
  
      for (const channel of result.channels) {
        if (channel.name === name) {
          conversationId = channel.id;
          console.log("Found conversation ID: " + conversationId);
          break;
        }
      }
    }
    catch (error) {
      console.error(error);
    }

    return conversationId;
  }
  
// Post a message to a channel your app is in using ID and message text
async function publishMessage(conversationId, text) {
    try {
        // Call the chat.postMessage method using the built-in WebClient
        const result = await app.client.chat.postMessage({
            // The token you used to initialize your app
            token: SLACK_BOT_TOKEN,
            channel: conversationId,
            text: text
            // You could also use a blocks[] array to send richer content
        });

        // Print result, which includes information about the message (like TS)
        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
}

findConversation("resource-pool-hackternoon-development")
    .then((conversationId) => publishMessage(conversationId, "Hello world! Mwhahaha :tada:"));