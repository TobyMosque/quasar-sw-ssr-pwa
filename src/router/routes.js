
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('pages/Index.vue')
      },
      {
        name: 'people-create',
        path: 'people/create',
        component: () => import('pages/Edit/Person.vue')
      },
      {
        name: 'films-create',
        path: 'films/create',
        component: () => import('pages/Edit/Film.vue')
      },
      {
        name: 'starships-create',
        path: 'starships/create',
        component: () => import('pages/Edit/Starship.vue')
      },
      {
        name: 'vehicles-create',
        path: 'vehicles/create',
        component: () => import('pages/Edit/Vehicle.vue')
      },
      {
        name: 'species-create',
        path: 'species/create',
        component: () => import('pages/Edit/Species.vue')
      },
      {
        name: 'planets-create',
        path: 'planets/create',
        component: () => import('pages/Edit/Planet.vue')
      },
      {
        name: 'people-edit',
        path: 'people/:id',
        component: () => import('pages/Edit/Person.vue')
      },
      {
        name: 'films-edit',
        path: 'films/:id',
        component: () => import('pages/Edit/Film.vue')
      },
      {
        name: 'starships-edit',
        path: 'starships/:id',
        component: () => import('pages/Edit/Starship.vue')
      },
      {
        name: 'vehicles-edit',
        path: 'vehicles/:id',
        component: () => import('pages/Edit/Vehicle.vue')
      },
      {
        name: 'species-edit',
        path: 'species/:id',
        component: () => import('pages/Edit/Species.vue')
      },
      {
        name: 'planets-edit',
        path: 'planets/:id',
        component: () => import('pages/Edit/Planet.vue')
      },
      {
        name: 'people',
        path: 'people',
        component: () => import('pages/List/People.vue')
      },
      {
        name: 'films',
        path: 'films/',
        component: () => import('pages/List/Films.vue')
      },
      {
        name: 'starships',
        path: 'starships',
        component: () => import('pages/List/Starships.vue')
      },
      {
        name: 'vehicles',
        path: 'vehicles',
        component: () => import('pages/List/Vehicles.vue')
      },
      {
        name: 'species',
        path: 'species',
        component: () => import('pages/List/Species.vue')
      },
      {
        name: 'planets',
        path: 'planets',
        component: () => import('pages/List/Planets.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    name: 'not_found',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
