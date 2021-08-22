import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Box extends React.Component {

  render() {
    return (
      <div className={"box" +
          (this.props.top ? " top" + this.props.top : "") +
          (this.props.bottom ? " bottom" + this.props.bottom : "") +
          (this.props.left ? " left" + this.props.left : "") +
          (this.props.right ? " right" + this.props.right : "") +
          (this.props.winner ? " winner" + this.props.winner : "")}
          onClick={this.props.onClick}>
        <span className='winner'>{this.props.winner || "_"}</span>
        <div className='topLeft'></div>
        <div className='topRight'></div>
        <div className='bottomLeft'></div>
        <div className='bottomRight'></div>
      </div>
    );
  }
}



class Board extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      currentPlayer: "A",
      scores: {"A": 0, "B": 0},
      boxes: []
    }
    for (let i=0; i<Number( props.height); i++ ) {
      this.state.boxes[i] = [];
      for (let j=0; j<Number( props.width); j++ ) {
        this.state.boxes[i][j] = {
          top: null,
          left: null,
          right: null,
          bottom: null,
          winner: ""
        };
      }
    }
    
  }

  render() {

    return (
      <div className='board'>
        <div className="status">
          Current Player: {this.state.currentPlayer}<br />
          Player A: {this.state.scores['A']}<br />
          Player B: {this.state.scores['B']}
        </div>
        
        {this.state.boxes.map( (row,i) => (
          <div className='row'>
            {row.map( (box,j) => <Box
                winner={box.winner}
                top={box.top}
                bottom={box.bottom}
                left={box.left}
                right={box.right}
                i={i}
                j={j}
                onClick={(e)=>this.handleClick(e, i, j)}/>)}
          </div>
          ))
        }

       
      </div>

        
    );
  }

  checkWinner( box ) {
    this.setState( (state) => {
      if ( box.top && box.bottom && box.left && box.right  ) {
        state.scores[this.state.currentPlayer]++;
      }
      return state;        
    });
    if ( box.top && box.bottom && box.left && box.right ) {
      return this.state.currentPlayer;
    }
    else return "";
  }

  handleClick( e, i, j ) {
    // First, get coordinates of click relative to box
    let x = e.clientX - e.target.getBoundingClientRect().left;
    let y = e.clientY - e.target.getBoundingClientRect().top;

    // Clone boxes state
    let newBoxes = this.state.boxes.slice();
    let winnerFlag = false, turnFlag = false;

    // let newBoxes = [];
    // for ( let k=0; k<this.state.boxes.length; k++ ) {
    //   newBoxes[k] = this.state.boxes[k].slice();
    // }


    if ( y < 10 ) {
      if ( ! newBoxes[i][j].top ) {
        newBoxes[i][j].top = this.state.currentPlayer;
        turnFlag = true;
        if ( i > 0 ) {
          newBoxes[i-1][j].bottom = this.state.currentPlayer;
          newBoxes[i-1][j].winner = this.checkWinner( newBoxes[i-1][j] );
          if ( newBoxes[i-1][j].winner ) winnerFlag = true;
        }
      }
    }
    else if ( y > 40 ) {
      if ( ! newBoxes[i][j].bottom ) {
        newBoxes[i][j].bottom = this.state.currentPlayer;
        turnFlag = true;
        if ( i < newBoxes.length - 1 ) {
          newBoxes[i+1][j].top = this.state.currentPlayer;
          newBoxes[i+1][j].winner = this.checkWinner( newBoxes[i+1][j] );
          if ( newBoxes[i+1][j].winner ) winnerFlag = true;
        }
      }
    }
    else if ( x < 10 ) {
      if ( ! newBoxes[i][j].left ) {
        newBoxes[i][j].left = this.state.currentPlayer;
        turnFlag = true;
        if ( j > 0 ) {
          newBoxes[i][j-1].right = this.state.currentPlayer;
          newBoxes[i][j-1].winner = this.checkWinner( newBoxes[i][j-1] );
          if ( newBoxes[i][j-1].winner ) winnerFlag = true;
        }
      }
    }
    else if ( x > 40 ) {
      if ( ! newBoxes[i][j].right ) {
        newBoxes[i][j].right = this.state.currentPlayer;
        turnFlag = true;
        if ( j < newBoxes[i].length - 1 ) {
          newBoxes[i][j+1].left = this.state.currentPlayer;
          newBoxes[i][j+1].winner = this.checkWinner( newBoxes[i][j+1] );
          if ( newBoxes[i][j+1].winner ) winnerFlag = true;
        }
      }
    }


    // Check if current box is winner
    newBoxes[i][j].winner = this.checkWinner( newBoxes[i][j] );
    if ( newBoxes[i][j].winner ) winnerFlag = true;

    // Update current player

    if ( turnFlag && !winnerFlag ) {
      if ( this.state.currentPlayer === "A" )
        this.setState( {currentPlayer: "B"});
      else
        this.setState( {currentPlayer: "A"});
    }

    // Update state
    this.setState( {boxes: newBoxes} );
  }

}


class Game extends React.Component {

  constructor( props )
  {
    super( props );
    this.currentPlayer = 1;
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board height='5' width='10' />
        </div>
        <div className="game-info">
          <div></div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
