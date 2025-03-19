import { AttachmentBuilder } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';

export async function createWelcomeImage(user, backgroundUrl) {
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const background = await loadImage(backgroundUrl);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const avatar = await loadImage(user.displayAvatarURL({ extension: 'png' }));
    ctx.drawImage(avatar, 25, 25, 200, 200);

    return new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome.png' });
}
