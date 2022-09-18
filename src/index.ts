require('dotenv').config()
const { ShardClient } = require('detritus-client')
const express = require("express")
const app = express()

app.get("/", (req, res) => {
    res.send("<h1>dToys is running</h1>")
})

import fetch from 'node-fetch'
import 'module-alias/register'
import materialHandler from "./material/handler"
import utils from "./utils/message"

// 请避免把 TOKEN 直接写在机器人程序中, 避免骇客攻击与隐私泄漏
const token = process.env.TOKEN

const client = new ShardClient(token, {
    gateway: {
        loadAllMembers: true,
    },
})

client.on('messageCreate', async ({ message }) => {
    if (message.author.bot === false && message.content !== '') {
        const data = message.content.split(' ')
        let cmd = ""
        if (data.length >= 2) {
            cmd = data[1]
            for (var i = 2; i < data.length; i++) {
                cmd = cmd + ' ' + data[i]
            }
        }
        if (cmd.replace(/\s/g, '') === 'help') {
            const reply = await message.reply(':information_source: 请回复你想要存入素材库的信息，并依照此格式输入：\n\n@dToys [标题], [标签1]/[标签2]/.../[标签3]\n\n"@" 标注时请选择机器人 dToys，括号不用填，标题与标签的分隔逗点可为半形或全形。\n\n本提示将在 30 秒后自动删除')
            setTimeout(async () => {
                await reply.delete()
            }, 30000)
        }
        else {
            if (message.referencedMessage !== null) {
                let splitChar = ','
                let args = cmd.split(splitChar)
                if (args.length <= 1) {
                    splitChar = '，'
                    args = cmd.split(splitChar)
                }
                let keywords = []
                let keywordStr = ''
                if (args.length >= 2) {
                    keywordStr = args[1]
                    for (var i = 2; i < args.length; i++) {
                        keywordStr = keywordStr + splitChar + args[i]
                    }
                    keywords = keywordStr.split('/')
                }
                const title = args[0]
                const channel = client.channels.get(message.channelId)
                const author = `${message.referencedMessage.author.username}#${message.referencedMessage.author.discriminator}`
                const adder =  `${message.author.username}#${message.author.discriminator}`
                const discordUrl = utils.getRefMessageLink(message, message.referencedMessage)
                const material = message.referencedMessage.content
                materialHandler.addMaterial(author, adder, channel.name, title, message.referencedMessage.timestamp, keywords, material, discordUrl).then(async () => {
                    const reply = await message.reply('✅ 素材碎片添加成功! 见: https://ddaocommunity.notion.site/107f20d5949f419bb05759809c40542f')
                    // setTimeout(async () => {
                    //     await reply.delete()
                    // }, 5000)

                }).catch(async () => {
                    const reply = await message.reply(':negative_squared_cross_mark: 添加失败, 请联络 BOT 管理员协助处理')
                    // setTimeout(async () => {
                    //     await reply.delete()
                    // }, 30000)
                })
            } else {
                const reply = await message.reply(':warning: 您并没有回复选择要存入素材库的信息，请回复并同时下此指令')
                // setTimeout(async () => {
                //     await reply.delete()
                // }, 10000)
            }
        }
    }
})

app.listen(process.env.PORT || 3000,
    async () => {
        await client.run()
        console.log(`\nClient has loaded with a shard count of ${client.shardCount} \n`)
        client.gateway.setPresence({
            activity: {
                // What comes after our activity type, x.
                name: '输入 @dToys help 查询',
                // Type 0 sets our message to `Playing x`
                type: 0,
            },
            // do-not-disturb us
            status: 'dnd',
        })

        setInterval(async () => {
            const res = await fetch('http://ddao-dtoys.herokuapp.com')
            const ret = await res.text()
            console.log(ret)
        }, 180000)
    })