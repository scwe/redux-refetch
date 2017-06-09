import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

function areEqual(oldDependency, newDependency, equalityCheck){
  if(!equalityCheck){
    return oldDependency === newDependency
  }
  return equalityCheck(oldDependency, newDependency)
}

function buildContainer (RealContainer, options){
  return class DependentContainer extends PureComponent{
    getNormalProps(fullProps){
      const { __dependencies, __refetch, ...rest } = fullProps
      return rest
    }

    shouldRefetch (dependencies, newDependencies){
      let willRefetch = false
      Object.keys(dependencies).forEach((dependencyKey) => {
        if(!areEqual(dependencies[dependencyKey], newDependencies[dependencyKey], options.equalityCheck)){
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

export default function enhancedConnect(mapStateToProps, mapStateToDependencies, mapDispatchToProps, mapDispatchToRefetch, options = {}){
  const mapState = (state, ownProps) => {
    const props = mapStateToProps ? mapStateToProps(state, ownProps) : {}
    const __dependencies = mapStateToDependencies ? mapStateToDependencies(state, ownProps) : {}
    const res = {
      ...props,
      __dependencies
    }

    return res
  }

  const mapDispatch = (dispatch, ownProps) => {
    const props = mapDispatchToProps ? mapDispatchToProps(dispatch, ownProps) : {}
    const __refetch = mapDispatchToRefetch ? mapDispatchToRefetch(dispatch, ownProps) : {} 

    return {
      ...props,
      __refetch
    }
  }

  return (component) => connect(
    mapState, 
    mapDispatch, 
    options.mergeProps, 
    options.connectOptions
  )(buildContainer(component, options))
}
