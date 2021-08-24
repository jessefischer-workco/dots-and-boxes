import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Box = (props) =>
  <div className={"box" +
      (props.top ? " top" + props.top : "") +
      (props.bottom ? " bottom" + props.bottom : "") +
      (props.left ? " left" + props.left : "") +
      (props.right ? " right" + props.right : "") +
      (props.winner ? " winner" + props.winner : "")}
      onClick={props.onClick}>
    <span className='winner'>{props.winner || "_"}</span>
    <div className='topLeft'></div>
    <div className='topRight'></div>
    <div className='bottomLeft'></div>
    <div className='bottomRight'></div>
  </div>



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

  gameStatus() {
    if ( this.state.scores["A"] + this.state.scores["B"] < this.state.boxes.length * this.state.boxes[0].length ) {
      return `Current Player: ${this.state.currentPlayer}`;
    }
    else if ( this.state.scores["A"] > this.state.scores["B"] ) {
      return `Game Over. Winner: Player A!`;
    }
    else if ( this.state.scores["B"] > this.state.scores["A"] ) {
      return `Game Over. Winner: Player B!`;
    }
    else
      return `Game Over. Tie Game.`
  }

  render() {
    return (
      <div className='board'>
        <div className="status">
          { this.gameStatus() }<br /><br />
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
      // Check if current player won the current box
      if ( box.top && box.bottom && box.left && box.right  ) {
        state.scores[state.currentPlayer]++;
      }
      // Check for game over
      if ( state.scores["A"] + state.scores["B"] >= state.boxes.length * state.boxes[0].length ) {
        state.currentPlayer = "";
      }
      return state;        
    });
    if ( box.top && box.bottom && box.left && box.right ) {
      return this.state.currentPlayer;
    }
    else return "";
  }

  handleClick( e, i, j ) {
    e.preventDefault();

    // First, get coordinates of click relative to box
    let x = e.clientX - e.target.getBoundingClientRect().left;
    let y = e.clientY - e.target.getBoundingClientRect().top;

    // Clone boxes state
    let newBoxes = this.state.boxes.slice();
    let winnerFlag = false, turnFlag = false;

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
    if ( ! newBoxes[i][j].winner ) {
      newBoxes[i][j].winner = this.checkWinner( newBoxes[i][j] );
      if ( newBoxes[i][j].winner ) winnerFlag = true;
    }

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


const Game = () =>
  <div className="game">
    <div className="game-board">
      <Board height='3' width='5' />
    </div>
    <div className="game-info">
      <div></div>
    </div>
  </div>


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
