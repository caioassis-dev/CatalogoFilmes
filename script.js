
let capaFilmes = document.getElementById('capaFilmes')
let botoesGeneros = document.getElementById('botoesGeneros')
let input = document.querySelector('.input')
let imprimePagina = document.getElementById('botoesTrocaPagina')
let jsonFilmes = []
let jsonGeneros = []
let botoes = undefined
let generosFiltrados = []
let nomeFilmes = ['Fullmetal Alchemist: The Final Alchemy', 'Orphan: First Kill', 'Hocus Pocus 2', 'Bullet Train', 'Fall', 'Project Gemini', 'Athena', 'Secret Headquarters', 'The Infernal Machine', 'Pinocchio', 'Beast', 'Lou', 'After Ever Happy', 'Monster High: The Movie', 'Thor: Love and Thunder', 'Paws of Fury: The Legend of Hank', 'Bullet Proof','Smile','DC League of Super-Pets', 'Mr. Harrigan\'s Phone']

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let page = isNaN(params.page) || params.page == null ? 1 : params.page;
// let flag = params.language; 

// ===== CONECTANDO PAGINA COM A API ============= // 
fetch(`https://api.themoviedb.org/3/movie/popular?api_key=90568d4fc2a188d492c961b248ea425b&language=en-US&page=${page}`).then(response => {
  return response.json();
}).then(retornoJson => {
  render(retornoJson.results)
  jsonFilmes = retornoJson.results
  imprimePaginas(5)
  //  console.log(jsonFilmes)
})
fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=90568d4fc2a188d492c961b248ea425b&language=en-US').then(response => {
  return response.json();
}).then(retornoJson => {
  imprimeGenero(retornoJson.genres)
  jsonGeneros = retornoJson.genres
  // console.log(jsonGeneros)
})

input.addEventListener('input', function (e) {
  let arrayFilmesFiltrado = jsonFilmes.filter(function (filme) {
    let filmesLowerCase = filme.title.toLowerCase()
    return filmesLowerCase.indexOf(input.value.toLowerCase()) !== -1
  });
  render(arrayFilmesFiltrado)
})

function atribuirEventos() {
  botoes = document.getElementsByClassName('botaoGenero')
  for (let i = 0; i < botoes.length; i++) {
    botoes[i].addEventListener('click', function () {
    botoes[i].classList.toggle('botaoGeneroSelecionado')
    if(botoes[i].classList.contains('botaoGeneroSelecionado') == true){
      generosFiltrados.push(parseInt(botoes[i].dataset.id))
    }else {
      let index = generosFiltrados.indexOf(parseInt(botoes[i].dataset.id))
      generosFiltrados.splice(index, 1)
    }
    filtrarfilmes(generosFiltrados)
  })
}
}

function filtrarfilmes(generos){
  if(generos.length === 0 ){
    return render(jsonFilmes)
  }
  let filmesfiltrados = jsonFilmes.filter(function (filme){
    for(let i=0; i <filme.genre_ids.length; i++){
      if(generos.indexOf(filme.genre_ids[i]) !== -1) 
      return true
    }
  })
  render(filmesfiltrados)
}

function render(movies) {
  let html = ''
  movies.forEach(movie => {
    let dataOriginal = movie.release_date
    let [year, month, day] = dataOriginal.split('-');
    let dataFormatada = [day, month, year].join('/');
    html += `<div class="cardContainer"><img class='imagem' src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="Poster do Filme" height="264" width="176"><br>${movie.title}<br>${dataFormatada}</div>` 
  });
  capaFilmes.innerHTML = html
}

function imprimeGenero(genres) {
  let html = ''
  genres.forEach(genre => {
    html += `<button class='botaoGenero' data-id='${genre.id}'>${genre.name}</button>`
  })
  botoesGeneros.innerHTML = html
  atribuirEventos()
}

function imprimePaginas(paginas) {
  let html = ''
  html += `<div class="botoesPagina"><a class="botaoChange" href="?page=${page == 1 ? 1 : parseInt(page)-1}"><</a>`
  for(let i = 1; i<paginas; i++){
    html += `<a class="botaoChange" href="?page=${i}">${i}</a>`
  }
    html += `<a class="botaoChange" href="?page=${parseInt(page)+1}">></a></div>`
  imprimePagina.innerHTML = html
}

// TENTAR FAZER O AUTO COMPLETE
// BUG GENERO QUANDO DESABILITA O BOTAO 
// DESIGN BOTAO

