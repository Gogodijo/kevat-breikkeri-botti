const Discord = require('discord.js')
const speeddating = require("./speeddating")
const client = new Discord.Client()
const startti = require("./startti")
require('dotenv').config()
const roles = require("./roles")
const moveFrom = require("./moveFrom")
const info = require('./info')
const roleByReaction = require('./roleByReaction')

const moveChannel = require('./moveChannel')

global.inProgress = false
global.previousPairs = []

client.once('ready', () => {
  console.log("Hello world!=)")
})

client.on('message', async message => {

  if (message.member.roles.cache.some(role => role.name.toLowerCase() === 'tuo hallitus')){
  if (message.content.startsWith("!") ) {
    if (message.content.split(" ")[0].toLowerCase() == "!sd") {
      speeddating.handleMessage(message)
      return
    }
    if (message.content.toLowerCase() == "!destroy voice channels") {
      speeddating.destroyChannels(message)
      return
    }
    if (message.content.split(" ")[0].toLowerCase() == "!siirrä"){
      roles.roles(message)
      return
    }
    if(message.content.toLowerCase() == "!startti") {
      startti.startti(message)
      return
    }
    if(message.content.split(" ")[0].toLowerCase() == "!siirräjostain"){
      moveFrom.move(message)
      return
    }
    if(message.content.toLowerCase() == "!info") {
      info.info(message)
      return
    }
    if(message.content.split(" ")[0].toLowerCase() == "!siirräkanava"){
      moveChannel.moveChannel(message)
      return
    }
    if(message.content.toLowerCase() == "!sitsit") {
      roleByReaction.messageAndReactions(message)
    }
  }}
  else{
  }
  return
})

client.on('rateLimit',(data) => {
  console.log(data)
})

client.login(process.env.DISCORD_CODE)