import 'react-app-polyfill/ie11'
import 'react-app-polyfill/ie9'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { initReactI18next } from 'react-i18next'
import i18next from 'i18next'
import { is_browser_supported } from './utils/browser'
import langEN from './lang/en.json'

import App from './App'
import { store } from './redux/store'


const supportedEl = document.getElementById('app')
const unsupportedEl = document.getElementById('browserError')

if (is_browser_supported(['Chrome', 'Edge', 'Firefox', 'Safari'])) {
  if (supportedEl) supportedEl.style.display = 'block'
  if (unsupportedEl) unsupportedEl.style.display = 'none'

  const rootElement = document.getElementById('root')

  i18next
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // not needed for react!!
      },
      resources: {
        en: {
        translation: langEN
         }
      }
    })

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement
  )

} else {
  if (supportedEl) supportedEl.style.display = 'none'
  if (unsupportedEl) unsupportedEl.style.display = 'block'
}