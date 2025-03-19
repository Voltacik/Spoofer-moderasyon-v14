import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const command = {
    data: new SlashCommandBuilder()
        .setName('rechannel')
        .setDescription('Bulunduğun kanalı aynı izinlerle yeniden oluşturur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const channel = interaction.channel;

        await interaction.reply({ content: `🔄 **${channel.name}** kanalı aynı izinlerle yeniden oluşturuluyor...`, ephemeral: true });

        const channelName = channel.name;
        const channelTopic = channel.topic;
        const parentID = channel.parentId;
        const position = channel.position;
        const permissions = channel.permissionOverwrites.cache.map(overwrite => ({
            id: overwrite.id,
            allow: overwrite.allow.bitfield,
            deny: overwrite.deny.bitfield,
            type: overwrite.type
        }));

        try {
            const guild = interaction.guild;

            
            await channel.delete();

            const newChannel = await guild.channels.create({
                name: channelName,
                type: channel.type,
                topic: channelTopic ?? undefined,
                parent: parentID ?? undefined,
                position: position,
                permissionOverwrites: permissions
            });

            
            
            await newChannel.send(`✅ **${channelName}** kanalı başarıyla yeniden oluşturuldu.`);

        } catch (error) {
            console.error('Kanal yeniden oluşturulurken hata:', error);

            
            
            const logChannel = interaction.guild.channels.cache.find(ch => ch.name === 'volta-log');
            if (logChannel) {
                await logChannel.send(`❌ Kanal yeniden oluşturma sırasında hata: \`\`\`${error.message}\`\`\``);
            }
        }
    }
};

export default command;
