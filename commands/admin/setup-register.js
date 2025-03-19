import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { AttachmentBuilder } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config dosyasını doğru yoldan oku
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json'), 'utf8'));

export default {
    data: new SlashCommandBuilder()
        .setName('kayit-kur')
        .setDescription('Spoofer satış sunucusu kayıt sistemini kurar')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            
            const welcomeImage = new AttachmentBuilder(
                path.join(__dirname, '../../resimler/welcome.png'),
                { name: 'welcome.png' }
            );

            const rulesEmbed = new EmbedBuilder()
                .setTitle('🎮 Spoofer Satış Sunucusu Kuralları')
                .setDescription(`
                    **Önemli Kurallarımız:**

                    1️⃣ **Güvenli Alışveriş**
                    • Tüm alışverişler yetkili aracılar ile yapılmalıdır
                    • Özel mesajdan yapılan alışverişlerden sunucu sorumlu değildir
                    
                    2️⃣ **Genel Kurallar**
                    • Spam, flood ve reklam kesinlikle yasaktır
                    • Küfür ve argo kullanımı yasaktır
                    • Diğer üyelere saygılı davranın
                    
                    3️⃣ **Ürün ve Hizmetler**
                    • Ürün fiyatları sabittir, pazarlık yapılmaz
                    • Ürün satışları sadece belirlenen kanallardan yapılır
                    • Her ürün için garanti şartları geçerlidir
                    
                    4️⃣ **Ödemeler**
                    • Ödemeler yalnızca belirlenen yöntemlerle yapılır
                    • Ödeme kanıtı screenshot olarak paylaşılmalıdır
                    
                    5️⃣ **Cezai İşlemler**
                    • Kural ihlali durumunda uyarısız ban uygulanır
                    • Dolandırıcılık teşebbüsünde bulunanlar kalıcı olarak banlanır

                    ✅ Kuralları kabul ediyorsanız aşağıdaki butona tıklayın.
                `)
                .setColor('#FF0000')
                .setImage('attachment://welcome.png')
                .setFooter({ 
                    text: '© 2025 Spoofer Satış | Tüm Hakları Saklıdır', 
                    iconURL: interaction.guild.iconURL() 
                })
                .setTimestamp();

            const acceptButton = new ButtonBuilder()
                .setCustomId('accept_rules')
                .setLabel('Kuralları Kabul Ediyorum')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅');

            const row = new ActionRowBuilder()
                .addComponents(acceptButton);

            await interaction.channel.send({
                embeds: [rulesEmbed],
                files: [welcomeImage],
                components: [row]
            });

            await interaction.reply({
                content: 'Kayıt sistemi başarıyla kuruldu!',
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Bir hata oluştu! Hata: ' + error.message,
                ephemeral: true
            });
        }
    },
};
