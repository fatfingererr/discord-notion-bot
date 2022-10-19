require("dotenv").config();
import { Event } from "../structures/Event"

export default new Event("messageCreate", async (message) => {
    // collect cards
    if (message.mentions.users.first() && message.reference) {
        // console.log('成功捕捉到回复并且@人的信息')
        if (message.mentions.users.first().id == process.env.clientId) {
            const stateMessge = await message.reply('收藏中...')
            // console.log('成功捕捉到@bot的信息')
            const repliedMessage = await message.fetchReference();
            // console.log(repliedMessage)
            const author = `${repliedMessage.author.username}#${repliedMessage.author.discriminator}`;
            const adder = `${message.author.username}#${message.author.discriminator}`;
            const guildName = message.guild.name;
            const content = repliedMessage.content;
            const collectNote = message.content.split(' ').splice(1).join('');
            const title = ((collectNote.search(/,|，/) > 0) || (collectNote.search(/\/|、/) < 0)) ? collectNote.split(/,|，/)[0] : ''
            const timestamp = repliedMessage.createdTimestamp
            const keywords = ((collectNote.search(/,|，/) > 0) || (collectNote.search(/\/|、/)>0)) ? collectNote.split(/,|，/).pop().split(/\/|、/) : []
            const discordUrl = repliedMessage.url
            await message.reply(`【新增卡片】\n作者：${author}\n上传者：${adder}\n频道：${guildName}\n题目：${title}\n时间：${timestamp}\n标签：${keywords}\n内容：${content}\n链接：${discordUrl}`);
            console.log(`【新增卡片】\n作者：${author}\n上传者：${adder}\n频道：${guildName}\n题目：${title}\n时间：${timestamp}\n标签：${keywords}\n内容：${content}\n链接：${discordUrl}`);
            stateMessge.edit('收藏成功')
        }
    }
})