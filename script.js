axios.defaults.headers.common['Authorization'] = 'wSgfOHeNcKLb7lwqytq82yQV';
let nome;
let objnome;
function entrar(){
    const nomeinicio = document.querySelector('.inicio input');
    nome = nomeinicio.value
    objnome = {
        name: nome
    }
    const promessapost = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants",objnome);
    promessapost.then(certo);
    promessapost.catch(erro);
} 
function certo(rep){
    const sair = document.querySelector('.inicio');
    sair.classList.add('sai');
    setInterval(certificacao,5000);
    online();
    setInterval(online,10000);
    const promensagem = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
    promensagem.then(mensagens);
    promensagem.catch(erroget);
    setInterval(atualizacao,3000);
}

function online(){
    const promessaget= axios.get("https://mock-api.driven.com.br/api/vm/uol/participants");
    promessaget.then(certoget);
    promessaget.catch(erroget);
}

function certificacao(){
    let teste = axios.post("https://mock-api.driven.com.br/api/vm/uol/status",objnome);
    teste.then(bom);
    teste.catch(ruim);
}
function bom(){
    console.log('conectado')
}
function ruim(){
    console.log('desconectou')
}
function erro(rep){
    const nomeinicio = document.querySelector('.inicio input');
    nomeinicio.value = '';
    nomeinicio.setAttribute('placeholder','Nome em uso, tente outro!');
}
let mensagem;
function enviarMensagem(){
    mensagem = document.querySelector("input");
    let objenvio = {
        from: nome,
	    to: destino,
	    text: mensagem.value,
	    type: forma // ou "private_message" para o bônus
    }
    const promessaenvio = axios.post("https://mock-api.driven.com.br/api/vm/uol/messages",objenvio)
    promessaenvio.then(enviada);
    promessaenvio.catch(naoenviada);
    console.log(objenvio);
}
function enviada(){
    mensagem.value = '';
    const promensagem = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
    promensagem.then(mensagens);
    promensagem.catch(erroget); 
    const ultimo = batepapo.querySelectorAll('.textmensage');
    ultimo[ultimo.length-1].scrollIntoView();
}
function naoenviada(){
    window.location.reload();
}


function certoget(rep){
    console.log('participantes online');
    const conect = document.querySelector('.participantesAtivos');
    conect.innerHTML = '';
    for (let i=0;i<rep.data.length;i++){
        if (destino==rep.data[i].name){ 
            conect.innerHTML += `<div class="perfil" onclick="forWho(this)" data-test="participant"><ion-icon name="person-circle"></ion-icon>${rep.data[i].name} <ion-icon name="checkmark-sharp" class="certo" data-test="check"></ion-icon></div>`;
        } else{
            conect.innerHTML += `<div class="perfil" onclick="forWho(this)" data-test="participant"><ion-icon name="person-circle"></ion-icon>${rep.data[i].name} <ion-icon name="checkmark-sharp" class="certo sai" data-test="check"></ion-icon></div>`;
        }
    }
}
function erroget(rep){
    alert('não pegou as informacoes')
}



function atualizacao(){
    const promensagem = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
    promensagem.then(mensagens);
    promensagem.catch(erroget);
}

function mensagens(mens){
    console.log(mens);
    renderizarMensagem(mens);
}
let batepapo = document.querySelector('.mensagens');
function renderizarMensagem(textos){
    batepapo.innerHTML = '';
    for (let i=0;i<textos.data.length;i++){
        if (textos.data[i].type === "status"){
            batepapo.innerHTML += 
                 `<p class="textmensage status" data-test="message"><span class="hora">(${textos.data[i].time})</span> <span><strong>${textos.data[i].from}</strong>  ${textos.data[i].text}</span></p>`
        } else if (textos.data[i].type == "message"){
            batepapo.innerHTML += 
                `<p class="textmensage messagem" data-test="message"><span class="hora">(${textos.data[i].time})</span> 
                <span><strong>${textos.data[i].from}</strong> para <strong>${textos.data[i].to}:</strong>  ${textos.data[i].text}</span></p>`
        } else if ((textos.data[i].to==nome) || (textos.data[i].from==nome)){
            batepapo.innerHTML += 
            `<p class="textmensage privado" data-test="message"><span class="hora">(${textos.data[i].time})</span> 
            <span><strong>${textos.data[i].from}</strong> reservadamente para <strong>${textos.data[i].to}:</strong>  ${textos.data[i].text}</span></p>`
        }
    }
}

function partAtiv(){
    const side = document.querySelector('.sidebar');
    const black = document.querySelector('.preto');
    side.classList.toggle('transicao');
    black.classList.toggle('transicao');
}

let destino = 'Todos'
let forma = 'message'
function forWho(escolhido){
    const nova = document.querySelector('.for');
    console.log(escolhido);
    const check = escolhido.querySelector('.certo');
    if (escolhido.classList.contains('perfil')==true){
        destino = escolhido.innerText;
        const todos = document.querySelectorAll('.perfil');
        for (let i=0;i<todos.length;i++){
            todos[i].querySelector('.certo').classList.add('sai');
        }
    }
    if (escolhido.classList.contains('tipo')==true){
        if (escolhido.innerText == 'Público'){
            forma = 'message';
        } else{
            forma = 'private_message';
        }
        const todos = document.querySelectorAll('.tipo');
        for (let i=0;i<todos.length;i++){
            todos[i].querySelector('.certo').classList.add('sai');
        }
    }
    check.classList.remove('sai');
    if (forma == 'message'){
        nova.innerHTML = `Enviando para ${destino} (publicamente)`;
    }else{
        nova.innerHTML = `Enviando para ${destino} (reservadamente)`;
    }
}
document.addEventListener("keypress", function(ativar){
    if (ativar.key=="Enter"){
        const teste = document.querySelector('.envio');
        const condicao = document.querySelector('.inicio');
        if (condicao.classList.contains('sai')==true){
            teste.click();
        }
    }
});
document.addEventListener("keypress", function(ativar){
    if (ativar.key=="Enter"){
        const teste = document.querySelector('.teste');
        const condicao = document.querySelector('.inicio');
        if (condicao.classList.contains('sai')==false){
            teste.click();
        }
    }
});
