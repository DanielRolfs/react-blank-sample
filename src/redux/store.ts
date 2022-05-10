import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'


let devTools: boolean | undefined = undefined

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-undef
if (ESBUILD_DEBUG) { // replaced during build
    devTools = true
}

export const store = configureStore({
    devTools: devTools,
    reducer: {
       
    },
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware()
})

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type depends on reducers
export type AppDispatch = typeof store.dispatch
//export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()