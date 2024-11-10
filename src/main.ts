import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import { initializeApp } from 'firebase/app';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css';  


const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': '#EEEEEE',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',
    primary: '#1867C0',
    'primary-darken-1': '#1F5592',
    secondary: '#48A9A6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
  variables: {
    'border-color': '#000000',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#000000',
  }
}


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme:{
    defaultTheme: 'myCustomLightTheme',
    themes:{
      myCustomLightTheme
    }
  }
})

//firebase config
const config = {
  apiKey: 'AIzaSyBeDsKwvP8SbwhwUjVmHnPidW2LxLqOWsg',
  authDomain: 'stock-track499.firebaseapp.com',
  projectId: 'stock-track499',
  storageBucket: 'stock-track499.appspot.com',
  messagingSenderId: '1087349742937',
  appId: '1:1087349742937:web:c2469041ea35a95d164048',
  measurementId: 'G-0ZBL0Z29BP'
};

//init firebase
initializeApp(config)

//create app using router and vueitfy
const app = createApp(App);
app.use(vuetify);
app.use(router);
app.mount('#app');