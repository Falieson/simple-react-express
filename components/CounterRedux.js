/*  Counters | PX Ultimate React 2017 */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import typeValidator from '../redux/typeValidator'  // this creates a Proxy for actionTypes
import crypto from 'crypto'
const generateId = () => crypto.randomBytes(16).toString("hex")

// == REDUX
// = Redux ActionTypes
const SEPERATOR = "_"
const BASE = "PX"
const MODULE = "COUNTER"
const PREFIX = BASE + SEPERATOR + MODULE + SEPERATOR
const COUNTER_INCREMENT = PREFIX + "INCREMENT"
const COUNTER_DECREMENT = PREFIX + "DECREMENT"
const COUNTER_SELECT = PREFIX + "SELECT"
const COUNTER_CREATE = PREFIX + "CREATE"
const COUNTER_DELETE = PREFIX + "DELETE"

const actionTypes = {
  BASE,
  COUNTER_INCREMENT,
  COUNTER_DECREMENT,
  COUNTER_SELECT,
  COUNTER_CREATE,
  COUNTER_DELETE
}
const TYPES = typeValidator(actionTypes)

// = Redux Actions
// updateCounterValue({ recordId, incr = true }: { recordId, incr: boolean }) {
function updateCounterRecordValue({ recordId, incr = true } = {}) {
  // === UPDATE COUNTER
  const counterIncrement = {
    type: TYPES.COUNTER_INCREMENT,
    payload: { id: recordId },
    meta: {},
    error: false
  }
  const counterDecrement = {
    type: TYPES.COUNTER_DECREMENT,
    payload: { id: recordId },
    meta: {},
    error: false
  }

  // ASYNC ACTIONS
  // const attemptAction = {
  //   type: TYPES.COUNTER_UPDATE_ATTEMPT,
  //   payload: { id: recordId },
  //   meta: {},
  //   error: false
  // }
  // function errorAction(error) {
  //   return {
  //     type: TYPES.COUNTER_UPDATE_ERROR,
  //     payload: { id: recordId, error },
  //     meta: {},
  //     error: true
  //   }
  // }

  return function thunk(dispatch) {
    if (!incr) {
      // DECREMENT -- START
      dispatch(counterDecrement)
    } else {
      // INCREMENT -- START
      dispatch(counterIncrement)
    }
  }
}
function selectCounterRecord(id) {
  // === SELECT COUNTER
  function counterSelected(id) {
    return {
      type: TYPES.COUNTER_SELECT,
      payload: { id },
      meta: {},
      error: false
    }
  }

  return function thunk(dispatch) {
    dispatch(counterSelected(id))
  }
}
function deleteCounterRecord(recordId) {
  // === DELETE COUNTER
  const counterCreate = {
    type: TYPES.COUNTER_DELETE,
    payload: { id: recordId },
    meta: {},
    error: false
  }

  return function thunk(dispatch) {
    dispatch(counterCreate)
    return true
  }
}

function createCounterRecord(counterName = "", userSessionId = generateId()) {
  function newRecord(recordId, record) {
    // === CREATE COUNTER
    const counterCreate = {
      type: TYPES.COUNTER_CREATE,
      payload: { id: recordId, name: record.name, sessionId: record.sessionId },
      meta: {},
      error: false
    }

    return function thunk(dispatch) {
      dispatch(counterCreate)
      return recordId
    }
  }

  const recordId = generateId()
  return newRecord(recordId, {
    id: recordId,
    name: counterName,
    sessionId: userSessionId
  })
}


// = Redux Reducer
const defaultCounter = {
  value: 0, name: "First Counter", "id": generateId()
}
const defaultState = {
  counter: defaultCounter,
  counters: {
    records: {},
    meta: { recordsAmount: 1 }
  },
  lastUpdated: false,
  actions: []
}
defaultState.counters.records[defaultCounter.id] = defaultCounter

export function PX_COUNTERS_REDUCER(state = defaultState, action) {
  // accrue dispatched sub actionNames in an array
  const pastTenseLastType = (str) => {
    const tense = "ED"
    const addTense = (x, t) => x[x.length - 1] === t[0] ? x + t.substring(1, t.length) : x + t

    if (str.indexOf(SEPERATOR) > -1) {
      const subj = str.substring(str.lastIndexOf(SEPERATOR) + 1, str.length)
      return (!!tense && addTense(subj, tense)) || subj
    }
    return str
  }

  const actionLabel = (() => {
    if (action.payload !== undefined && action.payload.id !== undefined) {
      return `${pastTenseLastType(action.type)} (#${action.payload.id.substring(0, 3)})`
    }

    return pastTenseLastType(action.type)
  })()

  state.actions.push(actionLabel)

  // typical redux switch
  switch (action.type) {
    case TYPES.COUNTER_CREATE: {
      // $FlowFixMe redux-fsa
      const { id, name } = action.payload

      // set current counter to new counter
      const counter = { ...state.counter }
      counter.id = id
      counter.name = name
      counter.value = 0

      // add counter to records
      const counters = { ...state.counters }
      counters.records[id] = counter

      return {
        ...state,
        counter,
        counters,
        lastUpdated: new Date()
      }
    }

    case TYPES.COUNTER_SELECT: {
      // $FlowFixMe redux-fsa
      const { id } = action.payload

      return {
        ...state,
        counter: state.counters.records[id]
      }
    }

    case TYPES.COUNTER_DELETE: {
      // $FlowFixMe redux-fsa
      const { id } = action.payload

      // update the counter
      const counterKeys = Object.keys(state.counters.records)
      let counter = { ...state.counter }
      if (counter.id === id) {
        if (counterKeys.length === 1 && counterKeys[0] === id) {
          counter.id = undefined
        } else if (counterKeys.length > 0) {
          counter = state.counters.records[counterKeys[0]]
        } else {
          counter.id = undefined
        }
      }

      // update the counters
      let counters = { ...state.counters }
      delete counters.records[id]


      return {
        ...state,
        counter,
        counters
      }
    }

    // case TYPES.COUNTER_RENAME: {
    //   // $FlowFixMe redux-fsa
    //   const { id, name } = action.payload

    //   const counter = { ...state.counter }
    //   counter.name = name

    //   // optimistically update counter name in records
    //   const counters = { ...state.counters }
    //   counters.records[id].name = name

    //   return {
    //     ...state,
    //     counter,
    //     counters,
    //     lastUpdated: new Date()
    //   }
    // }

    case TYPES.COUNTER_INCREMENT: {
      // optimisticly update value in redux counterList
      const counter = { ...state.counter }
      counter.value += 1

      const counters = { ...state.counters }
      counters.records[counter.id] = counter

      return {
        ...state,
        counter,
        counters,
        lastUpdated: new Date()
      }
    }

    case TYPES.COUNTER_DECREMENT: {
      // optimisticly update value in redux counterList
      const counter = { ...state.counter }
      counter.value -= 1

      const counters = { ...state.counters }
      counters.records[counter.id] = counter

      return {
        ...state,
        counter,
        counters,
        lastUpdated: new Date()
      }
    }

    default:
      return state
  }
}

// add counter to redux store
const counterReducerName = "PX_COUNTERS_THUNK"
const counterReducer = {}
counterReducer[counterReducerName] = PX_COUNTERS_REDUCER
console.log({
  counterReducer
})
// makeReducer(counterReducer)

/* */
// == REACT
// === React Counter Component
class CounterContainer extends Component {
  // === Lifecycle
  static propTypes = {
    counters: PropTypes.object,
    counter: PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      name: PropTypes.string
    }).isRequired,
    changeCounter: PropTypes.func.isRequired,
    createCounter: PropTypes.func.isRequired,
    selectCounter: PropTypes.func.isRequired,
    deleteCounter: PropTypes.func.isRequired,
    actions: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  constructor(props) {
    super(props);
    // NOTE: WHY USE STATE? example for optimistic update of redux store
    // NOTE: DELETE STATE and use REDUX to store optimistic update  
    this.state = { value: this.props.counter.value };
  }
  componentWillUpdate(np, ns) {
    if (np.counter.value !== this.props.counter.value) {
      this.setState({
        value: np.counter.value
      })
    }
  }

  // === Actions
  select = (event, id) => {
    event.preventDefault();
    this.props.selectCounter(id)
  }
  create = (event) => {
    event.preventDefault();
    this.props.createCounter()
  }
  remove = (event, id) => {
    event.preventDefault();
    this.props.deleteCounter(id)
  }
  update = this.props.changeCounter

  increment = (event) => {
    event.preventDefault();
    const value = this.state.value + 1;
    this.setState({ value },
      () => this.update({
        incr: true,
        recordId: this.props.counter.id
      }));

  };

  decrement = (event) => {
    event.preventDefault();
    const value = this.state.value - 1;
    this.setState({ value },
      () => this.update({
        incr: false,
        recordId: this.props.counter.id
      }));
  };



  // === ReactComponent Renders
  renderCounterWidget() {
    const { counter } = this.props
    if (!counter.id) {
      return;
    }


    const count = (
      <p key="Count">
        Count: {this.state.value}
      </p>
    )

    const actions = (
      <p key="actions">
        <button onClick={this.decrement}>Decrement</button>
        <button onClick={this.increment}>Increment</button>
      </p>
    )

    return [count, actions]
  }
  renderCounterUL() {
    const { counters } = this.props

    const style = {
      ul: {
        padding: 0,
        margin: "16px 0"
      },
      li: {
        alignItems: "center",
        margin: "6px 0"
      },
      label: {
        display: "inline-flex",
        textAlign: "left"
      },
      actions: {
        display: "inline-flex",
        marginLeft: "3px",
        paddingLeft: "3px",
        textAlign: "right"
      }
    }

    const CounterKeys = Object.keys(counters)
    if (CounterKeys.length === 0) {
      return (
        <div>
          No counters found, make a new one!
        </div>
      )
    }

    return (
      <ul style={style.ul}>
        {CounterKeys.reverse().map(k => {
          const { id } = counters[k]

          return (
            <li key={id} style={style.li}>
              <div style={style.label}>
                <span>#{id.substring(0, 4)}</span>
              </div>
              <div style={style.actions}>
                <button onClick={(e) => this.select(e, id)}>Choose</button>
                <button onClick={(e) => this.remove(e, id)}>Remove</button>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
  render() {
    const { actions } = this.props

    return (
      <div>
        <h2>Redux Counter: {actions[actions.length - 1]}</h2>

        {this.renderCounterWidget()}

        <p>
          <button onClick={this.create}>Create New Counter</button>
        </p>
        <div>
          {this.renderCounterUL()}
        </div>
      </div>
    );
  }
}

// === React Redux mapStoreToProps
function mapStoreToProps(store) {
  const reducer = store[counterReducerName]
  const {
    counter, counters, actions
  } = reducer || {
      counter: defaultState.counter,
      counters: defaultState.counters,
      actions: []
    }

  return {
    counter,
    counters: counters.records,
    actions
  }
}

// === React Redux mapDispatchToProps
function mapDispatchToProps(dispatch) {
  return {
    changeCounter: ({ incr, counterId }) => {
      dispatch(
        updateCounterRecordValue({ incr, recordId: counterId })
      )
    },
    createCounter: (counterName, sessionId) => {
      dispatch(
        createCounterRecord(counterName, sessionId)
      )
    },
    selectCounter: (recordId: string) => {
      dispatch(
        selectCounterRecord(recordId)
      )
    },
    deleteCounter: (recordId: string) => {
      dispatch(
        deleteCounterRecord(recordId)
      )
    }
  }
}
// === React Redux connect (redux to component)
const ConnectedCounterContainer = connect(mapStoreToProps, mapDispatchToProps)(CounterContainer)

export default ConnectedCounterContainer
