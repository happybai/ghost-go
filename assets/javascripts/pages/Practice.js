import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

import mainStyles from '../styles/main'
import { connect } from 'react-redux'

//external component
import { StyleSheet, css } from 'aphrodite'
import PuzzleList from '../presentations/PuzzleList'
import { fetchPuzzles } from '../actions/FetchActions'
import { setPracticePuzzleId } from '../actions/Actions'
import PuzzleBoard from '../presentations/PuzzleBoard'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'
import { postPuzzleRecord, postRating } from '../actions/PostActions'

import Favorite from 'material-ui/svg-icons/action/favorite'
import FavoriteBorder from 'material-ui/svg-icons/action/favorite-border'


class Practice extends Component {

  state = {
    intervalId: null,
    timeLeft: 60,
    life: 5,
  }

  constructor(props) {
    super(props)

    this.props.dispatch(fetchPuzzles({
      page: 1,
      rank: '18k-10k'
    }))
  }

  nextPuzzle() {
    let index = this._getCurrentPuzzleIndex()
    if (index < this.props.puzzles.data.puzzles.length) {
      this.props.dispatch(setPracticePuzzleId(this.props.puzzles.data.puzzles[index + 1].id))
    } else {
      console.log('bottom')
    }
    this.handlePanelReset()
  }

  prevPuzzle() {
    let index = this._getCurrentPuzzleIndex()
    if (index > 0) {
      this.props.dispatch(setPracticePuzzleId(this.props.puzzles.data.puzzles[index - 1].id))
    } else {
      console.log('top')
    }
  }

  handleClick(id) {
    this.props.dispatch(setPracticePuzzleId(id))
  }

  handleRight() {
    this._handlePuzzleRecord('right')
    clearInterval(this.state.intervalId)
    this.refs.board.handleRightTipOpen()
    setTimeout(() => {
      this.handleReset()
      this.nextPuzzle()
    }, 2000)
  }

  handleWrong() {
    this._handlePuzzleRecord('wrong')
    this.refs.board.handleWrongTipOpen()
    this.minusLife()
    setTimeout(() => {
      this.handleReset()
      if (this.state.life === 0) {
        this.nextPuzzle()
      }
    }, 2000)
  }

  handleReset() {
    this.refs.board.handleTipsReset()
    this.refs.board.reset()
  }

  handlePanelReset() {

  }

  handlePause() {

  }

  componentDidMount() {
    this.setState({ intervalId: setInterval(::this.timer, 1000) })
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  minusLife() {
    this.setState((prevState, props) => {
      if (prevState.life > 0) {
        return { life: prevState.life - 1 }
      }
    })
  }

  timer() {
    this.setState((prevState, props) => {
      let timeLeft = prevState.timeLeft
      if (timeLeft > 0) {
        timeLeft --
      } else {
        console.log('Time out!')
      }
      return { timeLeft: timeLeft }
    })
  }

  _handlePuzzleRecord(type) {
    const { auth } = this.props
    let profile = auth.getProfile()
    let puzzle = this._getCurrentPuzzle()

    this.props.dispatch(postPuzzleRecord({
      puzzle_id: puzzle.id,
      user_id: profile.user_id,
      record_type: type
    }))
  }

  _getCurrentPuzzleIndex() {
    return _.findIndex(this.props.puzzles.data.puzzles, { id: this.props.currentPuzzleId || this.props.puzzles.data.puzzles[0].id })
  }

  _getCurrentPuzzle() {
    return _.find(this.props.puzzles.data.puzzles, {id: this.props.currentPuzzleId || this.props.puzzles.data.puzzles[0].id})
  }

  render() {
    let puzzleList, puzzle, puzzleBoard, whofirst, rank, favorite
    if (this.props.puzzles.data !== undefined) {
      puzzle = this._getCurrentPuzzle()
      puzzleList = <PuzzleList puzzleListOnClick={::this.handleClick}
        puzzleList={this.props.puzzles.data.puzzles}
        currentPuzzleId={puzzle.id}
      />
      puzzleBoard = <PuzzleBoard researchMode={this.state.researchMode} className="board"
        whofirst={puzzle.whofirst}
        puzzle={puzzle.steps}
        right_answers={puzzle.right_answers}
        wrong_answers={puzzle.wrong_answers}
        answers={puzzle.answers}
        handleRight={::this.handleRight}
        handleWrong={::this.handleWrong}
        ref="board" />

      whofirst = <h1 className={css(styles.title)}>{puzzle.whofirst}</h1>
      rank = <h1 className={css(styles.title)}>{puzzle.rank}</h1>
      favorite = []
      for (let i = 0; i < this.state.life; i++) {
        favorite.push(<Favorite key={`fav-${i}`} className={css(styles.favorite)} />)
      }
      for (let i = 0; i < 5 - this.state.life; i++) {
        favorite.push(<FavoriteBorder key={`fav-b-${i}`} className={css(styles.favorite)} />)
      }
    }
    return (
      <div className={css(mainStyles.mainContainer)}>
        <Paper className={css(styles.list)}>
          { puzzleList }
        </Paper>
        <Paper className={css(styles.board)}>
          { puzzleBoard }
        </Paper>
        <Paper className={css(styles.panel)}>
          <div>
            { whofirst }
          </div>
          <Divider />
          <div>
            { rank }
          </div>
          <Divider />
          <div>
            <h1 className={css(styles.title)}>Life: </h1>
            { favorite }
          </div>
          <div>
            <h1 className={css(styles.title)}>Time Left:</h1>
            <div className={css(styles.title)}>{`${ this.state.timeLeft }s`}</div>
          </div>
          <Divider />
          <div>
            <RaisedButton
              onClick={::this.handlePause}
              label="Pause"
              primary={true}
            />
          </div>
        </Paper>
      </div>
    )
  }
}

const styles = StyleSheet.create({

  list: {
    display: 'flex',
    height: 'calc(100vmin - 100px)',
    overflow: 'hidden',
    overflowY: 'visible',
  },

  board: {
    flex: '1 1 auto',
    width: 'calc(100vmin - 100px)',
    height: 'calc(100vmin - 100px)',
    marginLeft: '20px',
  },

  panel: {
    padding: '20px',
    flex: '0 0 270px',
    height: 'calc(100vmin - 100px)',
    marginLeft: '20px',
  },

  favorite: {
    width: '30px',
    height: '30px',
    color: 'red',
  },

  title: {
    fontSize: '24px'
  }

})

function select(state) {
  return {
    currentPuzzleId: state.practicePuzzleId,
    puzzles: state.puzzles
  }
}

export default connect(select)(Practice)