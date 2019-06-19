// import _ from 'lodash'
// import $ from 'jquery'
// import {ui} from './jquery.ui'

// ui()

// const dom = $('div')
// dom.html(_.join(['del','lee','hello'],'***'))
// $('body').append(dom)



console.log('hello')


if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').
    then(registration => {
      console.log('registed')
    }).catch(error => {
      console.log(error)
    })
  })
}
