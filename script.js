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
            conect.innerHTML += `<div class="perfil" onclick="forWho(this)"><ion-icon name="person-circle"></ion-icon>${rep.data[i].name} <ion-icon name="checkmark-sharp" class="certo"></ion-icon></div>`
        } else{
            conect.innerHTML += `<div class="perfil" onclick="forWho(this)"><ion-icon name="person-circle"></ion-icon>${rep.data[i].name} <ion-icon name="checkmark-sharp" class="certo sai"></ion-icon></div>`
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

function renderizarMensagem(textos){
    const batepapo = document.querySelector('.mensagens');
    batepapo.innerHTML = '';
    for (let i=0;i<textos.data.length;i++){
        if (textos.data[i].type === "status"){
            batepapo.innerHTML += 
                 `<div class="textmensage status"><div class="hora">(${textos.data[i].time})</div> <p><strong>${textos.data[i].from}</strong>  ${textos.data[i].text}</p></div>`
        } else if (textos.data[i].type == "message"){
            batepapo.innerHTML += 
                `<div class="textmensage messagem"><div class="hora">(${textos.data[i].time})</div> 
                <p><strong>${textos.data[i].from}</strong> para <strong>${textos.data[i].to}:</strong>  ${textos.data[i].text}</p></div>`
        } else if ((textos.data[i].from==nome && textos.data[i].to==destino) || (textos.data[i].to==nome)){
            batepapo.innerHTML += 
            `<div class="textmensage privado"><div class="hora">(${textos.data[i].time})</div> 
            <p><strong>${textos.data[i].from}</strong> reservadamente para <strong>${textos.data[i].to}:</strong>  ${textos.data[i].text}</p></div>`
        }
    }
}

function partAtiv(){
    const side = document.querySelector('.sidebar');
    const black = document.querySelector('.preto');
    side.classList.toggle('sai');
    black.classList.toggle('sai');
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