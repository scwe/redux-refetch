import React, { PureComponent } from 'react'
import enhancedConnect from './redux-refetch'

class Container extends PureComponent {
  expensiveFunction (){
    console.log('Expensive Function called')
  }
  
  renderList (){
    return this.props.list.map((ele, index) => {
      return <li key={ele+index}> {ele} </li>
    })
  }

  render (){
    this.expensiveFunction()
    console.log('Props here are: ', this.props)
    return (
      <div> 
        <button onClick={this.props.addElement.bind(this, 'Test')}>
          Button
        </button>
        <button onClick={this.props.incrementNumber.bind(this)}>Update Number</button>
        <div>
          {this.renderList()}
        </div>
      </div>
    )
  }

}

function mapStateToProps (state, props) {
  return {
    list: state.list
  }
}

function mapStateToDependencies (state, props) {
  return {
    num: state.num
  }
}

function mapDispatchToRefetch (dispatch) {
  return {
    testFunction(){
      console.log('called')
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addElement(element){
      dispatch({
        type: 'ADD_LIST',
        element
      })
    },
    incrementNumber(){
      dispatch({
        type: 'INCREMENT_NUMBER'
      })
    }
  }
}

export default enhancedConnect(mapStateToProps, mapStateToDependencies, mapDispatchToProps, mapDispatchToRefetch)(Container)
