

import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    data: new SlashCommandBuilder()
        .setName('spoofer')
        .setDescription('Spoofer güncellemelerini duyurur')
        .addStringOption(option =>
            option.setName('oyun')
                .setDescription('Hangi oyun için spoofer güncellemesi yapılacak?')
                .setRequired(true)
                .addChoices(
                    { name: 'Valorant', value: 'valorant' },
                )
        )
        .addStringOption(option =>
            option.setName('admin_notu')
                .setDescription('Admin notu ekleyin (isteğe bağlı)')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const oyun = interaction.options.getString('oyun');
            const adminNotu = interaction.options.getString('admin_notu');
            const bildirimKanali = '1349847969968558141'; // Bildirim kanalının ID'si
            
            
            const resimYolu = path.join(__dirname, '..', '..', 'resimler', `${oyun}.png`);
            
            
            if (!fs.existsSync(resimYolu)) {
                return await interaction.reply({
                    content: 'Bu oyun için resim dosyası bulunamadı!',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${oyun.toUpperCase()} Spoofer Güncellemesi`)
                .setDescription(`${oyun.charAt(0).toUpperCase() + oyun.slice(1)} spoofer güncellendi.\n\nYeni loader hakkında <#1349905323837882529> kanalından bilgi alabilirsiniz.\nSatın alım için ticket açmanız gerekir.`)
                .setImage(`attachment://${oyun}.png`)
                .setTimestamp();

            
            if (adminNotu) {
                embed.setFooter({ text: `Admin Notu: ${adminNotu}` });
            }

            
            const channel = await interaction.client.channels.fetch(bildirimKanali);
            await channel.send({
                embeds: [embed],
                files: [resimYolu]
            });

            
            await interaction.reply({
                content: 'Spoofer güncellemesi başarıyla duyuruldu!',
                ephemeral: true
            });

        } catch (error) {
            console.error('Spoofer komutunda hata:', error);
            await interaction.reply({
                content: 'Bir hata oluştu! Lütfen daha sonra tekrar deneyin.',
                ephemeral: true
            });
        }
    },
};
