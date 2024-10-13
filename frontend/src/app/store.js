import {configureStore} from '@reduxjs/toolkit'
import userStateReducer from '../features/userStateSlice'
import { loadState, saveState } from './locStorage'

const persistedState = loadState();

export const store = configureStore({
    reducer : {
        userState : userStateReducer
    },
    preloadedState : persistedState
})


store.subscribe(() => {
    saveState(store.getState())
})