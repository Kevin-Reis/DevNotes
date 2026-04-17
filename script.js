
let aparecerModal = new bootstrap.Modal(document.getElementById('blocoNotas')); //varaivel que guarda a minha modal

let btnModal = document.getElementById('btn-abrir');

let btnSalvar = document.getElementById('btn-salvar');
let titulo = document.getElementById('inputTitulo');
let conteudo = document.getElementById('inputConteudo');
let lista = document.getElementById('lista-notas');

let erroTitulo = document.getElementById('erroTitulo');
let erroConteudo = document.getElementById('erroConteudo');

//Variaveis que guardam Elementos HTML pelo seu ID para serem usados depois

function carregarNotas() {
    let salvas = localStorage.getItem('notas'); // tenta buscar o item na chave "notas" no localstorage, e guarda esse resultado na vairavel,pode ser uma string com dados ou null.
    return salvas ? JSON.parse(salvas) : []; //se tiver algo salvo em "salvas",  converte a string de volta pra array com JSON.parse, se não tiver retorna um array vazio
}

function salvarNotas(notas) {
    localStorage.setItem('notas', JSON.stringify(notas)); //esta função recebe um array de notas, converte ele para string usando JSON.stringify e salva no localstorage na chave "notas"
}

function renderizarNotas() {
    let notas = carregarNotas();

    lista.innerHTML = ''; //limpa todos os card da tela anes de renderizar os novos para evita duplicacao toda vez q a funcao for chamada.

    notas.forEach((nota) => { //percorre o meu array "notas" e tudo oque ele percorre guarda no parametro "nota"
        let card = `<div class="col-md-4">
                <div class="card shadow-sm border-roxo">
                    <div class="card-body">
                        <h5 class="card-title text-primary">${nota.titulo}</h5> <!--esta acesando os dados do meu array "notas" usando o parametro "nota".-->
                        <p class="card-text">${nota.conteudo}</p>
                        <button class="btn btn-sm btn-outline-danger" data-id="${nota.id}">Excluir</button>
                        <button class="btn btn-sm btn-outline-danger" data-id="${nota.id}">Editar</button>
                    </div>
                </div>
            </div>`;
        lista.innerHTML += card; //adiciona mais um igual ao que ja existe na lista, sem apagar o outro que ja estava la
    })
    document.querySelectorAll('[data-id]').forEach((btn) => { // pega todos os elemtnos hmtl que tem o atributo "data-id", que neste caso sera o botao de excluir de cada card, percorre cada atributo "data-id" 
        btn.addEventListener('click', () => { excluirNota(btn.dataset.id) }) //e para cada um deles adiciona um evento de click que chama a função excluirNota passando o valor do "data-id" do botao clicado, que é o id da nota que queremos excluir.
    });
}


function excluirNota(id) {
    let notas = carregarNotas(); //guarda as notas salvas  no localStorage na variavel "notas"

    notas = notas.filter((nota) => nota.id !== id);// mantem a nota se o id dela for diferente do id recebido pelo parametro, ou seja se o id recebido do parametro for igual ao id da nota(botao do excluir ele vai excluir a nota do array

    salvarNotas(notas); //salva o array atualizado

    renderizarNotas(); // renderiza as notas atualizadas na tela, ou seja sem a nota que foi excluida.
}


function validar() {

    erroTitulo.textContent = "";
    erroConteudo.textContent = ""; // limpa as mensagens de erro antes de validar novamente


    if (titulo.value == "") {
        erroTitulo.textContent = "Preencha o campo título";
        return
    }

    if (conteudo.value == "") {
        erroConteudo.textContent = "Preencha o campo conteúdo";
        return
    }

    let novaNota = { //objeto com 3 propriedades
        id: Date.now().toString(), //gera unm id unico para cada nota 
        titulo: titulo.value, //acessa o valor do input titulo e guarda na propriedade titulo do objeto novaNota
        conteudo: conteudo.value//acessa o valor do input conteudo e guarda na propriedade conteudo do objeto novaNota
    };

    let notas = carregarNotas(); //carrega as notas salvas no localStorage e guarda na variavel "notas"
    notas.push(novaNota); //adiciona a nova nota ao array de notas;
    salvarNotas(notas); //salva o array atualizado com a nova nota no localStorage
    renderizarNotas(); //renderiza as notas atualizadas na tela, ou seja com a nova nota adicionada.


    aparecerModal.hide(); //fecha o modal depois de salvar a nota
    titulo.value = ""; //limpa o campo titulo depois de salvar a nota
    conteudo.value = ""; //limpa o campo conteudo depois de salvar a nota

}


btnSalvar.addEventListener('click', validar);

btnModal.addEventListener('click', () => { //quando o btnModal for clicado sera aberto o meu modal usando a variavel aparecerModal que guarda a minha modal.
    aparecerModal.show();
})

renderizarNotas(); //chama a função renderizarNotas para exibir as notas salvas no localStorage quando a página for carregada.