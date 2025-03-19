import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.json' with { type: 'json' };


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.MessageContent
    ]
});


client.commands = new Collection();
client.inviteCache = new Collection();  


const loadCommands = async () => {
    const commands = [];
    const commandsPath = path.join(__dirname, 'commands', 'admin');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        try {
            console.log('Yükleniyor:', file);
            const command = await import(`file://${path.join(commandsPath, file)}`);

            if (command.default && command.default.data && command.default.execute) {
                client.commands.set(command.default.data.name, command.default);
                commands.push(command.default.data.toJSON());
                console.log(`[KOMUT YÜKLENDİ] ${command.default.data.name}`);
            } else {
                console.warn(`[UYARI] ${file} geçerli bir komut dosyası değil veya yapısı eksik.`);
            }
        } catch (error) {
            console.error(`[HATA] ${file} yüklenirken hata oluştu:`, error.message);
        }
    }
    return commands;
};


const loadEvents = async () => {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        try {
            console.log('Yükleniyor:', file);
            const event = await import(`file://${filePath}`);

            if (event.default && event.default.name && event.default.execute) {
                if (event.default.once) {
                    client.once(event.default.name, (...args) => event.default.execute(...args, client));
                } else {
                    client.on(event.default.name, (...args) => event.default.execute(...args, client));
                }
                console.log(`[EVENT YÜKLENDİ] ${event.default.name}`);
            } else {
                console.warn(`[UYARI] ${file} geçerli bir event dosyası değil veya yapısı eksik.`);
            }
        } catch (error) {
            console.error(`[HATA] ${file} yüklenirken hata oluştu:`, error.message);
        }
    }
};


client.once('ready', async () => {
    const { REST } = await import('@discordjs/rest');
    const { Routes } = await import('discord-api-types/v10');

    const rest = new REST({ version: '10' }).setToken(config.token);

    const commands = await loadCommands(); 
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('✅ Komutlar başarıyla yüklendi!');
    } catch (error) {
        console.error('🚨 Komut yükleme sırasında hata:', error);
    }
});


await loadEvents(); 


client.login(config.token).then(() => {
    console.log(`🤖 Bot ${client.user.tag} olarak giriş yaptı!`);
}).catch(err => {
    console.error('❌ Bot giriş yaparken hata:', err);
});
