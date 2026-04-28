let minhasNotas = carregarNotas()
let aparecerModal = new bootstrap.Modal(document.getElementById('blocoNotas')); //varaivel que guarda a minha modal

let btnModal = document.getElementById('btn-abrir');

let btnSalvar = document.getElementById('btn-salvar');
let titulo = document.getElementById('inputTitulo');
let conteudo = document.getElementById('inputConteudo');
let lista = document.getElementById('lista-notas');

let erroTitulo = document.getElementById('erroTitulo');
let erroConteudo = document.getElementById('erroConteudo');

let notaEditandoId = null; //variavel para guardar o id da nota para saber qual nota esta sendo editada, inicialmente é null porque não estamos editando nenhuma nota.
let inputBusca = document.getElementById('inputBusca')
//Variaveis que guardam Elementos HTML pelo seu ID para serem usados depois




function salvarNotas(notas) {
    localStorage.setItem('notas', JSON.stringify(notas)); //esta função recebe um array de notas, converte ele para string usando JSON.stringify e salva no localstorage na chave "notas"
}


function carregarNotas() {
    let salvas = localStorage.getItem('notas'); // tenta buscar o item na chave "notas" no localstorage, e guarda esse resultado na vairavel,pode ser uma string com dados ou null.

    return salvas ? JSON.parse(salvas) : []; //se tiver algo salvo em "salvas",  converte a string de volta pra array com JSON.parse, se não tiver retorna um array vazio
}






function excluirNota(id) {
    let notas = carregarNotas(); //guarda as notas salvas  no localStorage na variavel "notas"

    notas = notas.filter((nota) => nota.id !== id);// mantem a nota se o id dela for diferente do id recebido pelo parametro, ou seja se o id recebido do parametro for igual ao id da nota botao do excluir ele vai excluir a nota do array

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



    if (notaEditandoId) { //se a variavel "notaEditandoId" tiver um valor, ou seja se estivermos editando uma nota
        let notas = carregarNotas(); //chama a funcao carregarNotas para pegar as notas salvas no localStorage e guarda na variavel "notas"

        notas = notas.map((nota) => { //percorre o array de notas e para cada nota verifica se o id dela é igual ao id da nota que estamos editando, que esta guardado na variavel "notaEditandoId"
            if (nota.id === notaEditandoId) {
                return { id: nota.id, titulo: titulo.value, conteudo: conteudo.value }; //se for igual retorna um novo objeto com o mesmo id e os novos valores de titulo e conteudo
            }
            return nota; //se não for igual retorna a nota sem alterações
        });
        salvarNotas(notas); //salva o array atualizado no localStorage
        notaEditandoId = null; //reseta a variavel "notaEditandoId" para null, para indicar que não estamos mais editando nenhuma nota
    } else {
        let novaNota = { id: Date.now().toString(), titulo: titulo.value, conteudo: conteudo.value }//cria um novo objeto novaNota com um id unico e os valores de titulo e conteudo do modal
        let notas = carregarNotas();
        notas.push(novaNota); //adiciona a nova nota ao array de notas
        salvarNotas(notas); //salva o array atualizado no localStorage
    }

    renderizarNotas(); //renderiza as notas atualizadas na tela, ou seja com a nova nota adicionada ou com a nota editada
    aparecerModal.hide(); //fecha o modal depois de salvar a nota
    titulo.value = ""; //limpa o campo titulo depois de salvar a nota
    conteudo.value = ""; //limpa o campo conteudo depois de salvar a nota
}




function editarNota(id) {// o id que chegou no parametro e o id do botao de editar que foi clicado, ou seja o id da nota que queremos editar

    let notas = carregarNotas(); //carrega as notas salvas no localStorage e guarda na variavel "notas"
    let nota = notas.find((n) => n.id === id); //procura no array de notas a nota que tem o id igual ao id recebido pelo parametro, e guarda essa nota na variavel "nota", exemplo se o usuario clicou na nota que tem o id = 2 ele vai procurar no array de notas a nota que tem o id = 2 e guarda essa nota na variavel "nota"

    titulo.value = nota.titulo; //preenche o campo titulo do modal com o titulo da nota que queremos editar
    conteudo.value = nota.conteudo; //preenche o campo conteudo do modal com o conteudo da nota que queremos editar

    notaEditandoId = id; //guarda o id da nota que estamos editando na variavel "notaEditandoId" para saber qual nota esta sendo editada

    aparecerModal.show(); //abre o modal para editar a nota

}

function renderizarNotas(listaParaExibir = carregarNotas()) { // todas as minhas notas vao ser gurdadas no meu parametro "listaParaExibir"
    let contador = document.getElementById('contador-notas')
    let lista = document.getElementById('lista-notas')
    let notas = carregarNotas();

    if(contador){
        contador.textContent = listaParaExibir.length; //contador de notas, o length conta quantas notas tem no meu array, o textContent apaga oq e o padrao e reescreve o novo, no caso escreve quantas notas foram encontradas
    }

    if(listaParaExibir.length === 0){
        contador.style.color = '#FF0000';
        
    }else{
        contador.style.color = '#FF0000';
        contador.style.color = '#6f42c1';
    }//style.color ele usado para colcoar um codigo de cor direto no javaScript.

    lista.innerHTML = ''; //limpa todos os card da tela anes de renderizar os novos para evita duplicacao toda vez q a funcao for chamada.

    listaParaExibir.forEach((nota) => { //percorre o meu parametro "listaParaExibir" e exibe meus objetos q se denominam como nota"
        let card = `<div class="col-md-4">
                <div class="card shadow-sm border-roxo">
                    <div class="card-body">
                        <h5 style="color: #6f42c1 !important; " class="card-title text-primary">${nota.titulo}</h5> <!--esta acesando os dados do meu array "notas" usando o parametro "nota".-->
                        <p class="card-text">${nota.conteudo}</p>
                        <button class="btn btn-sm btn-outline-danger btn-vermelho" data-id="${nota.id}">Excluir</button>
                        <button class="btn btn-sm btn-outline-danger btn-roxo" data-editar="${nota.id}">Editar</button>
                    </div>
                </div>
            </div>`;
        lista.innerHTML += card; //adiciona mais um igual ao que ja existe na lista, sem apagar o outro que ja estava la
    });

    if (listaParaExibir.length === 0) { // conta quantos itens tem dentro do array se for 0 mostra a mensagem que esta abaixo
        lista.innerHTML = '   <p class="text-center text-muted mt-5">Nenhuma nota encontrada...</p>';
    }


    document.querySelectorAll('[data-id]').forEach((btn) => { // pega todos os elemtnos hmtl que tem o atributo "data-id", que neste caso sera o botao de excluir de cada card, percorre cada atributo "data-id" 
        btn.addEventListener('click', () => { excluirNota(btn.dataset.id) }); //e para cada um deles adiciona um evento de click que chama a função excluirNota passando o valor do "data-id" do botao clicado, que é o id da nota que queremos excluir.
    });



    document.querySelectorAll('[data-editar]').forEach((btn) => {
        btn.addEventListener('click', () => { editarNota(btn.dataset.editar) });
    });
}


inputBusca.addEventListener('input', () => {
    let termo = inputBusca.value.toLowerCase();
    let notasAtuais = carregarNotas(); 

    let notasFiltradas = notasAtuais.filter(item => {
        // Usei "item" aqui para não confundir com outras variáveis
        return item.titulo.toLowerCase().includes(termo) || item.conteudo.toLowerCase().includes(termo); // me returna a pesquisa com o que esta escrito no titulo da nota ou o conteudo da nota, ele pergunta, o seu titulo tem incluso nele oq o usuario(termo) digitou.
    });

    renderizarNotas(notasFiltradas);
});



btnSalvar.addEventListener('click', validar);

btnModal.addEventListener('click', () => { //quando o btnModal for clicado sera aberto o meu modal usando a variavel aparecerModal que guarda a minha modal.
    aparecerModal.show();
})

renderizarNotas(); //chama a função renderizarNotas para exibir as notas salvas no localStorage quando a página for carregada.