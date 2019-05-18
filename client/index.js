const card = post => {
  return `
    <li class="collection-item avatar view" data-id="${post._id}">
      <a class="modal-trigger view" href="#veiwPerson" style="color: #000000" data-id="${post._id}">
        <span class="title view" data-id="${post._id}"><b>${post.title} ${post.text}</b></span> <br>
        <p class="view" data-id="${post._id}">${post.days}</p>
        <small class="view" data-id="${post._id}">${new Date(post.date).toLocaleDateString()}</small> <br>
      </a>
      <button class="btn btn-small red js-remove" data-id="${post._id}">
        <i class="material-icons js-remove" data-id="${post._id}">delete</i>
      </button>
    </li>
  `
}

const info = person => {
  return `
  <h4>${person.title} ${person.text}</h4>
  <p>Recorded in: ${new Date(person.date).toLocaleDateString()}; Days left: ${person.days}</p>
  `
}

const noDays = person => {
  return `
  <p>Set vacation days</p>
  <button class="btn btn-small green setData modal-trigger" data-id="${person._id}" data-target="setDays">
    <i class="material-icons setData" data-id="${person._id}">add</i>
  </button>
  `
}

const haveDays = person => {
  return `
  <p>Your have ${person.vacation} vacation days<p>
  <p>Yor vacantion started in: ${new Date(person.beginDate).toLocaleDateString()}</p>
  <p>Remove vacation days</p>
  <button class="btn btn-small red removeData" data-id="${person._id}">
    <i class="material-icons removeData" data-id="${person._id}">delete</i>
  </button>
  `
}

let posts = []
let modal, modal2, modal3
const BASE_URL = '/post'

class PostApi {
  static fetch() {
    return fetch(BASE_URL, {method: 'get'}).then(res => res.json())
  }

  static create(post) {
    return fetch(BASE_URL, {
      method: 'post',
      body: JSON.stringify(post),
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  }

  static remove(id) {
    return fetch(`${BASE_URL}/${id}`, {
      method: 'delete'
    }).then(res => res.json())
  }
}

document.addEventListener('DOMContentLoaded', () => {
  PostApi.fetch().then(backendPosts => {
    posts = backendPosts.concat()
    renderPosts(posts)
  })

  modal = M.Modal.init(document.querySelector('.modal'))
  modal2 = M.Modal.init(document.querySelector('.modal-fixed-footer'))
  modal3 = M.Modal.init(document.querySelector('.modal1'))

  document.querySelector('#createPost').addEventListener('click', onCreatePost)
  document.querySelector('#posts').addEventListener('click', onDeletePost)
  document.querySelector('#posts').addEventListener('click', onOpenModal)
  document.querySelector('#setDays').addEventListener('click', onSetDay)
})

function renderPosts(_posts = []){
  const $posts = document.querySelector('#posts')

  if (_posts.length > 0) {
    $posts.innerHTML = _posts.map(post => card(post)).join(' ')
  } else {
    $posts.innerHTML = `<div class="center">Empty yet</div>`
  }
}

function onCreatePost() {
  const $title = document.querySelector('#title')
  const $text = document.querySelector('#text')
  const $days = document.querySelector('#days')

  if ($title.value && $text.value) {
    const newPost = {
      title: $title.value,
      text: $text.value,
      days: $days.value
    }
    PostApi.create(newPost).then(post => {
      posts.push(post)
      renderPosts(posts)
    })
    modal.close()
    $title.value = ''
    $text.value = ''
    $days.value = ''
    M.updateTextFields()
  }
}

function onDeletePost(event) {
  if (event.target.classList.contains('js-remove')) {
    const decision = confirm('Are you really want do this?')

    if (decision) {
      const id = event.target.getAttribute('data-id')

      PostApi.remove(id).then(() => {
        const postIndex = posts.findIndex(post => post._id === id)
        posts.splice(postIndex, 1)
        renderPosts(posts)
      })
    }
  }
}

function onOpenModal(event) {
  if (event.target.classList.contains('view')) {
    const $person = document.querySelector('#information')
    const id = event.target.getAttribute('data-id')
    const onePerson = posts.find(post => post._id === id)
    if(onePerson.vacation > 0){
      $person.innerHTML = info(onePerson) + haveDays(onePerson)
    } else {
      $person.innerHTML = info(onePerson) + noDays(onePerson)
    }
  }
}

function onSetDay(event) {
  if (event.target.classList.contains('configmDates')) {
    const $amount = document.querySelector('#amount')
    const $beginDate = document.querySelector('#vacation')
    const id = event.target.getAttribute('data-id')
    const onePerson = posts.find(post => post._id === id)
    onePerson.amount = $amount.value
    onePerson.beginDate = $beginDate.value
    modal.close()
    $amount.value = ''
    $beginDate.value = ''
    M.updateTextFields()
  }
}
