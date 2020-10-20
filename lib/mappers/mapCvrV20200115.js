const mapAddress = require('./mapAddress')

module.exports = (result) => {
  const data = result?._source?.Vrvirksomhed
  const meta = data?.virksomhedMetadata
  return {
    cvr: data?.cvrNummer || null,
    name: meta?.nyesteNavn?.navn || null,
    typeCode: meta?.nyesteVirksomhedsform?.kortBeskrivelse || null,
    type: meta?.nyesteVirksomhedsform?.langBeskrivelse || null,
    branch: data.hovedbranche.length > 0 ? data.hovedbranche[data.hovedbranche.length - 1].branchetekst : null,
    branchCode: data.hovedbranche.length > 0 ? parseInt(data.hovedbranche[data.hovedbranche.length - 1].branchekode) : null,
    startDate: meta?.virkningsDato || null,
    endDate: meta?.nyesteNavn?.periode?.gyldigTil || null,
    active: ['aktiv', 'normal', 'underrekonstruktion', 'omdannet'].includes(meta?.sammensatStatus.toLowerCase()),
    website: data.hjemmeside.length > 0 ? data.hjemmeside.kontaktoplysning : null,
    email: [...data.obligatoriskEmail, ...data.elektroniskPost].map(obj => obj.kontaktoplysning)[0] || null,
    phone: [...data.telefonNummer, ...data.sekundaertTelefonNummer].map(obj => obj.kontaktoplysning)[0] || null,
    employeeCount: meta?.nyesteMaanedsbeskaeftigelse?.intervalKodeAntalAnsatte?.split('_')?.slice(1,2)?.join('-') || null,
    employeeCountYear: meta?.nyesteMaanedsbeskaeftigelse?.aar || null,
    adProtected: data.reklamebeskyttet,
    ...mapAddress(meta?.nyesteBeliggenhedsadresse || {}),
  }
}
