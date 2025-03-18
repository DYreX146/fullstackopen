import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    addVote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(anecdote => anecdote.id === id)
      const changedAnecdote = { 
        ...anecdoteToChange, 
        votes: anecdoteToChange.votes + 1
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote 
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { appendAnecdote, addVote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = anecdote => {
  const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  return async dispatch => {
    await anecdoteService.update(updatedAnecdote.id, updatedAnecdote)
    dispatch(addVote(anecdote.id))
  }
}

export default anecdoteSlice.reducer