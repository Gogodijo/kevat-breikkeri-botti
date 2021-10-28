const handleMessage = async (msg) => {
  console.time("command")
  const commandArr = msg.content.split(" ")
  if (commandArr[0] !== "!sd") return
  if (!parseCommand(commandArr[1])) {
    msg.reply('En ymmärrä =( ')
    return
  }
  if (inProgress) {
    msg.reply('Aikaisempi sessio vielä käynnissä. Tai sitten olen rikki =(')
    return
  }
  inProgress = true

  let time = parseCommand(commandArr[1]) || 180
  let voiceChannels = []
  let mainChannel = null
  let usersInChannel = []
  let textChannel = msg.channel
  msg.guild.channels.cache.forEach(channel => {
    if (channel.type == 'voice' && channel.name.toLowerCase().includes('sd huone')) {
      voiceChannels.push(channel)
    }
    if (channel.type == 'voice' && channel.name.toLowerCase() == 'speed dating') {
      mainChannel = channel
    }
    if (channel.type == 'text' && channel.name.toLowerCase() == 'speed-dating') {
      textChannel = channel
    }
  })
  mainChannel.members.forEach(member => {
    usersInChannel.push(member)
  })
  try {
    if (voiceChannels.length == 0) {
      const newChannel = await msg.guild.channels.create('sd huone', {
        type: 'voice',
        userLimit: 2,
        parent: mainChannel.parentID
      })
      voiceChannels.push(newChannel)
    }
    if ((Math.floor(usersInChannel.length / 2) > voiceChannels.length)) {
      let promiseArray = []
      textChannel.send("Luodaan kanaat. Tässä saattaa kestää hetki")
      const neededChannels = Math.floor(usersInChannel.length / 2) - voiceChannels.length
      //const neededChannels = 25
      for (let i = 0; i < neededChannels; i++) {
        promiseArray.push(voiceChannels[0].clone())
      }
      const newChannels = await Promise.all(promiseArray)
      voiceChannels.push(...newChannels)
    }
  }
  catch (e) {
    console.log("Virhe luodessa kanavia: ", e)
    msg.reply("Jotain meni vikaan kanavia luodessa.")
  }
  // Jos ei löydä yhtään sopivaa kanavaa, luodaan yksi. Ohjelma osaa kopioida tästä tarvittavan määrän kanavia

  msg.reply(`${usersInChannel.length} käyttäjää kanavalla. ${voiceChannels.length} huonetta käytössä. Aikaa annettu ${time} sekuntia`)
  textChannel.send(`Siirretään ihmiset oikeille kanaville.`)
  console.log(usersInChannel.length)
  console.log(voiceChannels.length)
  usersToChannels(voiceChannels, usersInChannel)

  setTimeout(() => {
    textChannel.send('15 sekuntia jäljellä')
  }, (time - 15) * 1000)

  setTimeout(() => {
    bringUsersBack(voiceChannels, mainChannel, textChannel)
  }, time * 1000)
  console.timeEnd("command")
}

/*
Laitetaan kaikki valitut käyttäjät omille kanavilleen. Jos käyttäjiä on pariton määrä laitetaan listan
ensimmäinen käyttäjä aina ensimmäiseen kanavaan. Sekoitetaan käyttäjät ja tarkistetaan, onko
joku pari ollut aikaisemmin. Jos on niin sekoitetaan uudestaan. Jos ollaan sekoitettu 4000 kertaa
ilman uusia pareja mennään vanhoilla. Tämä tapahtuu käytännössä ainoastaan silloin kun uniikkeja 
pareja ei voida enää muodostaa. Siihen voisi tehdä jonkun tarkastuksen, että onko ylipäätään mahdollista
tehdä uusia pareja vai ei niin ei turhaan kutsuta O(n^4) funktiota 4000 kertaa :D
*/
const usersToChannels = (voiceChannels, usersInChannel) => {
  if (usersInChannel.length % 2 !== 0 && usersInChannel.length > 2) {
    const index = Math.floor(Math.random() * usersInChannel.length)
    const leftoutUser = usersInChannel[index]
    usersInChannel.splice(index, 1)
    leftoutUser.voice.setChannel(voiceChannels[0])
  }
  for (let i = 0; i <= 4000; i++) {
    shuffeledUsers = usersInChannel.map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
    if (isUniquePairs(shuffeledUsers)) break
    if (i == 4000) console.log("Ei uniikkeja raktaisuja")
  }
  previousPairs.push(shuffeledUsers)
  shuffeledUsers.forEach((user, index) => {
    user.voice.setChannel(voiceChannels[Math.floor(index / 2)])
  })

}

/*
Varmistetaan, että käyttäjät eivät ole olleet aikaisemmin keskustelussa keskenään.
Previous pairs taulukko sisältää kaikki aikaisemmat järjestykset, missä käyttäjät
on laitettu kanaville. Varmistetaan siis tämän hetkisestä järjestyksestä,
että mikään pari ei ole ollut missän aikaisemmassa järjestyksessä parina.
Voisi tehdä vähän järkevämmin, esimerkiksi ensimäisessä loopissa voisi loopata vain
joka toisen numeron jolloin if i % 2 == 0 ei tarvittaisi.
Jokatapauksessa algoritmin O(~n^4)... Ei pitäisi olla väliä alle 100 käyttäjällä.
Tähän ei kannata koskea enää ikinä. Jos tarve tulee niin tehkää itte parempi :D
*/
const isUniquePairs = (shuffeledUsers) => {
  if (previousPairs.length == 0) return true
  for (let i = 0; i < shuffeledUsers.length; i++) {
    for (let j = 0; j < previousPairs.length; j++) {
      for (let k = 0; k < previousPairs[j].length; k++) {
        if (i % 2 == 0) {
          if (shuffeledUsers[i].user.id == previousPairs[j][k].user.id) {
            if (shuffeledUsers[i + 1].user.id == previousPairs[j][k + 1].user.id && k % 2 == 0) {
              return false
            }
          }
          if (shuffeledUsers[i].user.id == previousPairs[j][k + 1].user.id) {
            if (shuffeledUsers[i + 1].user.id == previousPairs[j][k].user.id && k % 2 != 1) {
              return false
            }
          }
        }
      }
    }
  }
  return true
}

const bringUsersBack = (voiceChannels, mainChannel, textChannel) => {
  let usersInAllChannels = []
  voiceChannels.forEach(channel => {
    channel.members.forEach(member => {
      usersInAllChannels.push(member)
    })
  })
  usersInAllChannels.forEach(user => {
    user.voice.setChannel(mainChannel.id)
  })
  inProgress = false
  textChannel.send('Siirretään osallistujat takaisin pääkanavalle.')
}

const filterInt = (value) => {
  if (/^[-+]?(\d+|Infinity)$/.test(value)) {
    return Number(value)
  } else {
    return NaN
  }
}

const parseCommand = (cmd) => {
  const num = filterInt(cmd)
  if (Number.isInteger(num)) return num
  const a = cmd.match(/([0-9]+)|([a-zA-Z]+)+/g)
  if (a.length !== 2 || Number.isNaN(filterInt(a[0]))) return null
  const postfix = a[1].toLowerCase()
  const secs = ["sek", "s", "second", "sec", "sekunti", "sekuntia", "seconds", "secs"]
  const mins = ["min", "m", "mins", "minuuttia", "minuutti"]
  if (secs.includes(postfix)) return filterInt(a[0])
  if (mins.includes(postfix)) return (60 * filterInt(a[0]))
  return null
}


const destroyChannels = async (msg) => {
  let voiceChannels = []
  let textChannel = msg.channel
  if (inProgress) {
    msg.reply("Ei pysty")
  }
  inProgress = true
  msg.guild.channels.cache.forEach(channel => {
    if (channel.type == 'voice' && channel.name.toLowerCase().includes('sd huone')) {
      voiceChannels.push(channel)
    }
  })
  let promiseArray = []
  for (let i = 0; i < voiceChannels.length; i++) {
    promiseArray.push(voiceChannels[i].delete(""))
  }
  await Promise.all(promiseArray)
  inProgress = false
  textChannel.send("Kanavat tuhottu")
}

module.exports = {
  handleMessage,
  destroyChannels
}