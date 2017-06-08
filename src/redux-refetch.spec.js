import React, { Component, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Container from './Container'
import { shallow, mount } from 'enzyme'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import connect from './redux-refetch'
import configureStore from 'redux-mock-store'

const middlewares = []
const mockStore = configureStore(middlewares)

const createTestComponent = () => {
  return class OtherTestComponent extends PureComponent{
    componentWillUpdate(){
      console.log('Updating test component')
    }

    render(){
      console.log('Rendering test component, props are: ', this.props)
      return null
    }
  }
}

function mapStateToProps(state){
  return {
    prop: state.num_1
  }
}

function mapStateToDependencies (state) {
  return {
    dependency: state.num_2
  }
}


function buildRefetchMapping(spy) {
  return (dispatch) => {
    return {
      spy 
    }
  }
}

function connectTestComponent (component, spy){
  return connect(
    mapStateToProps,
    mapStateToDependencies,
    null,
    buildRefetchMapping(spy))(component)
}

const initalState = {
  num_2: 5,
  num_1: 0
}

function reducer(state = initalState, action){
  switch(action.type){
    case 'INCREMENT_NUMBER_1':
      return Object.assign({}, state, {
        num_1: state.num_1 + 1
      })
    case 'INCREMENT_NUMBER_2':
      return Object.assign({}, state, {
        num_2: state.num_2 + 1
      })
    default:
      return state
  }
}

it('should do something', () => {
  const store = createStore(reducer)
  const spy = jest.fn()
  const TestComponent = connectTestComponent(createTestComponent(), spy)
  const app = mount(
    <Provider store={store}>
      <TestComponent/>
    </Provider>
  )

  store.dispatch({
    type: 'INCREMENT_NUMBER_2'
  })

  expect(spy.mock.calls.length).toEqual(1)
});

