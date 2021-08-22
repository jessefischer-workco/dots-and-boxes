import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Box extends React.Component {


  render() {
    return (
      <div className={"box" +
          (this.props.top ? " topDrawn" : "") +
          (this.props.bottom ? " bottomDrawn" : "") +
          (this.props.left ? " leftDrawn" : "") +
          (this.props.right ? " rightDrawn" : "") +
          (this.props.winner === "X" ? " winnerX" : "")}
          onClick={this.props.onClick}>
        { this.props.winner }
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
      nextPlayer: "A",
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
          winner: "."
        };
      }
    }
    
  }

  render() {

    return (
      <div className='board'>
        <div className="status">Next Player: {this.state.nextPlayer}</div>


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
    return ( box.top && box.bottom && box.left && box.right );
  }

  handleClick( e, i, j ) {
    let x = e.clientX - e.target.getBoundingClientRect().left;
    let y = e.clientY - e.target.getBoundingClientRect().top;


    // Clone boxes state

    let newBoxes = this.state.boxes.slice();

    // let newBoxes = [];
    // for ( let k=0; k<this.state.boxes.length; k++ ) {
    //   newBoxes[k] = this.state.boxes[k].slice();
    // }


    if ( y < 10 ) {
      newBoxes[i][j].top = true;
      if ( i > 0 ) {
        newBoxes[i-1][j].bottom = true;
        newBoxes[i-1][j].winner = this.checkWinner( newBoxes[i-1][j]) ? "X" : ".";
      }
    }
    if ( y > 40 ) {
      newBoxes[i][j].bottom = true;
      if ( i < newBoxes.length - 1 ) {
        newBoxes[i+1][j].top = true;
        newBoxes[i+1][j].winner = this.checkWinner( newBoxes[i+1][j]) ? "X" : ".";
      }
    }
    if ( x < 10 ) {
      newBoxes[i][j].left = true;
      if ( j > 0 ) {
        newBoxes[i][j-1].right = true;
        newBoxes[i][j-1].winner = this.checkWinner( newBoxes[i][j-1]) ? "X" : ".";
      }
    }
    if ( x > 40 ) {
      newBoxes[i][j].right = true;
      if ( j < newBoxes[i].length - 1 ) {
        newBoxes[i][j+1].left = true;
        newBoxes[i][j+1].winner = this.checkWinner( newBoxes[i][j+1]) ? "X" : ".";
      }
    }


    // Check if winner

    newBoxes[i][j].winner = this.checkWinner( newBoxes[i][j] ) ? "X" : ".";


    if ( newBoxes)


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
          <ol></ol>
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
