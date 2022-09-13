require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { CommandClient } = require('detritus-client');

import 'module-alias/register';
import materialHandler from "./material/handler";
import utils from "./utils/message";

// 请避免把 TOKEN 直接写在机器人程序中, 避免骇客攻击与隐私泄漏
const token = process.env.TOKEN;
const commandClient = new CommandClient(token, {
    prefix: '..',
});

commandClient.add({
    name: 'list',
    run: async (context) => {
        return context.reply(await materialHandler.getNotionData());
    },
});


commandClient.add({
    name: 'help',
    run: async (context, args) => {
        return context.reply('ℹ️ 請使用指令 "@dToys add [关键词1]/[关键词2]/.../[关键词N], [素材碎片]" 新增素材碎片到 Notion 数据库');
    },
});


commandClient.add({
    name: 'add',
    run: async (context, args) => {
        const data = args.add.split(',')
        if (data.length >= 2) {
            let material = data[1];
            for (var i = 2; i < data.length; i++) {
                material = material + ',' + data[i]
            }
            const keywords = data[0].split('/')
            const channelId = context.message.channelId
            const author = `${context.user.username}#${context.user.discriminator}`;
            const discordUrl = utils.getMessageLink(context.message);
            materialHandler.addMaterial(author, channelId, keywords, material, discordUrl)
            return context.reply("✅ 新增成功! 见: https://ddaocommunity.notion.site/107f20d5949f419bb05759809c40542f");
        }
        return context.reply('ℹ️ 請使用指令 "@dToys add [keyword1]/[keyword2], [素材碎片]" 新增素材碎片到 Notion 数据库');

    },
});

(async () => {
    const client = await commandClient.run();
    console.log(`\nClient has loaded with a shard count of ${client.shardCount} \n`);
})();