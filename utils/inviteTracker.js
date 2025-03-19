const invites = new Map();

export async function fetchGuildInvites(guild) {
    const guildInvites = await guild.invites.fetch();
    invites.set(guild.id, guildInvites);
}

export async function trackInvite(member) {
    const newInvites = await member.guild.invites.fetch();
    const oldInvites = invites.get(member.guild.id) || new Map();

    const usedInvite = newInvites.find(i => i.uses > (oldInvites.get(i.code)?.uses || 0));
    invites.set(member.guild.id, newInvites);

    return usedInvite?.inviter || null;
}
