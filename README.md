# CVR EXPLORER
Fetch and export business data and annual reports from the [danish business register (CVR)](https://datacvr.virk.dk/data/)- easier than ever!

* Search, find, segment by name, branch, region...
* Supports raw and normalized format...
* Supports look up or streaming to file for data export jobs...

<p align="left">
  <img width="150px" src="https://raw.githubusercontent.com/DanielZambelli/cvr-explorer/master/icon.png" />
</p>

## Get started
Request access for "system-til-system-adgang-til-cvr-data" by email to [cvrselvbetjening@erst.dk](mailto:cvrselvbetjening@erst.dk). It is free but may take a couple of weeks before receiving your account credentials.

## Authorize
Access the service by setting environment variable using your account: 
```
CVR_KEY=USERNAME:PASSWORD
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
  delimiter: ',',
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

## Sources
* https://data.virk.dk/datakatalog/erhvervsstyrelsen/system-til-system-adgang-til-cvr-data
* https://data.virk.dk/datakatalog/erhvervsstyrelsen/system-til-system-adgang-til-regnskabsdata
* http://distribution.virk.dk/cvr-permanent/_mapping
