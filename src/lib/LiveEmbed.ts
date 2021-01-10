import Discord from "discord.js";


class LiveEmbed {
  static createFromApplication(apptype: string, appquestions: string[], appdata: string[]): Discord.MessageEmbed {
    const msgEmbed = new Discord.MessageEmbed();
    msgEmbed.setColor("#ff0000");
    msgEmbed.setTitle(`APPLICATION TYPE: ${apptype.toUpperCase()}`);
    appquestions.forEach((_,idx) => {
      msgEmbed.addField(appquestions[idx], (appdata[idx] == null || appdata[idx] == "") ? "Blank" : appdata[idx], false);
    });
    msgEmbed.setFooter("END OF LINE.");
    return msgEmbed;
  }
}

export default LiveEmbed;
