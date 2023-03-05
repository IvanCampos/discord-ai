import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;

  const systemMessage = "You are a helpful assistant who responds succinctly";
  
  try {

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: systemMessage},
            {role: "user", content: message.content}
        ],
      });

    const content = response.data.choices[0].message;
    return message.reply(content);

  } catch (err) {
    console.error(err);
    return message.reply(
      "As an AI robot, I errored out."
    );
  }
});
client.login(process.env.BOT_TOKEN);