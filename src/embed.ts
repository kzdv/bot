import Discord from "discord.js";

interface TwitchStreamInfo {
  id: string;
  user_id: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
}

class LiveEmbed {
  static createFromStream(streamData: TwitchStreamInfo): Discord.MessageEmbed {
    const msgEmbed = new Discord.MessageEmbed();
    msgEmbed.setColor("#9146ff");
    msgEmbed.setURL(`https://www.twitch.tv/${streamData.user_name}`);
    let thumbUrl = streamData.thumbnail_url;
    thumbUrl = thumbUrl.replace("{width}", "1280");
    thumbUrl = thumbUrl.replace("{height}", "720");
    msgEmbed.setImage(thumbUrl);
    msgEmbed.setTitle(`**${streamData.user_name} is live on Twitch!**`);
    msgEmbed.addField("Title", streamData.title, false);
    return msgEmbed;
  }
}

export default LiveEmbed;
