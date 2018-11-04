import PouchDB from 'pouchdb'
import relational from 'relational-pouch'
import find from 'pouchdb-find'
PouchDB.plugin(relational)
PouchDB.plugin(find)

const db = new PouchDB('sw')
db.setSchema([
  {
    singular: 'film',
    plural: 'films',
    relations: {
      planets: { hasMany: { type: 'planet', options: { async: true } } },
      characters: { hasMany: { type: 'person', options: { async: true } } },
      species: { hasMany: { type: 'species', options: { async: true } } },
      starships: { hasMany: { type: 'starship', options: { async: true } } },
      vehicles: { hasMany: { type: 'vehicle', options: { async: true } } }
    }
  },
  {
    singular: 'person',
    plural: 'people',
    relations: {
      homeworld: { belongsTo: { type: 'planet', options: { async: true } } },
      films: { hasMany: { type: 'film', options: { async: true } } },
      species: { hasMany: { type: 'species', options: { async: true } } },
      starships: { hasMany: { type: 'starship', options: { async: true } } },
      vehicles: { hasMany: { type: 'vehicle', options: { async: true } } }
    }
  },
  {
    singular: 'planet',
    plural: 'planets',
    relations: {
      films: { hasMany: { type: 'film', options: { async: true } } },
      residents: { hasMany: { type: 'person', options: { async: true } } }
    }
  },
  {
    singular: 'species',
    plural: 'species',
    relations: {
      homeworld: { belongsTo: { type: 'planet', options: { async: true } } },
      films: { hasMany: { type: 'film', options: { async: true } } },
      people: { hasMany: { type: 'person', options: { async: true } } }
    }
  },
  {
    singular: 'starship',
    plural: 'starships',
    relations: {
      films: { hasMany: { type: 'film', options: { async: true } } },
      pilots: { hasMany: { type: 'person', options: { async: true } } }
    }
  },
  {
    singular: 'vehicle',
    plural: 'vehicles',
    relations: {
      films: { hasMany: { type: 'film', options: { async: true } } },
      pilots: { hasMany: { type: 'person', options: { async: true } } }
    }
  }
])

export default {
  PouchDB: PouchDB,
  instance: db
}
