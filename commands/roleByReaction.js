const messageAndReactions = async (msg) => {

  const message = await msg.channel.send('Odota hetki, lisään reaktiot....')
  const emojies = [
    {
      emoji: '1️⃣',
      roleName: 'Huone 1'
    },
    {
      emoji: '2️⃣',
      roleName: 'Huone 2'
    },
    {
      emoji: '3️⃣',
      roleName: 'Huone 3'
    },
    {
      emoji: '4️⃣',
      roleName: 'Huone 4'
    }
  ]
  //4️⃣,5️⃣,6️⃣,7️⃣,8️⃣
  const filter = (reaction, user) => {
    return emojies.some(e => {
      return e.emoji === reaction.emoji.name
    }) && !user.bot
  }
  for (let i = 0; i < emojies.length; i++) {
    await message.react(emojies[i].emoji)
  }

  message.awaitReactions(filter, {time: 5*1000}).then(collected => console.log(collected))

  const collector = message.createReactionCollector(filter, { time: 600 * 1000, dispose: true })
  let reactionUsers = []
  collector.on('collect', async (reaction, user) => {
    //Selvitä onko käyttäjä klikannyt jotain muuta huonetta
    //Anna roolit perustuen reaktioihin
    if (user.bot) return
    if (reactionUsers.find(r => r[0] === user.id)) {
      //Mitä tehdään kun käyttäjä on jo aikaisemmin reagoinut johonkin?
      //Poistetaan jälkimmäinen reaktio. Eli käyttäjän rooli pysyy siinä mihin on ensimmäiseksi klikannut.
      //Poistetaan rooli vain, jos tämä poistetaan.
      await reaction.users.remove(user.id)
      return
    }
    reactionUsers.push([user.id, reaction.emoji.name])
    //Lisätään rooli
    const emoj = emojies.find(a => a.emoji == reaction.emoji.name)
    const role = msg.guild.roles.cache.find(r => {
      return r.name == emoj.roleName
    })
    const member = await msg.guild.members.fetch(user)
    await member.roles.add(role)
  })


  collector.on('remove', async (reaction, user) => {
    //Jos käyttäjä poistaa ainoan reaktionsa poistetaan rooli, jotta hän voi valita uuden roolin
    const emoj = emojies.find(a => a.emoji === reaction.emoji.name)
    const userRole = reactionUsers.find(userReact => userReact[0] == user.id)
    try {
      if (emoj.emoji != userRole[1]) return
      console.log("Pitäisi poistaa rooli")
      const role = msg.guild.roles.cache.find(r => r.name == emoj.roleName)
      const member = await msg.guild.members.fetch(user)
      await member.roles.remove(role)
      reactionUsers = reactionUsers.filter(r => r != userRole)
    }
    catch {
    }
  })


  collector.on('end', (collected, reason) => {
    message.edit('Roolien jako loppunut')
  })

  await message.edit('Voit nyt valita pöytäsi klikkaamalla jotain emojia. Klikkaathan vain yhtä emojia')
}

module.exports = { messageAndReactions }