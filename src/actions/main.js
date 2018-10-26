export const UPDATE = 'UPDATE'
export const SET_EVENTS = 'SET_EVENTS'
export const TOGGLE_FETCHING = 'TOGGLE_FETCHING'
export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS'

export function update(key, value) {
  return dispatch => {
    dispatch({
      type: UPDATE,
      key,
      value
    })
  }
}

export function setEvents(events) {
  return dispatch => {
    dispatch({
      type: SET_EVENTS,
      events
    })
  }
}

export function toggleFetching() {
  return dispatch => {
    dispatch({
      type: TOGGLE_FETCHING
    })
  }
}

export function addTransactions(transactions) {
  return dispatch => {
    dispatch({
      type: ADD_TRANSACTIONS,
      transactions
    })
  }
}
