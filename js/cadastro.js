let nomeUsuario = document.getElementById('nome');
let emailUsuario = document.getElementById('email');
let senhaUsuario = document.getElementById('senha');

let erroNomeUsuario = document.getElementById('erroNome');
let erroEmailUsuario = document.getElementById('erroEmail');
let erroSenhaUsuario = document.getElementById('erroSenha');

let btnCadastrar = document.getElementById('btn-cadastrar');
let btnEntrar = document.getElementById('btn-entrar');

function validarCadastro() {
    erroNomeUsuario.textContent = "";
    erroEmailUsuario.textContent = "";
    erroSenhaUsuario.textContent = "";

    if (nomeUsuario.value == "") {
        erroNomeUsuario.textContent = "O campo nome é obrigatório.";
        return; //se o campo nome estiver vazio, ele retorna e nao executa o restante do codigo, assim nao salva o usuario no localStorage e nao redireciona para a pagina de login
    }
    if (emailUsuario.value == "") {
        erroEmailUsuario.textContent = "O campo email é obrigatório.";
        return;
    }
    if (senhaUsuario.value == "") {
        erroSenhaUsuario.textContent = "O campo senha é obrigatório.";
        return;
    }

    let usuario = {
        nome: nomeUsuario.value,
        email: emailUsuario.value,
        senha: senhaUsuario.value
    }

    localStorage.setItem('usuario', JSON.stringify(usuario)); //salva o objeto usuario no localStorage como uma string JSON
    localStorage.setItem('logado', 'true'); //se estiver logado a chave logado existe no localStorage, quando clica em sair destroi tudo, oq signifia q nn esta logado tudo

    let usuarioIgual = JSON.parse(localStorage.getItem('usuario'))
    
    if(usuarioIgual || usuarioIgual.email == emailUsuario.value || usuarioIgual.senha == senhaUsuario.value ){
        erroEmailUsuario.textContent = 'essa conta ja existe';
        return
    }

    window.location.href = 'index.html'; //redireciona para a pagina inicial apos o cadastro
};

function validarLogin() {
    erroEmailUsuario.textContent = "";
    erroSenhaUsuario.textContent = "";

    if (emailUsuario.value == "") {
        erroEmailUsuario.textContent = "O campo email é obrigatório.";
    }
    if (senhaUsuario.value == "") {
        erroSenhaUsuario.textContent = "O campo senha é obrigatório.";
    }
    localStorage.setItem('logado', 'true');
    window.location.href = 'index.html';
}

if (btnCadastrar) {
    btnCadastrar.addEventListener('click', validarCadastro);
}
if (btnEntrar) {
    btnEntrar.addEventListener('click', validarLogin);
}

// se btn cadastro existir, adicionar evento de click para validar cadastro, se nao ele da null e trava, a mesma coisa para btn entrar, se existir ele adiciona o evento de click para validar login, se nao ele da null e trava.