import { EmbedBuilder } from 'discord.js';
import fs from 'fs';

export function sendLog(guild, title, description, color = 0x00ff00) {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    const logChannel = guild.channels.cache.get(config.logChannel);

    if (logChannel) {
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
}
