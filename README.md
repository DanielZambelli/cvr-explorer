# CVR EXPLORER
JavaScript/SDK for integrating with the [danish business register (CVR)](https://datacvr.virk.dk/data/) making it effortless to fetch and export business data and annual reports. 

* Search, Find, Segment businesses by name, branch, region... See options below.
* Option to get data in simple or raw format
* Supports individual look up or streaming to file for data export jobs

## Get started
Request access for "system-til-system-adgang-til-cvr-data" by email to [cvrselvbetjening@erst.dk](mailto:cvrselvbetjening@erst.dk). It is free but may take a couple of weeks before you receive your account details.

## Authorize
Once you have recived your credentials, you can authorize and access the service by setting environment variable: 
```
CVR_KEY=YOUR_USERNAME:YOUR_PASSWORD
```

## Usage
Fetch 250 businesses from capital region.
``` js
const CvrEx = require('cvr-explorer')

CvrEx.fetchBusinesses({ limit: 250, regions: [ CvrEx.REGIONS.CAPITAL ] }).then(console.log)
```

Stream 250.000 businesses from capital region to file. Data chunks are seperated by delimiter. Data are kept in its raw format.
``` js
CvrEx.fetchBusinessesToFile({ 
  dir: __dirname,
  delimiter: '^^',
  raw: true, 
  limit: 250000, 
  regions: [ CvrEx.REGIONS.CAPITAL ] 
}).then(filePath => console.log(filePath))
```

Fetches annual reports for a business by its cvr.
``` js
CvrEx.fetchAnnualReports(32345794).then(console.log)
```

## Options
`fetchBusinesses` and `fetchBusinessesToFile` takes options:
* limit : int, limits numbers of hits fetched- default is 500
* raw : boolean, when true hits will be returned in its raw unmapped format- default is false
* active : boolean, request active or ceased businesses- default to undefined including both
* cvrs: array of string or int, request hits that match cvrs e.g. [32685552, "32345794"]
* names: array of string, request hits that match business names e.g. ["dkwebhost","mærsk a/s"]
* branchCodes: array of int, e.g. [99900000]
* types: array of string, e.g. [ CvrEx.TYPES.AS, CvrEx.TYPES.ENK ]
  * CvrEx.TYPES.AS
  * CvrEx.TYPES.APS
  * CvrEx.TYPES.ENK
  * CvrEx.TYPES.IVS
  * CvrEx.TYPES.IS
  * CvrEx.TYPES.AS
* regions: array of string, e.g. [ CvrEx.REGIONS.CAPITAL ]
  * CvrEx.REGIONS.CAPITAL
  * CvrEx.REGIONS.ZELAND
  * CvrEx.REGIONS.MIDDLE
  * CvrEx.REGIONS.NORTH
  * CvrEx.REGIONS.SOUTH
* employees: array of string, e.g. [ CvrEx.EMPLOYEES.I_0_0, CvrEx.EMPLOYEES.I_1_1 ]
  * CvrEx.EMPLOYEES.I_0_0
  * CvrEx.EMPLOYEES.I_1_1
  * CvrEx.EMPLOYEES.I_2_4
  * CvrEx.EMPLOYEES.I_5_9
  * CvrEx.EMPLOYEES.I_10_19
  * CvrEx.EMPLOYEES.I_20_49
  * CvrEx.EMPLOYEES.I_50_99
  * CvrEx.EMPLOYEES.I_100_199
  * CvrEx.EMPLOYEES.I_200_499
  * CvrEx.EMPLOYEES.I_500_999
  * CvrEx.EMPLOYEES.I_1000_999999

## Tech stack 
JavaScript, ElasticSearch Queries, Jest, CVR cloud solution:
* https://data.virk.dk/datakatalog/erhvervsstyrelsen/system-til-system-adgang-til-cvr-data
* https://data.virk.dk/datakatalog/erhvervsstyrelsen/system-til-system-adgang-til-regnskabsdata
* http://distribution.virk.dk/cvr-permanent/_mapping
