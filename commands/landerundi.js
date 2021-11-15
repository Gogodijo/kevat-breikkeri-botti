const mong = require('./database')
mong.con
const Osallistuja = require('./users')

async function correctCode(message, code) {
  const user = await Osallistuja.findOne({koodi: code})
  if(!user){
      return
  }
  if(user.kaytetty){
      message.reply("Antamasi koodi on jo käytetty.")
      return
  }
  else{
      user.kaytetty = true
      await user.save()
      handleCorrectcode(message, user)
      return
  }
}

async function handleCorrectcode(message, user){
  message.reply("Tervetuloa Landerundille! Asetan roolisi oikein ja siirrän sinut oikealle tekstikanavalle. Voit tämän jälkeen liittyä oikeaan puhekanavaan. Muutan myös nimimerkkisi oikeaksi nimeksesi tälle kanavalle. =)")
  const roleName = user.bussi
  const guild = message.guild
  let myRole;
  try {
      guild.roles.cache.find(role => {
          if(role.name == roleName){
              myRole = role
          }
      })
  } catch (error) {
      console.log(error)
      message.reply("Jokin meni vikaan asettaessa roolia. Ota yhteys tapahtuman järjestäjään")
  }
  member = await guild.members.fetch(message.author.id)
  await member.roles.add(myRole.id)
  setTimeout( async() => {
      try {
          await member.setNickname(user.nimi)
      } catch (error) {
          message.reply("")   
      }
  },5000)
}