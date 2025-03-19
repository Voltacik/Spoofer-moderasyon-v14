import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('sil')
        .setDescription('Belirtilen sayıda mesajı siler')
        .addIntegerOption(option =>
            option.setName('miktar')
                .setDescription('Silinecek mesaj sayısı (1-100 arası)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        try {
            const miktar = interaction.options.getInteger('miktar');
            const channel = interaction.channel;

            
            const silinecekMesajlar = await channel.messages.fetch({ limit: miktar });
            await channel.bulkDelete(silinecekMesajlar, true)
                .then(async (messages) => {
                    const silinmeSayisi = messages.size;
                    
                    
                    await interaction.reply({
                        content: `✅ Başarıyla ${silinmeSayisi} mesaj silindi!`,
                        ephemeral: true
                    });

                    
                    setTimeout(async () => {
                        if (interaction.replied) {
                            await interaction.deleteReply().catch(() => {});
                        }
                    }, 5000);
                });

        } catch (error) {
            console.error('Mesaj silme hatası:', error);

            
            let hataMsg = 'Mesajlar silinirken bir hata oluştu!';
            
            if (error.code === 50034) {
                hataMsg = '14 günden eski mesajlar toplu olarak silinemez!';
            }

            await interaction.reply({
                content: `❌ ${hataMsg}`,
                ephemeral: true
            }).catch(() => {});
        }
    },
};
