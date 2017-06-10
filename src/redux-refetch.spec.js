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

const initialState = {
  dependency: 5,
  prop: 0
}

function reducer(state = initialState, action){
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
  const TestComponent = connect(
    mapStateToProps,
    mapStateToDependencies,
    null,
    buildRefetchMapping(spy))(createTestComponent())
  const app = mount(
    <Provider store={store}>
      <TestComponent/>
    </Provider>
  )

  store.dispatch({
    type: 'CHANGE_DEPENDENCY'
  })

  expect(spy).toHaveBeenCalledTimes(1)
})

it('shouldnt call refetch when dependencies dont change', () => {
  const store = createStore(reducer)
  const spy = jest.fn()
  const TestComponent = connect(
    mapStateToProps,
    mapStateToDependencies,
    null,
    buildRefetchMapping(spy))(createTestComponent())
  const app = mount(
    <Provider store={store}>
      <TestComponent/>
    </Provider>
  )

  store.dispatch({
    type: 'CHANGE_PROP'
  })

  expect(spy).toHaveBeenCalledTimes(0)
})

it('should update the component when event is dispatched', () => {
  const store = createStore(reducer)
  const updateSpy = jest.fn()
  const TestComponent = connect(
    mapStateToProps,
    mapStateToDependencies,
    null,
    buildRefetchMapping())(createTestComponent(updateSpy))
  const app = mount(
    <Provider store={store}>
      <TestComponent/>
    </Provider>
  )

  store.dispatch({
    type: 'CHANGE_PROP'
  })

  expect(updateSpy).toHaveBeenCalledTimes(1)
})

it('shouldnt update the component when dependency is changed', () => {
  const store = createStore(reducer)
  const updateSpy = jest.fn()
  const TestComponent = connect(
    mapStateToProps,
    mapStateToDependencies,
    null,
    buildRefetchMapping())(createTestComponent(updateSpy))
  const app = mount(
    <Provider store={store}>
      <TestComponent/>
    </Provider>
  )

  store.dispatch({
    type: 'CHANGE_DEPENDENCY'
  })

  expect(updateSpy).toHaveBeenCalledTimes(0)
})

it('should pass props in correctly', () => {
  const store = createStore(reducer)
  const propsSpy = jest.fn()
  const TestComponent = connect(
    mapStateToProps,
    mapStateToDependencies,
    null,
    buildRefetchMapping())(createTestComponent(null, propsSpy))
  const app = mount(
    <Provider store={store}>
      <TestComponent manualProp={1}/>
    </Provider>
  )

  expect(propsSpy).toHaveBeenCalledWith({
    prop: initialState.prop,
    manualProp: 1
  })

})

it('should pass props when mapStateToProps is null', () => {
  const store = createStore(reducer)
  const propsSpy = jest.fn()
  const TestComponent = connect(
    null,
    mapStateToDependencies,
    null,
    buildRefetchMapping())(createTestComponent(null, propsSpy))
  const app = mount(
    <Provider store={store}>
      <TestComponent manualProp={1}/>
    </Provider>
  )

  expect(propsSpy).toHaveBeenCalledWith({
    manualProp: 1
  })
})

it('should pass props when mapStateToDependencies is null', () => {
  const store = createStore(reducer)
  const propsSpy = jest.fn()
  const TestComponent = connect(
    mapStateToProps,
    null,
    null,
    buildRefetchMapping())(createTestComponent(null, propsSpy))
  const app = mount(
    <Provider store={store}>
      <TestComponent manualProp={1}/>
    </Provider>
  )

  expect(propsSpy).toHaveBeenCalledWith({
    prop: initialState.prop,
    manualProp: 1
  })
})

it('should pass props when mapStateToDispatch is null', () => {
  const store = createStore(reducer)
  const propsSpy = jest.fn()
  const TestComponent = connect(
    mapStateToProps,
    null,
    null,
    null)(createTestComponent(null, propsSpy))
  const app = mount(
    <Provider store={store}>
      <TestComponent manualProp={1}/>
    </Provider>
  )

  expect(propsSpy).toHaveBeenCalledWith({
    prop: initialState.prop,
    manualProp: 1
  })
})

it('should allow equalityCheck in options to change checking equality', () => {

})

it('should pass mergeProps to react-redux.connect', () => {
  const store = createStore(reducer)
  const mergePropsSpy = jest.fn(() => ({}))
  const propsSpy = jest.fn()
  const options = {
    mergeProps: mergePropsSpy
  }
  const TestComponent = connect(
    mapStateToProps,
    mapStateToDependencies,
    null,
    null, options)(createTestComponent(null, propsSpy))

  const app = mount(
    <Provider store={store}>
      <TestComponent manualProp={1}/>
    </Provider>
  )

  expect(mergePropsSpy).toHaveBeenCalledTimes(1)
  expect(mergePropsSpy).toHaveBeenCalledWith({
    prop: initialState.prop,
    __dependencies: {
      dependency: initialState.dependency
    },
  },{
    __refetch: {
    }
  },{
    manualProp: 1
  })

  expect(propsSpy).toHaveBeenCalledTimes(1)
  expect(propsSpy).toHaveBeenCalledWith({})
})

it('should pass options to reac-redux.connect', () => {
  const store = createStore(reducer)
  const stateEqualFunc = jest.fn()
  const statePropsEqualFunc = jest.fn()
  const propsSpy = jest.fn()

  const options = {
    connectOptions: {
      areStatesEqual: stateEqualFunc,
      areStatePropsEqual: statePropsEqualFunc
    }
  }
  const TestComponent = connect(
    mapStateToProps,
    mapStateToDependencies,
    null,
    null, options)(createTestComponent(null, propsSpy))

  const app = mount(
    <Provider store={store}>
      <TestComponent manualProp={1}/>
    </Provider>
  )

  expect(propsSpy).toHaveBeenCalledTimes(1)
  expect(propsSpy).toHaveBeenCalledWith({
    manualProp: 1,
    prop: initialState.prop
  })

  expect(stateEqualFunc).toHaveBeenCalledWith({
    prop: initialState.prop,
    dependency: initialState.dependency
  }, {
    prop: initialState.prop,
    dependency: initialState.dependency
  })
  expect(statePropsEqualFunc).toHaveBeenCalledWith({
    prop: initialState.prop,
    __dependencies: {
      dependency: initialState.dependency
    }
  }, {
    prop: initialState.prop,
    __dependencies: {
      dependency: initialState.dependency
    }
  }) 
})

it('should pass ownProps into mapStateTo... ', () => {
  const store = createStore(reducer)
  const mockDependencies = jest.fn(() => ({
    dependency: initialState.dependency
  }))
  const mockProps = jest.fn(() => ({
    prop: initialState.prop
  }))

  const TestComponent = connect(
    mockProps,
    mockDependencies,
    null,
    null)(createTestComponent())
  const app = mount(
    <Provider store={store}>
      <TestComponent manualProp={1}/>
    </Provider>
  )

  expect(mockDependencies).toHaveBeenCalledTimes(1)
  expect(mockDependencies).toHaveBeenCalledWith({
    prop: initialState.prop,
    dependency: initialState.dependency
  }, {
    manualProp: 1
  })

  expect(mockProps).toHaveBeenCalledTimes(1)
  expect(mockProps).toHaveBeenCalledWith({
    prop: initialState.prop,
    dependency: initialState.dependency
  },{
    manualProp: 1
  })
})

it('should pass ownProps into mapDispatchTo... ', () => {
  const store = createStore(reducer)
  const mockDispatch = jest.fn()
  const mockRefetch = jest.fn()

  const TestComponent = connect(
    null,
    null,
    mockDispatch,
    mockRefetch)(createTestComponent())
  const app = mount(
    <Provider store={store}>
      <TestComponent manualProp={1}/>
    </Provider>
  )

  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(mockDispatch.mock.calls[0][1]).toMatchObject({
    manualProp: 1
  })
  expect(typeof mockDispatch.mock.calls[0][0] === 'function').toBe(true)

  expect(mockRefetch).toHaveBeenCalledTimes(1)
  expect(mockRefetch.mock.calls[0][1]).toMatchObject({
    manualProp: 1
  })
  expect(typeof mockRefetch.mock.calls[0][0] === 'function').toBe(true)
})

