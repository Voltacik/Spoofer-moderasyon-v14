import fs from 'fs';

const userWarnings = new Map(); 

export default {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        const bannedWords = config.bannedWords || [];
        const whitelist = config.whitelist || []; 
        const logChannel = message.guild.channels.cache.get(config.logChannel);

        
        if (whitelist.includes(message.author.id)) return;

        const detectedWord = bannedWords.find(word => message.content.toLowerCase().includes(word.toLowerCase()));

        if (detectedWord) {
            await message.delete().catch(() => {});
            await message.channel.send({
                embeds: [{
                    color: 0xff0000,
                    title: '🚫 Mesaj Silindi',
                    description: `${message.author}, mesajın yasaklı kelime içerdiği için silindi.\n**Kelime:** \`${detectedWord}\``
                }]
            }).then(msg => setTimeout(() => msg.delete(), 5000));

            const warnings = (userWarnings.get(message.author.id) || 0) + 1;
            userWarnings.set(message.author.id, warnings);

            if (logChannel) {
                logChannel.send({
                    embeds: [{
                        color: 0xff0000,
                        title: '🚨 Yasaklı Kelime Kullanımı',
                        description: `${message.author} yasaklı kelime kullandı.\n**Kelime:** \`${detectedWord}\`\n**Toplam Uyarı:** ${warnings}`
                    }]
                });
            }

            
            if (warnings >= 3) {
                userWarnings.set(message.author.id, 0);

                try {
                    await message.member.timeout(60 * 60 * 1000, 'Yasaklı kelime spamı');
                    if (logChannel) {
                        logChannel.send({
                            embeds: [{
                                color: 0xff0000,
                                title: '⏳ Timeout Verildi',
                                description: `${message.author} 3 kez yasaklı kelime kullandığı için **1 saat** susturuldu.`
                            }]
                        });
                    }
                } catch (error) {
                    console.error(`Timeout atılamadı: ${error.message}`);
                    if (logChannel) {
                        logChannel.send({
                            embeds: [{
                                color: 0xff0000,
                                title: '⚠️ Timeout Hatası',
                                description: `${message.author} susturulmaya çalışıldı fakat bir hata oluştu.\n\`\`\`${error.message}\`\`\``
                            }]
                        });
                    }
                }
            }
        }
    }
};
