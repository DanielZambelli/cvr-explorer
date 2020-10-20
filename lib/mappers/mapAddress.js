const mapAddress = (address = {}) => {
  const {
    husnummerFra,
    husnummerTil,
    bogstavFra,
    bogstavTil,
    etage,
    sidedoer,
    conavn,
    vejnavn,
    postnummer,
    postdistrikt,
  } = address

  let number = null
  if(husnummerFra && husnummerTil) number = `${husnummerFra}-${husnummerTil}`
  else number = husnummerFra || husnummerTil

  let letter = null
  if(bogstavFra && bogstavTil) letter = `${bogstavFra}-${bogstavTil}`
  else letter = bogstavFra || bogstavTil

  let street = [
    vejnavn,
    number && ' ' + number,
    letter,
    etage && `, ${etage}.`,
    sidedoer && ` ${sidedoer}.`,
  ].filter(elm => !!elm).join('')
  if(!street) street = null

  const coAddress = conavn ? `c/o ${conavn}` : null

  return {
    street,
    city: postdistrikt,
    postal: parseInt(postnummer),
    coAddress,
  }
}

module.exports = mapAddress
