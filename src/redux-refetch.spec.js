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

const createTestComponent = (updateSpy, propsSpy) => {
  return class OtherTestComponent extends PureComponent{
    constructor(props){
      super(props)
      propsSpy && propsSpy(props)
    }

    componentWillUpdate(){
      updateSpy && updateSpy()
    }

    render(){ 
      return null 
    }
  }
}

function mapStateToProps(state){
  return {
    prop: state.prop
  }
}

function mapStateToDependencies (state) {
  return {
    dependency: state.dependency
  }
}


function buildRefetchMapping(spy) {
  return (dispatch) => {
    if(!spy){
      return {}
    }
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
  dependency: 5,
  prop: 0
}

function reducer(state = initalState, action){
  switch(action.type){
    case 'CHANGE_PROP':
      return Object.assign({}, state, {
        prop: state.prop + 1
      })
    case 'CHANGE_DEPENDENCY':
      return Object.assign({}, state, {
        dependency: state.dependency + 1
      })
    default:
      return state
  }
}


it('should call the refetch when dependencies change', () => {
  const store = createStore(reducer)
  const spy = jest.fn()
  const TestComponent = connectTestComponent(createTestComponent(), spy)
  const app = mount(
    <Provider store={store}>
      <TestComponent/>
    </Provider>
  )

  store.dispatch({
    type: 'CHANGE_DEPENDENCY'
  })

  expect(spy.mock.calls.length).toEqual(1)
})

it('shouldnt call refetch when dependencies dont change', () => {
  const store = createStore(reducer)
  const spy = jest.fn()
  const TestComponent = connectTestComponent(createTestComponent(), spy)
  const app = mount(
    <Provider store={store}>
      <TestComponent/>
    </Provider>
  )

  store.dispatch({
    type: 'CHANGE_PROP'
  })

  expect(spy.mock.calls.length).toEqual(0)
})

it('should update the component when event is dispatched', () => {
  const store = createStore(reducer)
  const spy = jest.fn()
  const updateSpy = jest.fn()
  const TestComponent = connectTestComponent(createTestComponent(updateSpy), spy)
  const app = mount(
    <Provider store={store}>
      <TestComponent/>
    </Provider>
  )

  store.dispatch({
    type: 'CHANGE_PROP'
  })

  expect(updateSpy.mock.calls.length).toEqual(1)
})

it('shouldnt update the component when dependency is changed', () => {
  const store = createStore(reducer)
  const spy = jest.fn()
  const updateSpy = jest.fn()
  const TestComponent = connectTestComponent(createTestComponent(updateSpy), spy)
  const app = mount(
    <Provider store={store}>
      <TestComponent/>
    </Provider>
  )

  store.dispatch({
    type: 'CHANGE_DEPENDENCY'
  })

  expect(updateSpy.mock.calls.length).toEqual(0)
})

it('should pass props in correctly', () => {
  const store = createStore(reducer)
  const propsSpy = jest.fn()
  const TestComponent = connectTestComponent(createTestComponent(null, propsSpy))
  const app = mount(
    <Provider store={store}>
      <TestComponent testProp={1}/>
    </Provider>
  )

  store.dispatch({
    type: 'CHANGE_DEPENDENCY'
  })

  expect(propsSpy).toHaveBeenCalledWith({
    prop: initalState.prop,
    testProp: 1
  })

})

it('should pass props when mapStateToProps is null', () => {

})

it('should pass props when mapStateToDispatch is null', () => {

})

it('should allow equalityCheck in options to change checking equality', () => {

})

it('should pass mergeProps to react-redux.connect', () => {

})

it('should pass options to reac-redux.connect', () => {

})

it('should pass ownProps into mapStateTo... and mapDispatchTo...', () => {

})

it('should allow props to be called __dependencies', () => {

})

it('should allow all arguments to be null', () => {
  
})



