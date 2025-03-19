import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import config from '../../config.json' with { type: 'json' };

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Belirtilen kullanıcıyı sunucudan yasaklar.')
        .addUserOption(option => 
            option.setName('kullanıcı')
            .setDescription('Yasaklanacak kullanıcı')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('sebep')
            .setDescription('Yasaklama sebebi')
            .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('kullanıcı');
        const reason = interaction.options.getString('sebep') || 'Sebep belirtilmemiş.';

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için `Üyeleri Yasakla` yetkisine sahip olmalısınız.', ephemeral: true });
        }

        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.ban({ reason });

            await interaction.reply({ content: `${user.tag} adlı kullanıcı başarıyla yasaklandı.\nSebep: ${reason}` });

            
            const logChannel = interaction.guild.channels.cache.get(config.logChannel);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('Kullanıcı Yasaklandı')
                    .setColor('Red')
                    .addFields(
                        { name: 'Kullanıcı', value: `${user.tag} (${user.id})`, inline: true },
                        { name: 'Yasaklayan', value: `${interaction.user.tag}`, inline: true },
                        { name: 'Sebep', value: reason }
                    )
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            } else {
                console.warn('Log kanalı bulunamadı. Lütfen config.json dosyasındaki logChannel ID’sini kontrol edin.');
            }

        } catch (error) {
            console.error('Ban komutunda hata:', error);
            interaction.reply({ content: 'Kullanıcı yasaklanırken bir hata oluştu.', ephemeral: true });
        }
    }
};
