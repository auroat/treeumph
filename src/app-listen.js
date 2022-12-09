import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN } from "./constants"

const { App } = require('@slack/bolt');

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  appToken: SLACK_APP_TOKEN,
  socketMode: true,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000
});

// Listens to incoming messages that contain "hello"
app.message('New Shoutout from ', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    // await say(`Hey there <@${message.user}>!`);
    // await say(`Thank you! A new tree plant request was sent. :deciduous_tree: :heart:`);

    await say({
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `Hey there! Would you like to send a tree plant request? :deciduous_tree: :alphabet-yellow-question:`
            },
            },
          {
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Yes",
						"emoji": true
					},
					"action_id": "send_plant_tree_request"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "No",
						"emoji": true
					},
					"action_id": "cancel"
				}
			]
		}
        ],
        // The text is a fallback for notifications and accessibility.
        text: `Hey there <@${message.user}>!`
    });
});

app.action('send_plant_tree_request', async ({ body, ack, respond }) => {
    // Acknowledge the action
    await ack();
    await respond({
        "replace_original": "true",
        "text": `Thanks <@${body.user.id}>! A new tree plant request was sent :deciduous_tree: :heart:`
    });
});

app.action('cancel', async ({ body, ack, respond }) => {
    // Acknowledge the action
    await ack();
    await respond({
        "replace_original": "true",
        "text": `No tree plant request sent. Thanks <@${body.user.id}> :deciduous_tree: :cry:`
    });
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log('Treeumph is running!');
})();