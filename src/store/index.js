import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import storage from 'redux-persist/lib/storage'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { adminApi } from './services/admin.service'
import { postApi } from './services/post.service'
import { placeApi } from './services/place.service'
import { userApi } from './services/user.service'
import { chatApi } from './services/chat.service'
import { superadminApi } from './services/superadmin.service'
import { combineReducers } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'auth',
  storage,
}

const persistAuthReducer = persistReducer(persistConfig, authReducer)
// store.js


const appReducer = combineReducers({
  [adminApi.reducerPath]: adminApi.reducer,
  [postApi.reducerPath]: postApi.reducer,
  [placeApi.reducerPath]: placeApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [superadminApi.reducerPath]: superadminApi.reducer,
  auth: persistAuthReducer,
})

const rootReducer = (state, action) => {
  if (action.type === 'auth/clearUser') {
    state = undefined // ← resets ALL reducers including RTK Query caches
  }
  return appReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer, // ← use rootReducer instead of inline object
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      adminApi.middleware,
      postApi.middleware,
      userApi.middleware,
      chatApi.middleware,
      placeApi.middleware,
      superadminApi.middleware,
    ),
})

export const persistor = persistStore(store)
