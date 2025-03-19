import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Ticket mesajını oluşturur')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Ticket mesajının gönderileceği kanal')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('kanal');
            const resimYolu = path.join(__dirname, '..', '..', 'resimler', 'ticket.png');

            if (!channel.isTextBased()) {
                return await interaction.reply({
                    content: 'Lütfen geçerli bir metin kanalı seçin!',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🎫 Destek Sistemi')
                .setDescription('Spoofer destek için ticket açın')
                .setImage('attachment://ticket.png')
                .setFooter({ text: 'Destek almak için aşağıdaki butona tıklayın.' });

            const button = new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('Ticket Oluştur')
                .setEmoji('🎫')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder()
                .addComponents(button);

            await channel.send({
                embeds: [embed],
                components: [row],
                files: [{
                    attachment: resimYolu,
                    name: 'ticket.png'
                }]
            });

            await interaction.reply({
                content: `Ticket mesajı ${channel} kanalına başarıyla gönderildi!`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Ticket oluşturma hatası:', error);
            await interaction.reply({
                content: 'Bir hata oluştu!',
                ephemeral: true
            });
        }
    },
};
