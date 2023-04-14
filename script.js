axios.defaults.headers.common['Authorization'] = 'wSgfOHeNcKLb7lwqytq82yQV';
let nome;
let objnome;
function entrar(){
    const nomeinicio = document.querySelector('.inicio input');
    nome = nomeinicio.value
    objnome = {
        name: nome
    }
    const sair = document.querySelector('.inicio');
    sair.classList.add('sai');
    const promessapost = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants",objnome);
    promessapost.then(certo);
    promessapost.catch(erro);
} 
function certo(rep){
    const promessaget= axios.get("https://mock-api.driven.com.br/api/vm/uol/participants");
    promessaget.then(certoget);
    promessaget.catch(erroget);
    setInterval(certificacao,5000);
    const promensagem = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
    promensagem.then(mensagens);
    promensagem.catch(erroget);
    setInterval(atualizacao,3000);
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
    nome = prompt('Esse nome já está em uso, digite outro nome:');
    objnome = {
        name: nome
    }
    const promessapost = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants",objnome);
    promessapost.then(certo);
    promessapost.catch(erro);
}
function enviarMensagem(){
    const mensagem = document.querySelector("input");
    let objenvio = {
        from: nome,
	    to: 'Todos',
	    text: mensagem.value,
	    type: "message" // ou "private_message" para o bônus
    }
    const promessaenvio = axios.post("https://mock-api.driven.com.br/api/vm/uol/messages",objenvio)
    promessaenvio.then(enviada);
    promessaenvio.catch(naoenviada);
    console.log(objenvio);
}
function enviada(){
    const promensagem = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
    promensagem.then(mensagens);
    promensagem.catch(erroget); 
}
function naoenviada(){
    window.location.reload();
}


function certoget(rep){
    console.log('participantes recebidos');
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
        } else{
            batepapo.innerHTML += 
            `<div class="textmensage privado"><div class="hora">(${textos.data[i].time})</div> 
            <p><strong>${textos.data[i].from}</strong> reservadamente para <strong>${textos.data[i].to}:</strong>  ${textos.data[i].text}</p></div>`
        }
    }
}
