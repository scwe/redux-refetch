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

export default connect(
  mapStateToProps,
  mapStateToDependencies,
  mapDispatchToProps,
  mapDispatchToRefetch,
  options
)(ExpensiveComponent)
```

`mapStateToProps` and `mapDispatchToProps` are the same as they are within [react-redux](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)


### API

#### `connect(?mapStateToProps, ?mapStateToDependencies, ?mapDispatchToProps, ?mapDispatchToRefetch, ?options)`


##### Arguments

* [`mapStateToProps(state, [ownProps])`] (*Function*): This is the same as in `react-redux`. Documentation for that can be found [here](https://github.com/reactjs/react-redux/blob/master/docs/api.md#arguments)
* [`mapStateToDependencies(state, [ownProps])`] (*Function*):
* [`mapDispatchToProps(state)`] (*Function*): This is the same as in `react-redux`. Documentation for that can be found [here](https://github.com/reactjs/react-redux/blob/master/docs/api.md#arguments)
* [`mapDispatchToRefetch(state)`] (*Function*): This is the same as in `react-redux`. Documentation for that can be found [here](https://github.com/reactjs/react-redux/blob/master/docs/api.md#arguments)
* [`mapStateToProps(state, [ownProps])`] (*Function*): This is the same as in `react-redux`. Documentation for that can be found [here](https://github.com/reactjs/react-redux/blob/master/docs/api.md#arguments)

### Testing

* Make sure that all the arguments are optional
* Make sure that suppling props to the container when rendering still get passed in
* Test options for both `equalityCheck` and for the `react-redux.connect` stuff
* Ensure the `mapDispatchToRefetch` functions actually get called
* Ensure that ownProps are passed correctly everywhere
