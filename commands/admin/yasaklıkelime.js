import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js'; 
import fs from 'fs';


const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
let bannedWords = config.bannedWords || [];

export default {
    data: new SlashCommandBuilder()
        .setName('yasaklıkelime')
        .setDescription('Yasaklı kelimeleri yönetir')
        .addStringOption(option =>
            option.setName('kelime')
                .setDescription('Yasaklamak istediğiniz kelime')
                .setRequired(true)),
    async execute(interaction) {
        const kelime = interaction.options.getString('kelime');

        
        if (!bannedWords.includes(kelime)) {
            bannedWords.push(kelime);
        }

        
        fs.writeFileSync('config.json', JSON.stringify({ 
            ...config, 
            bannedWords 
        }, null, 2));

        
        const embed = new EmbedBuilder()
            .setColor('#FF0000') 
            .setTitle('Yasaklı Kelimeler Listesi')
            .setDescription(`Yasaklı kelime olarak "${kelime}" eklendi.`)
            .addFields({ name: 'Mevcut Yasaklı Kelimeler:', value: bannedWords.length > 0 ? bannedWords.join(', ') : 'Hiç yok.' });

        
        await interaction.reply({ embeds: [embed] });
    },
};
