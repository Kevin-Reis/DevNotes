
let aparecerModal = new bootstrap.Modal(document.getElementById('blocoNotas'));

let btnModal = document.getElementById('btn-abrir');

btnModal.addEventListener('click',()=>{
    console.log('clicou');
    aparecerModal.show();
})

// aparecerModal.show();