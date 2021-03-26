const roles = (msg) => {
  const commandArgs = msg.content.match(/(?:[^\s"]+|"[^"]*")+/g)
  console.log(commandArgs)
  if(commandArgs.length == 1) {
    msg.channel.send("Anna komento seuraavasti: !siirrä \"roolin nimi\" \"kanavan nimi\" \n" +
    "Jos kanavassa ei ole välilyöntejä hipsukat voi jättää pois, mutta ei haittaa vaikka ne siellä on.")
    return
  }
  if(commandArgs.length > 3) {
    msg.channel.send("Annettu liikaa argumentteja. Unohditko kenties \"\" merkit roolin ja kanavan ympäriltä, jos niissä on välilyöntejä.\n" +
    "Olen niin tyhmä botti, että osaan jakaa argumentit vain välilyöntien perusteella. Jos argumentissa on välilyönti laita se \"\" sisään, kiitos =)")
    return
  }
  if(commandArgs.length == 2){
    commandArgs[2] = commandArgs[1]
  }

  if(commandArgs[1].toLowerCase() == "everyone"){
    commandArgs[1] = "@everyone"
  }
  const roleName = commandArgs[1].replace(/^"(.*)"$/, '$1').toLowerCase()
  const channelName = commandArgs[2].replace(/^"(.*)"$/, '$1').toLowerCase()
  console.log(roleName)
  const roles = msg.guild.roles.cache
  let textChannel = msg.channel
  // get all members in voice channels
  let usersInChannelsWithRole = []
  let voiceChannel = null
  msg.guild.channels.cache.forEach( channel => {
    if(channel.type == 'voice' && channel.name.toLowerCase().includes(channelName)){
      voiceChannel = channel
    }
    if(channel.type == 'voice' && !channel.name.toLowerCase().includes(channelName)){
      channel.members.forEach( member => {
        if(member.roles.cache.some(role => role.name.toLowerCase() === roleName)){
          usersInChannelsWithRole.push(member)
        }
      })
    }
  })
  if(!voiceChannel){
    textChannel.send("En löytänyt äänikanavaa")
    return
  }
  if(usersInChannelsWithRole.length == 0){
    textChannel.send("En löytänyt yhtään käyttäjää kyseisellä roolilla")
    return
  }
  usersInChannelsWithRole.forEach( user => {
    user.voice.setChannel(voiceChannel)
  })
}

module.exports = {
  roles
}