## Redux Refetch

```JavaScript
someFunc()
```

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
  mapDispatchToRefetch
)(ExpensiveComponent)
```

`mapStateToProps` and `mapDispatchToProps` are the same as they are within [react-redux](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
