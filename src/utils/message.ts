function getRefMessageLink(message: any, refMessage: any): string {
    return `https://discord.com/channels/${message.guildId}/${refMessage.channelId}/${refMessage.id}`
}


export default {
    getRefMessageLink
}