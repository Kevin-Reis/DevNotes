let usuarioLogado = JSON.parse(localStorage.getItem('usuario')); //pega a chave "usuario" do localStorage e busca oq esta salvo nele e retorna uma string, o "JSON.parse" converte essa string de volta a objeto para conseguir acessar oq esta salvo nele no caso seuas propriedades.
let nomeLogado = document.getElementById('nomeLogado');

let btnConectar = document.getElementById('btn-conectar')
let btnSair = document.getElementById('btn-logout')

let minhasNotas = carregarNotas()
let aparecerModal = new bootstrap.Modal(document.getElementById('blocoNotas')); //varaivel que guarda a minha modal

let btnModal = document.getElementById('btn-abrir');

let btnSalvar = document.getElementById('btn-salvar');
let titulo = document.getElementById('inputTitulo');
let conteudo = document.getElementById('inputConteudo');
let contadorTitulo = document.getElementById('contadorTitulo');
let contadorConteudo = document.getElementById('contadorConteudo');
let lista = document.getElementById('lista-notas');

let erroTitulo = document.getElementById('erroTitulo');
let erroConteudo = document.getElementById('erroConteudo');

let notaEditandoId = null; //variavel para guardar o id da nota para saber qual nota esta sendo editada, inicialmente é null porque não estamos editando nenhuma nota.
let inputBusca = document.getElementById('inputBusca')

let idParaExcluir = null //variavel para guardar o id da nota que queremos excluir, inicialmente é null porque não estamos excluindo nenhuma nota.

let Categoria = document.getElementById('inputCategoria')

let selectOrdenacao = document.getElementById('selectOrdenacao');

let categoriaAtiva = 'Todos'

//Variaveis que guardam Elementos HTML pelo seu ID para serem usados depois

let logado = localStorage.getItem('logado')

if(!logado){
    window.location.href = 'login.html'
}

if(logado){
    btnConectar.style.display = 'none'
    nomeLogado.textContent = 'OLA, ' + usuarioLogado.nome + '!' ;
}






function salvarNotas(notas) {
    localStorage.setItem('notas', JSON.stringify(notas)); //esta função recebe um array de notas, converte ele para string usando JSON.stringify e salva no localstorage na chave "notas"
}


function carregarNotas() {
    let salvas = localStorage.getItem('notas'); // tenta buscar o item na chave "notas" no localstorage, e guarda esse resultado na vairavel,pode ser uma string com dados ou null.

    return salvas ? JSON.parse(salvas) : []; //se tiver algo salvo em "salvas",  converte a string de volta pra array com JSON.parse, se não tiver retorna um array vazio
}



function ModalExcluir(id) {
    idParaExcluir = id; //guarda o id da nota que queremos excluir na variavel "idParaExcluir" para saber qual nota esta sendo excluida
    let meuModal = new bootstrap.Modal(document.getElementById('modalConfirmacao'));

    meuModal.show()
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

        let agora = new Date(); //cria um objeto Date com a data e hora atual
        let dataEdicaoFormada = agora.toLocaleDateString('pt-BR') + ' às ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); //formata a data para o formato brasileiro e adiciona a hora formatada

        notas = notas.map((nota) => { //percorre o array de notas e para cada nota verifica se o id dela é igual ao id da nota que estamos editando, que esta guardado na variavel "notaEditandoId"
            if (nota.id === notaEditandoId) {
                return { id: nota.id, titulo: titulo.value, conteudo: conteudo.value, categoria: Categoria.value, data: nota.data, dataEdicao: dataEdicaoFormada }; //se for igual retorna um novo objeto com o mesmo id e os novos valores de titulo e conteudo
            }
            return nota; //se não for igual retorna a nota sem alterações
        });

        salvarNotas(notas); //salva o array atualizado no localStorage
        notaEditandoId = null; //reseta a variavel "notaEditandoId" para null, para indicar que não estamos mais editando nenhuma nota

    } else {

        let agora = new Date(); //cria um objeto Date com a data e hora atual
        let dataFormada = agora.toLocaleDateString('pt-BR') + ' às ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); //formata a data para o formato brasileiro e adiciona a hora formatada


        let novaNota = { id: Date.now().toString(), titulo: titulo.value, conteudo: conteudo.value, data: dataFormada, categoria: Categoria.value }//cria um novo objeto novaNota com um id unico e os valores de titulo e conteudo do modal
        let notas = carregarNotas();
        notas.push(novaNota); //adiciona a nova nota ao array de notas
        salvarNotas(notas); //salva o array atualizado no localStorage
    }

    renderizarNotas(); //renderiza as notas atualizadas na tela, ou seja com a nova nota adicionada ou com a nota editada
    aparecerModal.hide(); //fecha o modal depois de salvar a nota
    titulo.value = ""; //limpa o campo titulo depois de salvar a nota
    conteudo.value = ""; //limpa o campo conteudo depois de salvar a nota
    Categoria.value = "Pessoal";
}




function editarNota(id) {// o id que chegou no parametro e o id do botao de editar que foi clicado, ou seja o id da nota que queremos editar

    let notas = carregarNotas(); //carrega as notas salvas no localStorage e guarda na variavel "notas"
    let nota = notas.find((n) => n.id === id); //procura no array de notas a nota que tem o id igual ao id recebido pelo parametro, e guarda essa nota na variavel "nota", exemplo se o usuario clicou na nota que tem o id = 2 ele vai procurar no array de notas a nota que tem o id = 2 e guarda essa nota na variavel "nota"

    titulo.value = nota.titulo; //preenche o campo titulo do modal com o titulo da nota que queremos editar
    conteudo.value = nota.conteudo; //preenche o campo conteudo do modal com o conteudo da nota que queremos editar

    Categoria.value = nota.categoria || "Pessoal"; //preenche o campo categoria do modal com a categoria da nota que queremos editar, se a nota não tiver uma categoria definida, ele preenche com "Pessoal" como valor padrão

    notaEditandoId = id; //guarda o id da nota que estamos editando na variavel "notaEditandoId" para saber qual nota esta sendo editada

    aparecerModal.show(); //abre o modal para editar a nota

}

function renderizarNotas(listaParaExibir = carregarNotas()) { // todas as minhas notas vao ser gurdadas no meu parametro "listaParaExibir"
    let contador = document.getElementById('contador-notas')
    let lista = document.getElementById('lista-notas')
    let notas = carregarNotas();

    if (contador) {
        contador.textContent = listaParaExibir.length; //contador de notas, o length conta quantas notas tem no meu array, o textContent apaga oq e o padrao e reescreve o novo, no caso escreve quantas notas foram encontradas
    }

    if (listaParaExibir.length === 0) {
        contador.style.color = '#FF0000';

    } else {
        contador.style.color = '#FF0000';
        contador.style.color = '#6f42c1';
    }//style.color ele usado para colcoar um codigo de cor direto no javaScript.

    lista.innerHTML = ''; //limpa todos os card da tela anes de renderizar os novos para evita duplicacao toda vez q a funcao for chamada.

    listaParaExibir.sort((a, b) => { // o sort  pega o itens do array de dois em dois chamando-os de A e B e faz a conta de subtracao para decidir quem tem mais peso e deve ficar na frente(la em cima), se a nota esta fixada ela ganha o peso 1 se nao estiver fixada ganha o peso 0, depois pega e faz B-A 
        let aFixada = a.fixada ? 1 : 0;
        let bFixada = b.fixada ? 1 : 0; //pergunta se  a nota esta fixada, se estiver passa a receber o valor 1 se nao recebe 0

        if(bFixada !== aFixada){
            return bFixada - aFixada; // aqui e a conta de subtracao,se a nota B estiver fixada e a nota A nao estiver fixada, o resultado sera 1-0 = 1, ous seja a nota b tem mais peso e deve ficar na frente, se a nota A estiver fixada e a nota B nao estiver fixada, o resultado sera 0-1 = -1, ou seja a nota A tem mais peso e deve ficar na frente, se as duas notas estiverem fixadas ou as duas nao estiverem fixadas o resultado sera 0-0 = 0 ou 1-1 = 0, ou seja as notas tem o mesmo peso e a ordem entre elas nao importa.
        }

        let criterio = selectOrdenacao ? selectOrdenacao.value : 'recentes'; //o elemetno selectOrdenacao tem na tela? se sim, pegue o valor dele por exemplo o 'alfabetica', se ele nao existir usar o 'recentes como padrao, apos isso a cariavel criterio guarda a palavra exata do que o usuario quer fazer'

        if(criterio === 'alfabetica'){
            return a.titulo.localeCompare(b.titulo);// o localeCompare compara os titulos das notas e decide a ordem alfabetica, se o titulo de A vier antes do titulo de B na ordem alfabetica ele retorna um numero negativo, se o titulo de A vier depois do titulo de B na ordem alfabetica ele retorna um numero positivo, se os titulos forem iguais ele retorna 0

        }else if(criterio === 'antigas'){
            return a.id - b.id; // esta comparando as datas quie os ids foram criados para saber qual fica na frente ou atras, se  por exempolo de a tem a id 1000 e a b tiver o id 2000, vai fazer 1000-2000 = -1000, ou seja a nota A deve ficar na frente
        }else{
            return b.id - a.id; // esta comparando as datas que os ids foram criados para saber qual fica na frente ou atras, se  por exemplo A tem a id 1000 e a B tiver o id 2000, vai fazer 2000-1000 = 1000, ou seja a nota B deve ficar na frente
        }

    })

    listaParaExibir.forEach((nota) => { //percorre o meu parametro "listaParaExibir" e exibe meus objetos q se denominam como nota"
        let textoEdicao = "";
        let corHex = "#6c757d"; // cor casso de erro
        let catNome = nota.categoria || "Pessoal"; // se a nota tiver uma categoria definida, ele usa essa categoria, se não tiver ele usa "Pessoal" como valor padrão

        if (catNome === 'Pessoal') {
            corHex = '#198754';
        } else if (catNome === 'Trabalho') {
            corHex = '#0d6efd';
        } else if (catNome === 'Estudos') {
            corHex = '#6f42c1';
        }

        let exibicaoData = "";
        if (nota.dataEdicao) {
            exibicaoData = `<p>Editado em: ${nota.dataEdicao}</p>`
        } else {
            exibicaoData = `<p>criado em: ${nota.data || 'Data não disponível'}</p>`;
        }

        let iconeFixar = nota.fixada ? "DESFIXAR" : "FIXAR";
        let estiloBotaoFixar = nota.fixada ? "opacity: 1; filter: drop-shadow(0px 0px 3px rgba(0,0,0,0.3));" : "opacity: 0.3;"; //se a nota estiver fixada o botao fica com opacidade 1 e uma sombra para destacar, se nao estiver fixada o botao fica com opacidade 0.3 para parecer desativado

        let card = `<div class="col-md-4">
                <div class="card shadow-sm ${nota.fixada ? 'border-warning border-2' : 'border-roxo'}">
                    <div class="card-body">
                        
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge" style="background-color: ${corHex}; color: white;">${catNome}</span>
                            
                            <button class="btn btn-sm p-0 border-0" style="${estiloBotaoFixar} font-size: 1.2rem;" onclick="alterarFixarNota('${nota.id}')" title="${nota.fixada ? 'Desfixar nota' : 'Fixar nota no topo'}">
                                ${iconeFixar}
                            </button>
                        </div>

                        <h5 style="color: #6f42c1 !important; " class="card-title text-primary">${nota.titulo}</h5> 
                        
                        ${exibicaoData}
                        <p class="card-text mt-2">${nota.conteudo}</p>
                        <button class="btn btn-sm btn-outline-danger btn-vermelho" onclick="ModalExcluir('${nota.id}')">Excluir</button>
                        <button class="btn btn-sm btn-outline-danger btn-roxo" onclick="editarNota('${nota.id}')">Editar</button>
                    </div>
                </div>
            </div>`;
        lista.innerHTML += card; //adiciona mais um igual ao que ja existe na lista, sem apagar o outro que ja estava la
    });

    if (listaParaExibir.length === 0) { // conta quantos itens tem dentro do array se for 0 mostra a mensagem que esta abaixo
        lista.innerHTML = '   <p class="text-center text-muted mt-5">Nenhuma nota encontrada...</p>';
    }
}

function aplicarFiltros(){
    let notasAtuais = carregarNotas();
    let termo = inputBusca.value.toLowerCase();

    let notasFiltradas = notasAtuais.filter(nota =>{
        let catNota = nota.categoria || 'pessoal'; //pega a categoria da nota, se a nota nao tiver uma categoria definida, ele usa "Pessoal" como valor padrão, isso evita que as notas sem categoria sejam excluidas do filtro quando o usuario selecionar uma categoria especifica.

        let bateCategoria = categoriaAtiva === 'Todos' || (catNota === categoriaAtiva); // se a categoriaAtiva for "Todos", bateCategoria recebe true para todas as notas, ou seja todas as notas passam no filtro de categoria, se a categoriaAtiva for diferente de "Todos", bateCategoria recebe true apenas para as notas que tem a categoria igual a categoriaAtiva, ou seja apenas as notas da categoria selecionada passam no filtro de categoria.

        let bateTexto = nota.titulo.toLowerCase().includes(termo) || nota.conteudo.toLowerCase().includes(termo); // o testo que o usuario digitou na barra de pesquisa existe dentro do titulo ou do conteudo

        return bateCategoria && bateTexto; //para a nota ser exibida na tela se a categoria dela for correta e o texto dela bater com a busca, as duas condicoes precisam ser verdadeiras se nao ira dar erro.
    });

    renderizarNotas(notasFiltradas);
}

function alterarFixarNota(id) { //funcao que altera o estado da nota para fixada ou não fixada, recebe o id da nota que queremos alterar como parametro
    let notas = carregarNotas();

    notas = notas.map((nota) => {
        if (nota.id === id) {
            return { ...nota, fixada: !nota.fixada }; // pega tudo que esta na nota antiga e espalha aqui dentro e faz uma copia identica
            // tem o valor iniciado como false, pq a nota nao esta fixada, ai quando o usuario clicar no botao de fixar ele vai pegar esse valor false e transformar em true, ou seja vai fixar a nota, e se o usuario clicar novamente ele vai pegar o valor true e transformar em false, ou seja vai desfixar a nota.
        }
        return nota; // se o id da nota for diferente do id que queremos alterar, ele retorna a nota sem alterações
    });

    salvarNotas(notas);
    renderizarNotas();
}

btnSair.addEventListener('click', () => {
    localStorage.removeItem('logado');
    nomeLogado.textContent = '';
    btnSair.style.display = 'none';
    window.location.href = 'login.html';

}); // botao de logout, remove meu objeto "usuario", e o textContent atualizar meu span pra nao mostrar nada de texto, o display.style serve para esconder o botao para ele sumir da tela quando o usuario clicar no botao de logout, e assim q o logout for realizado o usuario sera jogado para a pagina de login


inputBusca.addEventListener('input', aplicarFiltros);



btnSalvar.addEventListener('click', validar);

btnModal.addEventListener('click', () => { //quando o btnModal for clicado sera aberto o meu modal usando a variavel aparecerModal que guarda a minha modal.
    aparecerModal.show();
})

selectOrdenacao.addEventListener('change',()=>{
    renderizarNotas();
})

document.getElementById('btnConfirmarExclusao').addEventListener('click', () => {
    if (idParaExcluir !== null) {
        let notas = carregarNotas(); //carrega as notas salvas no localStorage e guarda na variavel "notas"
        notas = notas.filter(n => n.id.toString() !== idParaExcluir.toString());
        salvarNotas(notas); //salva o array atualizado no localStorage
        renderizarNotas(); //renderiza as notas atualizadas na tela, ou seja sem a nota que foi excluida.

        let modalElement = document.getElementById('modalConfirmacao');
        let modalInstancia = bootstrap.Modal.getInstance(modalElement);
        modalInstancia.hide(); //fecha o modal de confirmação depois de excluir a nota  

        idParaExcluir = null; //limpa a variavel
    }
});



document.getElementById('filtroTodos').addEventListener('click', () => {
    categoriaAtiva = 'Todos';
    aplicarFiltros();
});

document.getElementById('filtroPessoal').addEventListener('click', () => {

    categoriaAtiva = 'Pessoal';
    aplicarFiltros();
})




document.getElementById('filtroTrabalho').addEventListener('click', (e) => {

    categoriaAtiva = 'Trabalho';
    aplicarFiltros();
});



document.getElementById('filtroEstudos').addEventListener('click', (e) => {
    categoriaAtiva = 'Estudos'; // atualiza a categoriaAtiva para "Estudos" quando o botão de filtro de estudos for clicado, isso indica que queremos filtrar as notas para mostrar apenas as notas da categoria "Estudos"
    aplicarFiltros(); //chama a função aplicarFiltros para atualizar a lista de notas exibida na tela de acordo com a categoriaAtiva atualizada, ou seja para mostrar apenas as notas da categoria "Estudos"
});

inputTitulo.addEventListener('input', () => {
    contadorTitulo.textContent = titulo.value.length + " caracteres"; // o evento input é disparado toda vez que o usuario digita algo no campo titulo, ele pega o valor COM O "length" do campo titulo e conta quantos caracteres tem e atualiza o contador de caracteres com o "textContent"
});

inputConteudo.addEventListener('input', () => {
    contadorConteudo.textContent = conteudo.value.length + " caracteres"; //atualiza o contador de caracteres do campo conteudo a cada vez que o usuario digitar algo no campo conteudo, ele pega o valor do campo conteudo e conta quantos caracteres tem e atualiza o contador de caracteresS
});






renderizarNotas(); //chama a função renderizarNotas para exibir as notas salvas no localStorage quando a página for carregada.