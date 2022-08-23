const { ipcRenderer } = require('electron');
const timer = require('./timer');
const data = require('../../data')


let linkSobre = document.querySelector('#link-sobre');
let botaoPlay = document.querySelector('.botao-play');
let tempo = document.querySelector('.tempo');
let curso = document.querySelector('.curso');

window.onload = () => {

    data.pegaDados(curso.textContent)
        .then((dados) => {
            tempo.textContent = dados.tempo;
        })
}

linkSobre.addEventListener('click' , function(){
    ipcRenderer.send('abrir-janela-sobre');
});

let imgs = ['img/play-button.svg', 'img/stop-button.svg'];
let play = false;
botaoPlay.addEventListener('click' ,function () {
    if(play){
        timer.parar(curso.textContent);
        play = false;
    }else{
        timer.iniciar(tempo);
        play = true;
    }
    imgs = imgs.reverse();
    botaoPlay.src = imgs[0];
});

ipcRenderer.on('curso-trocado', (event, nomeCurso) =>{
     data.pegaDados(nomeCurso)
        .then((dados)=>{
            tempo.textContent = dados.tempo;
        })
    curso.textContent = nomeCurso;
});

let botaoAdicionar = document.querySelector('.botao-adicionar');
let campoAdicionar = document.querySelector('.campo-adicionar');

botaoAdicionar.addEventListener('click', function() {
    let novoCurso = campoAdicionar.value;
    curso.textContent = novoCurso;
    tempo.textContent = '00:00:00';
    campoAdicionar.textContent = '';
    ipcRenderer.send('curso-adicionado', novoCurso);
});

ipcRenderer.on('atalho-iniciar-parar', () => {
    console.log('Atalho no renderer process');
    let click = new MouseEvent('click');
    botaoPlay.dispatchEvent(click);
});




module.exports = {
    templateInical : null,
    geraTrayTemplate(win){
        let template = [
            {
                'label': 'Cursos'
            },
            {
                type: 'separator'
            }
        ];
    },
    adicionaCursoNoTray(curso,win){
        this.templateInical.push({
            label: curso,
            type: 'radio',
            checked: true,
            click: () => {
                win.send('curso-trocado', curso);
            }
        })

        return this.templateInical;
    }
}
