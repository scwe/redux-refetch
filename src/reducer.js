
const initalState = {
  list: [],
  num: 0
}

export default function reducer(state = initalState, action){
  switch(action.type){
    case 'ADD_LIST':
      return Object.assign({}, state, {
        list: state.list.concat(action.element)
      })
    case 'INCREMENT_NUMBER':
      return Object.assign({}, state, {
        num: state.num + 1
      })
    case 'DECREMENT_NUMBER':
      return Object.assign({}, state, {
        num: state.num - 1
      })
    case 'RESET_NUMBER':
      return Object.assign({}, state, {
        num: 0
      })
    case 'SET_NUMBER':
      return Object.assign({}, state, {
        num: action.number
      })
    default:
      return state
  }
}
