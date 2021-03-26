const moveChannel = async msg => {
  
  const commandArgs = msg.content.match(/(?:[^\s"]+|"[^"]*")+/g)
  if(commandArgs.length == 1) {
    msg.channel.send("Anna komento seuraavasti: !siirräKanava \"vanhan kanavan nimi\" \"Uuden kanavan nimi\" \n" +
    "Jos kanavassa ei ole välilyöntejä hipsukat voi jättää pois, mutta ei haittaa vaikka ne siellä on.")
    return
  }
  if(commandArgs.length > 3) {
    msg.channel.send("Annettu liikaa argumentteja. Unohditko kenties \"\" merkit roolin ja kanavan ympäriltä, jos niissä on välilyöntejä.\n" +
    "Olen niin tyhmä botti, että osaan jakaa argumentit vain välilyöntien perusteella. Jos argumentissa on välilyönti laita se \"\" sisään, kiitos =)")
    return
  }
  const previousChannelName = commandArgs[1].replace(/^"(.*)"$/, '$1').toLowerCase()
  const newChannelName = commandArgs[2].replace(/^"(.*)"$/, '$1').toLowerCase()

  let newChannel = null
  let usersinChannel = []
  msg.guild.channels.cache.forEach ( channel => {
    if(channel.type == 'voice' && channel.name.toLowerCase().includes(newChannelName)){
      newChannel = channel
    }
    if(channel.type == 'voice' && channel.name.toLowerCase().includes(previousChannelName)){
      channel.members.forEach(member => {
        usersinChannel.push(member)
      })
    }
  })
  if(!newChannel){
    msg.channel.send("Uutta kanavaa ei löytynyt")
    return
  }
  if(usersinChannel.length <= 0){
    msg.channel.send("En löytänyt käyttäjiä kanavalta")
    return
  }
  usersinChannel.forEach( user => {
    user.voice.setChannel(newChannel)
  })
}

module.exports = {
  moveChannel
}