## Redux Refetch

A simple automated data refetcher for using `react-redux`. The basic use case is when you have some data that needs to be refetched anytime there is a change in some of the underlying properties. However, often times there is no point in refetching the data as the component which renders it may not be mounted, so you end up repeating the same pattern of

```JavaScript
class ExpensiveComponent extends Component {
  componentWillUpdate(newProps, newState){
    if(this.shouldRefetch(this.props, newProps)){
      this.refetchingFunction()
    }
  }

  shouldRefetch(oldProps, newProps){
    return oldProps.prop1 !== newProps.prop1
        || oldProps.prop2 !== newProps.prop2
        ...
  }
}

```

within every component that renders some server side data.

### Installation

In progress, planned to be on npm soon™.

### Usage

```JavaScript
import connect from 'redux-refetch'

class ExpensiveComponent extends Component {
  render(){
    ...
  }
}

mapStateToDependencies(state, ownProps) {
  return {
    dependency1: dependency1Selector(state),
    ...
  }
}

mapDispatchToRefetch(state, ownProps) {
  return {
    refetchFunction,
    refetchFunction2,
    ...
  }
}

export default connect(
  mapStateToProps,
  mapStateToDependencies,
  mapDispatchToProps,
  mapDispatchToRefetch
)(ExpensiveComponent)
```

`mapStateToProps` and `mapDispatchToProps` are the same as they are within [react-redux](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).

 > Note: You cannot use the keys `__dependencies` or `__refetch` for any props, both manually supplied props i.e. `<Component prop={'prop'}/>` and when creating the `mapStateToProps` or `mapDispatchToProps` function. These are interally used keys when building the container.

### API

#### `connect(?mapStateToProps, ?mapStateToDependencies, ?mapDispatchToProps, ?mapDispatchToRefetch, ?options)`

The only part of this package. It is an enhanced version of `react-redux` [connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options). It not only allows you to add redux action creators and properties from state as `props` within a react component, but it also allows you to ensure that, when one of the dependencies given in `mapStateToDependencies`, all of the refetching functions are called too.

##### Arguments

* [`mapStateToProps(state, [ownProps])`] (*Function*): This is the same as in `react-redux`. Documentation for that can be found [here](https://github.com/reactjs/react-redux/blob/master/docs/api.md#arguments)


* [`mapStateToDependencies(state, [ownProps])`] (*Function*): This function returns an object of all dependencies for the refetcher. It takes the redux state and the props supplied to the component as arguments and you should return an object containing all of the dependencies. When any of the dependencies supplied changes then all of the functions defined in `mapDispatchToRefetch` will be called.
* [`mapDispatchToProps(state, [ownProps])`] (*Function*): This is the same as in `react-redux`. Documentation for that can be found [here](https://github.com/reactjs/react-redux/blob/master/docs/api.md#arguments)
* [`mapDispatchToRefetch(state, [ownProps])`] (*Function*): A function which takes both the redux state and the props supplied when rendering the component. It should return an object with each of a functions to call when the any of the dependencies defined in `mapStateToDependencies` change.
* [`options`] (*Object*): If specified customizes the connector for both `redux-refetch` and `react-redux`. Possible options are as shown below.
  * [`equalityCheck`] (*Function*): If supplied will test whether the dependencies have changed. If this argument is not supplied then it will default to `===`.
  * [`mergeProps`] (*Function*): If specified, it is called with the results of `mapStateToProps`, `mapDispatchToProps` and `props` and expects the final props object as a return. More documentation on this can be found [here](https://github.com/reactjs/react-redux/blob/master/docs/api.md#arguments).
  * [`connectOptions`] (*Object*): These are the options that get passed into `connect` from `react-redux`. Again more complete and well rounded documentation can be found [here](https://github.com/reactjs/react-redux/blob/master/docs/api.md#arguments)


### Contributing

Feel free to open a PR or submit an issue if you want to suggest or improve something
