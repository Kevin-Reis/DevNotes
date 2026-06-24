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

    if(nomeUsuario.value == "") {
        erroNomeUsuario.textContent = "O campo nome é obrigatório.";
    }
    if(emailUsuario.value == "") {
        erroEmailUsuario.textContent = "O campo email é obrigatório.";
    }
    if(senhaUsuario.value == "") {
        erroSenhaUsuario.textContent = "O campo senha é obrigatório.";
    }
};

function validarLogin() {
    erroEmailUsuario.textContent = "";
    erroSenhaUsuario.textContent = "";

    if(emailUsuario.value == "") {
        erroEmailUsuario.textContent = "O campo email é obrigatório.";
    }
    if(senhaUsuario.value == "") {
        erroSenhaUsuario.textContent = "O campo senha é obrigatório.";
    }
}

if(btnCadastrar) {
    btnCadastrar.addEventListener('click', validarCadastro);
}
if(btnEntrar) {
    btnEntrar.addEventListener('click', validarLogin);
}

// se btn cadastro existir, adicionar evento de click para validar cadastro, se nao ele da null e trava, a mesma coisa para btn entrar, se existir ele adiciona o evento de click para validar login, se nao ele da null e trava.