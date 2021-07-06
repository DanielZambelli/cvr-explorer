module.exports = (options = {}) => {
  const {
    limit,
    names,
    types,
    cvrs,
    branchCodes,
    regions,
    employees,
    active,
  } = options

  const query = { bool: { must: [], must_not: [] } }

  query.bool.must.push({
    term: { 'Vrvirksomhed.enhedstype': 'virksomhed' },
  })

  if(cvrs?.length){
    query.bool.must.push({ terms: { 'Vrvirksomhed.cvrNummer': cvrs } })
  }

  if(names?.length){
    const blacklistRegEx = /([^-\wæøå ])/ig
    const value = '(' + names.map(name => name.replace(blacklistRegEx, '').split(' ').map(w => w.trim()).join(' ') ).join(') OR (') + ')'
    query.bool.must.push({ query_string: { default_field: "Vrvirksomhed.virksomhedMetadata.nyesteNavn.navn", query: value }})
  }

  if(employees?.length){
    const should = [ ({ bool: { should: [ { terms: { 'Vrvirksomhed.virksomhedMetadata.nyesteAarsbeskaeftigelse.intervalKodeAntalAnsatte': employees } } ] } }) ]
    const hasZero = employees.includes('ANTAL_0_0')
    if(hasZero)
      should.push({ bool: { must_not: [ { exists: { field: 'Vrvirksomhed.virksomhedMetadata.nyesteAarsbeskaeftigelse' } } ] }})
    query.bool.must.push({ bool: { should } })
  }

  if(types?.length)
    query.bool.must.push({ terms: { 'Vrvirksomhed.virksomhedMetadata.nyesteVirksomhedsform.kortBeskrivelse': types } })

  if(branchCodes?.length)
    query.bool.must.push({ terms: { 'Vrvirksomhed.virksomhedMetadata.nyesteHovedbranche.branchekode': branchCodes } })

  if(active === false)
    query.bool.must.push({ exists: { field: 'Vrvirksomhed.livsforloeb.periode.gyldigTil' } })
  else if(active === true)
    query.bool.must_not.push({ exists: { field: 'Vrvirksomhed.livsforloeb.periode.gyldigTil' } })

  if(regions?.length){
    const postalsByRegion = require('dk-postals/postals-by-region.json')
    const postals = regions.reduce((list, region) => list.concat(postalsByRegion[region]), [])
    query.bool.must.push({ terms: { 'Vrvirksomhed.virksomhedMetadata.nyesteBeliggenhedsadresse.postnummer': postals } })
  }

  let size = 1500
  if(size > limit) size = limit

  return { from: 0, size, query }
}
