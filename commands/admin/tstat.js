import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { loadStats } from '../../utils/ticketUtils.js';

export default {
    data: new SlashCommandBuilder()
        .setName('tstat')
        .setDescription('Yetkili ticket istatistiklerini gösterir')
        .addUserOption(option =>
            option.setName('yetkili')
                .setDescription('İstatistikleri görüntülenecek yetkili')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const yetkili = interaction.options.getUser('yetkili');
            const stats = await loadStats();
            
            const yetkiliStats = stats[yetkili.id] || {
                toplamTicket: 0,
                cozulenTicket: 0,
                cozulmeyen: 0
            };

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Ticket İstatistikleri')
                .setDescription(`${yetkili.tag} yetkilisinin istatistikleri`)
                .addFields(
                    { name: 'Toplam İlgilenilen Ticket', value: yetkiliStats.toplamTicket.toString(), inline: true },
                    { name: 'Çözülen Ticket', value: yetkiliStats.cozulenTicket.toString(), inline: true },
                    { name: 'Çözülmeyen Ticket', value: yetkiliStats.cozulmeyen.toString(), inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Ticket istatistik hatası:', error);
            await interaction.reply({
                content: 'İstatistikler görüntülenirken bir hata oluştu!',
                ephemeral: true
            });
        }
    },
};
