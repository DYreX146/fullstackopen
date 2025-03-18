import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    removeNotification() {
      return ''
    }
  }
})

export const { createNotification, removeNotification } = notificationSlice.actions

export const setNotification = (message, duration) => {
  return  dispatch => {
    const timeout = duration * 1000
    dispatch(createNotification(message))
    setTimeout(() => dispatch(removeNotification()), timeout)
  }
}

export default notificationSlice.reducer