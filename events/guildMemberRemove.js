import fs from 'fs';

export default {
    name: 'guildMemberRemove',
    async execute(member) {
        let config;

        
        try {
            config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        } catch (error) {
            console.error(`Config dosyası okunurken hata oluştu: ${error.message}`);
            return; 
        }

        const logChannel = member.guild.channels.cache.get(config.logChannel);

        if (logChannel) {
            logChannel.send({
                embeds: [{
                    color: 0xff0000,
                    title: '📤 Üye Ayrıldı',
                    description: `${member.user.tag} (\`${member.user.id}\`) sunucudan ayrıldı.`,
                    timestamp: new Date()
                }]
            }).catch(err => {
                console.error(`Üye ayrıldı mesajı log kanalına atılamadı: ${err.message}`);
            });
        } else {
            console.warn('Log kanalı bulunamadı. Log mesajı atlanıyor.');
        }
    }
};
