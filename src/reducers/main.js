import { groupBy } from 'lodash'

import {
  UPDATE,
  SET_EVENTS,
  TOGGLE_FETCHING,
  ADD_TRANSACTIONS
} from '../actions/main'

const initialState = {
  isFetching: true,
  game: undefined,
  events: {},
  transactions: []
}

export default (state = initialState, action) => {
  switch(action.type) {
    case UPDATE:
      return {
        ...state,
        game: {
          ...state.game,
          [action.key]: action.value
        }
      }
    case SET_EVENTS:
      return {
        ...state,
        events: groupBy(action.events.reverse(), (e) => e.event)
      }
    case TOGGLE_FETCHING:
      return {
        ...state,
        isFetching: !state.isFetching
      }
    case ADD_TRANSACTIONS:
      return {
        ...state,
        transactions: state.transactions.concat(action.transactions)
      }
    default:
      return state
  }
}
