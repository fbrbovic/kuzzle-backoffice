import {
  waitForConnected
  , connectToEnvironment
} from './kuzzleWrapper'
import store from '../vuex/store'
import { reset } from '../vuex/actions'
import {
  environments
  , currentEnvironmentId
  , currentEnvironment
} from '../vuex/modules/common/kuzzle/getters'
import * as kuzzleActions from '../vuex/modules/common/kuzzle/actions'
import * as authActions from '../vuex/modules/auth/actions'
import Promise from 'bluebird'

export const LAST_CONNECTED = 'lastConnectedEnv'
const ENVIRONMENTS = 'environments'
export const DEFAULT_COLOR = '#00757F'
export const DEFAULT = 'default'

const defaultEnvironment = {
  [DEFAULT]: {
    name: 'localhost',
    host: 'localhost',
    ioPort: 7512,
    wsPort: 7513,
    color: DEFAULT_COLOR
  }
}

export const persistEnvironments = (environments) => {
  // eslint-disable-next-line no-undef
  localStorage.setItem(ENVIRONMENTS, JSON.stringify(environments))
}
/**
 * Loads the environment definitions stored in localStorage, stores them in
 * the Vuex store, then returns the id of the last connected
 * environment if available, or the first environment id available otherwise.
 *
 * @return {Object} all environments.
 */
export const loadEnvironments = () => {
  let loadedEnv = {}

  try {
    // eslint-disable-next-line no-undef
    loadedEnv = JSON.parse(localStorage.getItem(ENVIRONMENTS) || '{}')
    if (Object.keys(loadedEnv).length === 0) {
      return defaultEnvironment
    }
  } catch (e) {
    return defaultEnvironment
  }

  return loadedEnv
}

/**
 * Creates an environment objects, stores it in the Vuex store and returns it.
 *
 * @param  {String} The name of the environment (displayed in the list).
 * @param  {String} The HEX color code of the main header bar when connected.
 * @param  {String} The hostname.
 * @param  {int} The port number for the Socket.IO protocol.
 * @param  {int} The port number for the Websocket protocol.
 *
 * @return {Object} The environment object.
 */
export const createEnvironment = (name, color, host, ioPort, wsPort) => {
  if (!color) {
    color = DEFAULT_COLOR
  }

  let newEnvironment = {
    name,
    color,
    host,
    ioPort,
    wsPort
  }

  kuzzleActions.addEnvironment(store, name, newEnvironment)
  return newEnvironment
}

export const loadLastConnectedEnvId = () => {
  // eslint-disable-next-line no-undef
  return localStorage.getItem(LAST_CONNECTED)
}

export const deleteEnvironment = (id) => {
  if (currentEnvironmentId(store.state) === id) {
    authActions.doLogout(store)
  }

  kuzzleActions.deleteEnvironment(store, id)
}

export const updateEnvironment = (id, name, color, host, ioPort, wsPort) => {
  let envToUpdate = environments(store.state)[id]
  if (!envToUpdate) {
    throw new Error(`The provided id ${id} does not correspond to any existing
      environment`)
  }

  envToUpdate = {
    ...envToUpdate, name, color, host, ioPort, wsPort
  }

  kuzzleActions.updateEnvironment(store, id, envToUpdate)
  return envToUpdate
}

export const setTokenToCurrentEnvironment = (token) => {
  kuzzleActions.updateEnvironment(
    store,
    currentEnvironmentId(store.state),
    {
      ...currentEnvironment(store.state),
      token: token
    }
  )

  return currentEnvironment(store.state)
}

export const switchEnvironment = (id) => {
  if (!id) {
    throw new Error(`cannot switch to ${id} environment`)
  }

  let environment = environments(store.state)[id]
  if (!environment) {
    throw new Error(`Id ${id} does not match any environment`)
  }

  reset(store)

  connectToEnvironment(environment)

  return waitForConnected(10000)
    .then(() => {
      kuzzleActions.setConnection(store, id)

      return authActions.loginByToken(store, environment.token)
        .then(user => {
          if (!user.id) {
            return authActions.checkFirstAdmin(store)
          }
          return Promise.resolve()
        })
    })
}