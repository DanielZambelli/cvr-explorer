const mapAddress = require('./mapAddress')

describe(mapAddress, () => {

  it('[street][nr], [floor]. [door].', () => {
    const result = mapAddress({
      husnummerFra: 2,
      etage: '2',
      sidedoer: 'th',
      conavn: 'Morten Juul Therkildsen',
      vejnavn: 'Anker Heegaards Gade',
      postnummer: 1572,
      postdistrikt: 'København V',
    })
    expect(result.coAddress).toEqual('c/o Morten Juul Therkildsen')
    expect(result.street).toEqual('Anker Heegaards Gade 2, 2. th.')
    expect(result.city).toEqual('København V')
    expect(result.postal).toEqual(1572)
  })

  it('[street][nr][letter], [floor]. [door].', () => {
    const result = mapAddress({
      husnummerFra: 2,
      bogstavFra: 'A',
      etage: '2',
      sidedoer: 'th',
      conavn: 'Morten Juul Therkildsen',
      vejnavn: 'Anker Heegaards Gade',
      postnummer: 1572,
      postdistrikt: 'København V',
    })
    expect(result.street).toEqual('Anker Heegaards Gade 2A, 2. th.')
  })

  it('[street][nr][letter]-[letter], [floor]. [door].', () => {
    const result = mapAddress({
      husnummerFra: 2,
      bogstavFra: 'A',
      bogstavTil: 'B',
      etage: '2',
      sidedoer: 'th',
      conavn: 'Morten Juul Therkildsen',
      vejnavn: 'Anker Heegaards Gade',
      postnummer: 1572,
      postdistrikt: 'København V',
    })
    expect(result.street).toEqual('Anker Heegaards Gade 2A-B, 2. th.')
  })

  it('[street][nr]-[nr], [floor]. [door].', () => {
    const result = mapAddress({
      husnummerFra: 2,
      husnummerTil: 5,
      etage: '2',
      sidedoer: 'th',
      conavn: 'Morten Juul Therkildsen',
      vejnavn: 'Anker Heegaards Gade',
      postnummer: 1572,
      postdistrikt: 'København V',
    })
    expect(result.street).toEqual('Anker Heegaards Gade 2-5, 2. th.')
  })

  it('returns expected keys', () => {
    const result = mapAddress({
      husnummerFra: 2,
      etage: '2',
      sidedoer: 'th',
      conavn: 'Morten Juul Therkildsen',
      vejnavn: 'Anker Heegaards Gade',
      postnummer: 1572,
      postdistrikt: 'København V',
    })
    expect(Object.keys(result)).toMatchSnapshot()
  })

  it('returns expected keys also when nothing is passed', () => {
    const resultFromEmptyObject = mapAddress({})
    const resultFromEmptyArgs = mapAddress()
    expect(Object.keys(resultFromEmptyObject)).toMatchSnapshot()
    expect(Object.keys(resultFromEmptyArgs)).toMatchSnapshot()
  })

})
