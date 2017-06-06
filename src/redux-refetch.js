import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

function buildContainer (RealContainer){
  return class DependentContainer extends PureComponent{
    getNormalProps(fullProps){
      const { __dependencies, __refetch, ...rest } = fullProps
      return rest
    }

    shouldRefetch (dependencies, newDependencies){
      let willRefetch = false
      Object.keys(dependencies).forEach((dependencyKey) => {
        if(dependencies[dependencyKey] !== newDependencies[dependencyKey]){
          willRefetch = willRefetch || true
        }
      })
      return willRefetch
    }

    refetch (refetchers) {
      Object.keys(refetchers).forEach((refetchKey) => refetchers[refetchKey]())
    }

    componentWillUpdate(nextProps, nextState) {
      if(this.shouldRefetch(this.props.__dependencies, nextProps.__dependencies)){
        this.refetch(nextProps.__refetch)
      }
    }
    
    render () {
      return <RealContainer {...this.getNormalProps(this.props)} />
    }
  }
}

export default function enhancedConnect(mapStateToProps, mapStateToDependencies, mapDispatchToProps, mapDispatchToRefetch){
  const mapState = (state, props) => ({
    ...mapStateToProps(state, props),
    __dependencies: {
      ...mapStateToDependencies(state, props)
    }
  })

  const mapDispatch = (dispatch) => ({
    ...mapDispatchToProps(dispatch),
    __refetch: {
      ...mapDispatchToRefetch(dispatch)
    }
  })

  return (component) => connect(mapState, mapDispatch)(buildContainer(component))
}
