function getMessageLink(message: any): string {
    return `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`
}


export default {
    getMessageLink
}