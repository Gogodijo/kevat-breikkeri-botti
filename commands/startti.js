const startti = (msg) => {
  let bussi1 = null
  let bussi1Users = []

  msg.guild.channels.cache.forEach(channel => {
    if (channel.type == 'voice' && channel.name.toLowerCase() == "bussi 1") {
      bussi1 = channel
    }
    if (channel.type == 'voice' && channel.name.toLowerCase() == "tuomiokirkko") {
      channel.members.forEach(member => {
        if (member.roles.cache.some(role => role.name.toLowerCase() == "bussi 1")) {
          bussi1Users.push(member)
        }
      })
    }
  })
  if(!bussi1){
    msg.channel.send("Ei löydetty äänikanavia")
    return
  }
  if(bussi1Users.length == 0) {
    msg.channel.send("Ei löydy henkilöitä rooleille")
  }
  bussi1Users.forEach( user => {
    user.voice.setChannel(bussi1)
  })
}


module.exports = {
  startti
}