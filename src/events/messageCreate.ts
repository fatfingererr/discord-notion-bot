require("dotenv").config();
import { Event } from "../structures/Event"
import materialHandler from "../material/handler"

export default new Event("messageCreate", async (message) => {
    // collect cards
    if (message.mentions.users.first() && message.reference) {
        // console.log('成功捕捉到回复并且@人的信息')
        const repliedMessage = await message.fetchReference();
        if (message.author != repliedMessage.author && !repliedMessage.author.bot && !message.author.bot) {
            repliedMessage.reply(`嗨，${message.author}觉得这段话太棒了，想请你投喂给我。`)
        }
        if (message.mentions.users.first().id == process.env.clientId && !repliedMessage.author.bot) {
            console.log('成功捕捉到用户自己@bot的信息')
            const stateMessge = await message.reply('收藏中...')
            const author = `${repliedMessage.author.username}#${repliedMessage.author.discriminator}`;
            const adder = `${message.author.username}#${message.author.discriminator}`;
            const guildName = message.guild.name;
            const channelName = (await message.guild.channels.fetch(message.channelId)).name
            const material = repliedMessage.content;
            const collectNote = message.content.split(' ').splice(1).join('');
            const title = ((collectNote.search(/,|，/) > 0) || (collectNote.search(/\/|、/) < 0)) ? collectNote.split(/,|，/)[0] : '';
            const date = new Date(repliedMessage.createdTimestamp);
            const keywords = ((collectNote.search(/,|，/) > 0) || (collectNote.search(/\/|、/)>0)) ? collectNote.split(/,|，/).pop().split(/\/|、/) : [];
            const discordUrl = repliedMessage.url;
            materialHandler.addMaterial(author, adder, guildName, channelName, title, date, keywords, material, discordUrl).then(async () =>{
                stateMessge.edit(`✅ 素材碎片添加成功! 见: https://breezy-cormorant-151.notion.site/cadaf8dc964f476aa8301d5ce3eeed74`)
                await message.reply(`【新增卡片】\n作者：${author}\n上传者：${adder}\n服务器：${guildName}\n频道：${channelName}\n题目：${title}\n时间：${date}\n标签：${keywords}\n内容：${material}\n链接：${discordUrl}`);
                console.log(`【新增卡片】\n作者：${author}\n上传者：${adder}\n服务器：${guildName}\n频道：${channelName}\n题目：${title}\n时间：${date}\n标签：${keywords}\n内容：${material}\n链接：${discordUrl}`);
            }).catch(async () =>{
                stateMessge.edit(':negative_squared_cross_mark: 添加失败, 请联络 BOT 管理员协助处理')
            })
        }
    }
})