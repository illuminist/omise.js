/**
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * The new Omise.js
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 */
import './helpers/polyfill'

import './vendors/easyXDM.js'

import Omise from './Omise'
import _OmiseCard from './OmiseCard'

import config from './config'

export default new Omise(config)
export const OmiseCard = new _OmiseCard(config)

// global.Omise = new Omise(config)
// global.OmiseCard = new OmiseCard(config)
