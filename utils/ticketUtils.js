import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const statsFilePath = path.join(__dirname, '..', 'data', 'ticketStats.json');
const backupPath = path.join(__dirname, '..', 'data', 'ticketStats.backup.json');

export async function saveStats(stats) {
    try {
        
        if (!stats || typeof stats !== 'object') {
            throw new Error('Geçersiz veri formatı');
        }

        
        await fs.writeFile(backupPath, JSON.stringify(stats, null, 2));
       
        await fs.writeFile(statsFilePath, JSON.stringify(stats, null, 2));

        return true;
    } catch (error) {
        console.error('Veri kaydetme hatası:', error);
        return false;
    }
}

export async function loadStats() {
    try {
        try {
            const data = await fs.readFile(statsFilePath, 'utf8');
            const parsedData = JSON.parse(data);
            
            
            if (typeof parsedData !== 'object') {
                throw new Error('Geçersiz veri formatı');
            }
            
            return parsedData;
        } catch (error) {
            console.log('Ana dosya okunamadı, yedek deneniyor...');
            
            const backupData = await fs.readFile(backupPath, 'utf8');
            const parsedBackupData = JSON.parse(backupData);
            
            
            await fs.writeFile(statsFilePath, JSON.stringify(parsedBackupData, null, 2));
            
            return parsedBackupData;
        }
    } catch (error) {
        console.error('Veri okuma hatası:', error);
        return {};
    }
}


export async function getStatsForUser(userId) {
    const stats = await loadStats();
    return stats[userId] || {
        toplamTicket: 0,
        cozulenTicket: 0,
        cozulmeyen: 0
    };
}

export async function updateUserStats(userId, updateData) {
    const stats = await loadStats();
    if (!stats[userId]) {
        stats[userId] = {
            toplamTicket: 0,
            cozulenTicket: 0,
            cozulmeyen: 0
        };
    }
    
    stats[userId] = {
        ...stats[userId],
        ...updateData
    };
    
    return await saveStats(stats);
}
