const specialCommands = new Map();

export function addSpecialCommand(command, response) {
    specialCommands.set(command, response);
}

export function handleSpecialCommand(interaction) {
    if (specialCommands.has(interaction.commandName)) {
        interaction.reply(specialCommands.get(interaction.commandName));
        return true;
    }
    return false;
}
