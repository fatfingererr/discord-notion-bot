import notiondb from '../config/notiondb'

const { Client } = require('@notionhq/client')
const notion = new Client({ auth: process.env.NOTION_API_KEY })

async function getNotionData() {
  const databaseId = notiondb.materialTable
  const response = await notion.databases.query({
    database_id: databaseId,
  })
  const data = response.results[1].properties
  return JSON.stringify(data)
}

async function addMaterial(author: string, channelId: string, keywords: string[], material: string, discordUrl: string) {
  const databaseId = notiondb.materialTable
  const kwSelection = []
  keywords.forEach((kw) => {
    kwSelection.push({
      name: kw
    })
  })

  const ret = await notion.pages.create({
    parent: {
      database_id: databaseId
    },
    properties: {
      'discord ID': {
        type: 'select',
        select: {
          name: author
        }
      },
      'Channel ID': {
        type: 'select',
        select: {
          name: channelId
        }
      },
      '素材碎片': {
        rich_text: [
          {
            text: {
              content: material,
            },
          },
        ],
      },
      'Discord URL': {
        rich_text: [
          {
            text: {
              link: {
                type: "url",
                url: discordUrl,
              },
              content: discordUrl,
            },
          },
        ]
      },
      'Key Words': {
        type: 'multi_select',
        multi_select: kwSelection
      }
    },
  })

  const response = await notion.databases.query({
    database_id: databaseId,
  })
  const data = response.results[0].properties
  return JSON.stringify(data)
}

// 'Collector': {
//   type: 'multi_select',
//   multi_select: [{
//     name: "测试1",
//     color: "orange"
//   },
//   {
//     name: "测试2",
//     color: "orange"
//   }]
// }


export default {
  getNotionData,
  addMaterial,
}