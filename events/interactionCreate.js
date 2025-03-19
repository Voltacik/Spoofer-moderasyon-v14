import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } from 'discord.js';
import { saveStats, loadStats } from '../utils/ticketUtils.js';
import config from '../config.json' with { type: 'json' };

export default {
    name: 'interactionCreate',
    async execute(interaction) {
        
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Komut çalıştırılırken hata oluştu: ${error.message}`);

                const logChannelId = interaction.client.config?.logChannel;
                const logChannel = logChannelId ? interaction.guild.channels.cache.get(logChannelId) : null;

                if (logChannel) {
                    logChannel.send({
                        embeds: [{
                            color: 0xff0000,
                            title: '⚠️ Komut Hatası',
                            description: `**Komut:** \`${interaction.commandName}\`\n**Kullanıcı:** ${interaction.user.tag}\n\n\`\`\`${error.stack}\`\`\``
                        }]
                    }).catch(err => console.error(`Log kanalına hata mesajı atılamadı: ${err.message}`));
                }

                try {
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: 'Komutu çalıştırırken bir hata oluştu.', ephemeral: true });
                    } else {
                        await interaction.reply({ content: 'Komutu çalıştırırken bir hata oluştu.', ephemeral: true });
                    }
                } catch (err) {
                    console.error(`Kullanıcıya hata mesajı gönderilemedi: ${err.message}`);
                }
            }
            return;
        }

        
        if (!interaction.isButton() && !interaction.isModalSubmit()) return;

        
        if (interaction.customId === 'accept_rules') {
            try {
                const verifiedRoleId = config.registerSystem.verifiedRoleId;
                
                if (!verifiedRoleId) {
                    await interaction.reply({
                        content: 'Rol ID yapılandırması eksik!',
                        ephemeral: true
                    });
                    return;
                }

                await interaction.member.roles.add(verifiedRoleId);

                const registerButton = new ButtonBuilder()
                    .setCustomId('register')
                    .setLabel('Kayıt Ol')
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(registerButton);

                await interaction.reply({
                    content: 'Kuralları kabul ettiniz! Şimdi kayıt olabilirsiniz.',
                    components: [row],
                    ephemeral: true
                });
                return;
            } catch (error) {
                console.error('Rol ekleme hatası:', error);
                await interaction.reply({
                    content: 'Rol eklenirken bir hata oluştu!',
                    ephemeral: true
                });
                return;
            }
        }

        if (interaction.customId === 'register') {
            try {
                const verifiedRoleId = config.registerSystem.verifiedRoleId;
                const memberRoleId = config.registerSystem.memberRoleId;

                if (!interaction.member.roles.cache.has(verifiedRoleId)) {
                    await interaction.reply({
                        content: '❌ Önce kuralları kabul etmelisiniz!',
                        ephemeral: true
                    });
                    return;
                }

                await interaction.member.roles.add(memberRoleId);

                await interaction.reply({
                    content: '✅ Başarıyla kayıt oldunuz!',
                    ephemeral: true
                });
                return;
            } catch (error) {
                console.error('Kayıt hatası:', error);
                await interaction.reply({
                    content: 'Kayıt sırasında bir hata oluştu!',
                    ephemeral: true
                });
                return;
            }
        }

        
        const { logChannelId, categoryId, staffRoleId } = config.ticketSystem;

        try {
            if (interaction.customId === 'create_ticket') {
                const modal = new ModalBuilder()
                    .setCustomId('ticket_modal')
                    .setTitle('Ticket Oluştur');

                const reasonInput = new TextInputBuilder()
                    .setCustomId('ticket_reason')
                    .setLabel('Ticket açma sebebiniz nedir?')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
                await interaction.showModal(modal);
            }

            else if (interaction.customId === 'ticket_modal') {
                try {
                    const reason = interaction.fields.getTextInputValue('ticket_reason');
                    const guild = interaction.guild;
                    
                    const channel = await guild.channels.create({
                        name: `ticket-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        parent: categoryId,
                        permissionOverwrites: [
                            {
                                id: guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                            },
                            {
                                id: staffRoleId,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                            },
                        ],
                    });

                    const closeButton = new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('Ticketi Kapat')
                        .setStyle(ButtonStyle.Danger);

                    const row = new ActionRowBuilder().addComponents(closeButton);

                    await channel.send({
                        content: `<@&${staffRoleId}> | <@${interaction.user.id}>`,
                        embeds: [{
                            title: 'Ticket Oluşturuldu',
                            description: `**Sebep:** ${reason}`,
                            color: 0x0099ff,
                        }],
                        components: [row]
                    });

                    const logChannel = await guild.channels.fetch(logChannelId);
                    await logChannel.send({
                        embeds: [{
                            title: 'Yeni Ticket Oluşturuldu',
                            description: `**Kullanıcı:** ${interaction.user.tag}\n**Sebep:** ${reason}`,
                            color: 0x00ff00,
                        }]
                    });

                    await interaction.reply({
                        content: `Ticket oluşturuldu! <#${channel.id}>`,
                        ephemeral: true
                    });
                } catch (error) {
                    console.error('Ticket oluşturma hatası:', error);
                    await interaction.reply({
                        content: 'Ticket oluşturulurken bir hata oluştu.',
                        ephemeral: true
                    }).catch(() => {});
                }
            }

            else if (interaction.customId === 'close_ticket') {
                const modal = new ModalBuilder()
                    .setCustomId('close_ticket_modal')
                    .setTitle('Ticket Kapatma');

                const problemInput = new TextInputBuilder()
                    .setCustomId('problem_description')
                    .setLabel('Sorun neydi?')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const solvedInput = new TextInputBuilder()
                    .setCustomId('is_solved')
                    .setLabel('Sorun çözüldü mü? (evet/hayır)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(problemInput),
                    new ActionRowBuilder().addComponents(solvedInput)
                );

                await interaction.showModal(modal);
            }

            else if (interaction.customId === 'close_ticket_modal') {
                try {
                    await interaction.reply({
                        content: 'Ticket kapatılıyor...',
                        ephemeral: true
                    });

                    const problem = interaction.fields.getTextInputValue('problem_description');
                    const isSolved = interaction.fields.getTextInputValue('is_solved').toLowerCase() === 'evet';

                    const stats = await loadStats();
                    if (!stats[interaction.user.id]) {
                        stats[interaction.user.id] = {
                            toplamTicket: 0,
                            cozulenTicket: 0,
                            cozulmeyen: 0
                        };
                    }

                    stats[interaction.user.id].toplamTicket++;
                    if (isSolved) {
                        stats[interaction.user.id].cozulenTicket++;
                    } else {
                        stats[interaction.user.id].cozulmeyen++;
                    }

                    await saveStats(stats);

                    const logChannel = await interaction.guild.channels.fetch(logChannelId);
                    await logChannel.send({
                        embeds: [{
                            title: 'Ticket Kapatıldı',
                            description: `**Yetkili:** ${interaction.user.tag}\n**Sorun:** ${problem}\n**Çözüldü mü:** ${isSolved ? '✅' : '❌'}`,
                            color: isSolved ? 0x00ff00 : 0xff0000,
                        }]
                    });

                    setTimeout(async () => {
                        await interaction.channel.delete().catch(console.error);
                    }, 1000);

                } catch (error) {
                    console.error('Ticket kapatma hatası:', error);
                    if (!interaction.replied) {
                        await interaction.reply({
                            content: 'Ticket kapatılırken bir hata oluştu.',
                            ephemeral: true
                        }).catch(() => {});
                    }
                }
            }
        } catch (error) {
            console.error('Ticket sistemi genel hatası:', error);
            try {
                if (!interaction.replied) {
                    await interaction.reply({
                        content: 'Bir hata oluştu.',
                        ephemeral: true
                    });
                }
            } catch (err) {
                console.error('Hata mesajı gönderilemedi:', err);
            }
        }
    },
};
