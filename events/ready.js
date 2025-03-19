export default {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ Bot giriş yaptı: ${client.user.tag}`);

        const durumlar = [
            '🔔 Volta Tarafından Lewory Software İçin yapıldı',
            '💻 Güvenliği Sağlıyorum!',
            '🚨 Tüm Loglar Kaydediliyor!',
            '🚨 Hazır Altyapılar için github sayfama bakabilirsiniz!',
            '🚨 https://github.com/Voltacik'
        ];

        let index = 0;

        
        const setPresenceSafe = async () => {
            try {
                await client.user.setPresence({
                    activities: [{ name: durumlar[index], type: 0 }],
                    status: 'online'
                });
                index = (index + 1) % durumlar.length; 
            } catch (err) {
                console.error(`Durum ayarlanırken hata: ${err.message}`);
            }
        };

        
        await setPresenceSafe();

        
        setInterval(setPresenceSafe, 10000);

        
        for (const [id, guild] of client.guilds.cache) {
            try {
                const invites = await guild.invites.fetch();
                client.inviteCache.set(id, invites);
            } catch (err) {
                console.warn(`⚠️ ${guild.name} sunucusunun davetlerini alırken hata: ${err.message}`);
            }
        }

        console.log(`✅ Tüm sunucuların davetleri başarıyla alındı (yetki olan sunucular için).`);
    }
};
