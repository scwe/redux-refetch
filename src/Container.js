import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

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
    return (
      <div> 
        <button onClick={this.props.addElement.bind(this, 'Test')}>
          Button
        </button>
        <div>
          {this.renderList()}
        </div>
      </div>
    )
  }

}

function mapStateToProps (state, props) {
  return {
    list: state.list,
    num: state.num
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addElement(element){
      dispatch({
        type: 'ADD_LIST',
        element
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
