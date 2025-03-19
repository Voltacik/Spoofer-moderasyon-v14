import { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Canvas from '@napi-rs/canvas';
import fs from 'fs';


const invites = new Map();

export default {
    name: 'guildMemberAdd',
    async execute(member) {
        const guild = member.guild;
        const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

        
        const rulesChannel = guild.channels.cache.get(config.rulesChannelId);
        if (rulesChannel) {
            const rulesEmbed = new EmbedBuilder()
                .setColor('#2F3136')
                .setTitle('📜 Sunucu Kuralları')
                .setDescription('Lütfen sunucu kurallarını okuyup, onaylamak için aşağıdaki butona tıklayın.')
                .setFooter({ text: 'Kuralları kabul etmeden kayıt olamazsınız!' });

            const acceptButton = new ButtonBuilder()
                .setCustomId('accept_rules')
                .setEmoji('1349852312327163987')
                .setLabel('Kuralları Okudum ve Kabul Ediyorum')
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder().addComponents(acceptButton);

            await rulesChannel.send({
                content: `<@${member.id}>`,
                embeds: [rulesEmbed],
                components: [row]
            });
        }

        
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        try {
            const background = await Canvas.loadImage(config.welcomeImageUrl);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        } catch (err) {
            console.error('Hoşgeldin arka plan resmi yüklenirken hata oluştu:', err);
            return;
        }

        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Hoşgeldin, ${member.user.username}!`, canvas.width / 2.5, canvas.height / 3.5);

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'welcome-image.png' });

        const welcomeChannel = guild.channels.cache.get(config.welcomeChannel);
        if (welcomeChannel) {
            welcomeChannel.send({ content: `Sunucumuza hoş geldin ${member}!`, files: [attachment] });
        }

        
        const newInvites = await guild.invites.fetch();
        const oldInvites = invites.get(guild.id) || new Map();
        const invite = newInvites.find(i => oldInvites.has(i.code) && oldInvites.get(i.code).uses < i.uses);

        if (invite) {
            const inviter = invite.inviter;
            const logChannel = guild.channels.cache.get(config.logChannel);
            if (logChannel) {
                logChannel.send(`📥 ${member} katıldı! Davet eden: ${inviter}`);
            }
        }

        invites.set(guild.id, newInvites);
    }
};
