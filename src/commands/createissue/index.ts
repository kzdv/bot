import Command from "../Command";
import Client from "../../lib/Client";
import Discord, { TextChannel } from "discord.js";
import axios from "axios";

export default class DevServerRestart extends Command {
  client: Client;

  constructor(client: Client) {
    super(client, {
      command: "create issue",
      description: "Create Github Issue, syntax: `create issue <repo> <issue>`",
      roles: [
        "everyone"
      ]
    });
    this.client = client;
  }

  async handle(message: Discord.Message, args: string[]): Promise<void> {
    if ((message.channel as TextChannel).name !== "web-chat") {
      return;
    }

    args = args.slice(this.command.split(" ").length)
    let issue = args.join(" ");
    let title = issue;
    if (title.length > 64) {
      title = `${title.substring(0, 64)}...`;
    }

    message.channel.send("Creating issue...");
    try {
      let resp = await axios.post(`https://api.github.com/repos/kzdv/info/issues`, {
        title: issue.substring(0, 64),
        body: `Issue created by ${message.member.displayName} (${message.author.username}): ${issue}`
      }, {
        headers: {
          Authorization: `Basic ${this.client.githubToken}`,
          Accept: "application/vnd.github+json"
        }
      })
      if (resp.status === 201) {
        message.channel.send(`Issue created: ${resp.data.html_url}`);
      } else {
        message.channel.send(`Error creating issue: ${resp.status}`);
      }
    } catch (e) {
      message.channel.send(`Error creating issue: ${e}`);
    }
  }
}