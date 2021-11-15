const info = (msg) => {
  console.log("Infoa kutsuttu")
  const a = "Botilla on 6 eri komentoa. Kaikki komennot alkavat ! -merkillä. Isoilla ja pienillä kirjaimilla ei ole väliä botille. \n\n"
  const b = "!sd komennolla aloitetaan speed dating. Kaikkien osallistuvien tulee olla" +
  "\"Speed Dating\" äänikanavalla. Komento ottaa vastaan yhden argumentin, joka on speeddaten kesto."+
  "Ainoastaan kokonaisluvut ovat hyväksyttyjä. Voit antta postfixin joko sekunti / minuutti \n\n"
  const c = "!startti siirtää Bussi 1 -roolin omaavat Bussi 1 -kanavalle ja BUssi 2-roolin omaavat Bussi 2-kanavalle\n\n"
  const d = "!siirrä \"roolin nimi\" \"kanavan nimi\" siirtää kaikki tietyn roolin omaavat henkilöt tietylle kanavalle. " +
  "Huomaa hipsukat jos roolin tai kanavan nimi sisältää välilyönnin. HUOM tämä siirtää kaikki roolin omaavat riippumatta missä kanavassa he ovat tällä hetkellä\n\n"
  const e= "!siirräjostain \"roolin nimi\" \"vanhan kanavan nimi\" \"uuden kanavan nimi\" siirtä tietyltä kanavalta tietyn roolin omaavat. " +
  "Huomaa hipsukat jos nimissä on välilyöntejä.\n\n"
  const f = "!destroy voice channels -komento tuhoaa sd komennolla luodut äänikanavat. Komento perustuu kanavien nimeen, joten jos on muita samannimisiä kanavia ne poistetaan myös. \n\n"
  const g = "!info luet tällä komennolla generoitua viestiä ;)"
  const h = "!siirräkanava \"vanhan kanavan nimi\" \"uuden kanavan nimi\" siirtää kaikki henkilöt tietyltä kanavalta toiselle kanavalle."
  msg.channel.send(a+b+d+e+f+h+g)
}

module.exports = {
  info
}