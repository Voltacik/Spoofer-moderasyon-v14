import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    data: new SlashCommandBuilder()
        .setName('duyuru')
        .setDescription('Duyuru yapar')
        .addStringOption(option =>
            option.setName('başlık')
                .setDescription('Duyuru başlığı')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mesaj')
                .setDescription('Duyuru mesajı')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Duyurunun gönderileceği kanal')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const başlık = interaction.options.getString('başlık');
            const mesaj = interaction.options.getString('mesaj');
            const duyuruKanal = interaction.options.getChannel('kanal');
            const logKanalId = '1349863173339091007';
            const okuyanlar = new Set();

            if (!duyuruKanal.isTextBased()) {
                return await interaction.reply({
                    content: 'Lütfen geçerli bir metin kanalı seçin!',
                    ephemeral: true
                });
            }
            
            const resimYolu = path.join(__dirname, '..', '..', 'resimler', 'duyuru.png');
            
            if (!fs.existsSync(resimYolu)) {
                return await interaction.reply({
                    content: 'Duyuru resmi bulunamadı!',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`<:duyuru:1349909336222208040> ${başlık}`)
                .setDescription(mesaj)
                .setImage('attachment://duyuru.png')
                .setFooter({ text: `Duyuruyu okuduysanız lütfen okudum butonuna basmayı unutmayın! | 0 kişi okudu` });

            const button = new ButtonBuilder()
                .setCustomId('okudum_button')
                .setLabel('Okudum')
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder()
                .addComponents(button);

            const duyuruMesaji = await duyuruKanal.send({
                content: '@everyone',
                embeds: [embed],
                files: [{
                    attachment: resimYolu,
                    name: 'duyuru.png'
                }],
                components: [row],
                allowedMentions: { 
                    parse: ['everyone']
                }
            });

            const collector = duyuruMesaji.createMessageComponentCollector({
                filter: i => i.customId === 'okudum_button'
            });

            collector.on('collect', async (i) => {
                try {
                    if (okuyanlar.has(i.user.id)) {
                        return await i.reply({
                            content: 'Bu duyuruyu zaten okuduğunuzu belirtmişsiniz!',
                            ephemeral: true
                        });
                    }

                    okuyanlar.add(i.user.id);

                    await i.reply({
                        content: 'Duyuruyu okuduğunuz kaydedildi!',
                        ephemeral: true
                    });

                    const originalEmbed = duyuruMesaji.embeds[0];
                    const güncelEmbed = new EmbedBuilder()
                        .setColor(originalEmbed.color)
                        .setTitle(originalEmbed.title)
                        .setDescription(originalEmbed.description)
                        .setImage('attachment://duyuru.png')
                        .setFooter({ text: `Duyuruyu okuduysanız lütfen okudum butonuna basmayı unutmayın! | ${okuyanlar.size} kişi okudu` });

                    await duyuruMesaji.edit({
                        embeds: [güncelEmbed],
                        files: [{
                            attachment: resimYolu,
                            name: 'duyuru.png'
                        }],
                        components: [row]
                    });

                    const logKanali = await interaction.client.channels.fetch(logKanalId);
                    
                    let okuyanlarListesi = '';
                    let sayac = 1;
                    for (const userId of okuyanlar) {
                        const user = await interaction.client.users.fetch(userId);
                        okuyanlarListesi += `${sayac}. ${user.tag}\n`;
                        sayac++;
                    }

                    const logEmbed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle('Duyuru Okundu')
                        .setDescription(`**Kullanıcı:** ${i.user.tag} (${i.user.id})\n**Duyuru Başlığı:** ${başlık}\n**Duyuru Kanalı:** ${duyuruKanal.name}\n**Okunma Zamanı:** <t:${Math.floor(Date.now() / 1000)}:F>\n\n**Toplam Okuyan:** ${okuyanlar.size} kişi`)
                        .addFields({
                            name: 'Okuyanların Listesi',
                            value: okuyanlarListesi || 'Henüz okuyan yok'
                        });

                    await logKanali.send({ embeds: [logEmbed] });

                } catch (error) {
                    console.error('Log gönderiminde hata:', error);
                    await i.reply({
                        content: 'Bir hata oluştu! Lütfen daha sonra tekrar deneyin.',
                        ephemeral: true
                    }).catch(() => {});
                }
            });

            await interaction.reply({
                content: `Duyuru başarıyla ${duyuruKanal} kanalına gönderildi!`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Duyuru komutunda hata:', error);
            await interaction.reply({
                content: 'Bir hata oluştu! Lütfen daha sonra tekrar deneyin.',
                ephemeral: true
            }).catch(() => {});
        }
    },
};
