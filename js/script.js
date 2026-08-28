document.addEventListener('DOMContentLoaded',() =>{
	const celulas = document.querySelectorAll('.celula');
	const jogadorAtualSpan = document.querySelector('#jogador-atual span');
	const botaoReiniciar = document.querySelector('#reiniciar');
	const botaoZerarPlacar = document.querySelector('#zerar');
	const placarJogadorX = document.querySelector('#pontuacao-jogadorX');
	const placarJogadorO = document.querySelector('#pontuacao-jogadorO');
	const modal = document.querySelector('#modal');
	const tituloModal = document.querySelector('#titulo-modal');
	const mensagemModal = document.querySelector('#mensagem-modal');
	const botaoFecharModal = document.querySelector('#fechar-modal');

	let tabuleiro = ['','','','','','','','','']
	let jogadorAtual = "X";
	let jogoAtivo = true;
	let placares={
		X:0,
		O:0
	}
	const combinacoesVitoria = [
		[0,1,2],[3,4,5],[6,7,8],
		[0,3,6],[1,4,7],[2,5,8],
		[0,4,8],[2,4,6]
	];

	function iniciarJogo(){
		tabuleiro = ['','','','','','','','','']
		jogoAtivo = true;
		jogadorAtual = "X";

		jogadorAtualSpan.textContent = jogadorAtual;

		celulas.forEach(celula =>{
			celula.classList.remove('x','o');
			celula.textContent = '';
		});
	}

	function atualizarPlacar(){
		placarJogadorX.textContent = placares.X;
		placarJogadorO.textContent = placares.O;
	}

	function verificarVencedor(){
		let venceu = false;
		for(let i=0; i< combinacoesVitoria.length; i++){
			const [a,b,c] = combinacoesVitoria[i];

			if(tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]){
				venceu = true;
				break;
			}
		}
			if (venceu){
				placares[jogadorAtual]++;
				atualizarPlacar();
				exibirModal(`Jogador ${jogadorAtual} venceu!`, `Parabéns, jogador ${jogadorAtual}! Você venceu a partida.`);
				jogoAtivo = false;
				return true;
			}

		if(!tabuleiro.includes('')){
			exibirModal('Empate!', 'Ninguém venceu desta vez. Que tal uma revanche?');
			jogoAtivo = false;
			return true;
		}
		return false;

	}

	function trocarJogador(){
		jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
		jogadorAtualSpan.textContent = jogadorAtual;
	}

	function lidarComCliqueNaCelula(e){
		const celula = e.target;
		const indice = Number(celula.getAttribute('data-index'));
		if(tabuleiro[indice] !=='' || !jogoAtivo){
			return;
		}
		tabuleiro[indice] = jogadorAtual;
		celula.classList.add(jogadorAtual.toLowerCase());
		if(!verificarVencedor()){
			trocarJogador();
		}
	}

	function exibirModal(titulo, mensagem){
		tituloModal.textContent = titulo;
		mensagemModal.textContent = mensagem;
		modal.style.display = 'flex';
	}

	function fecharModal(){
		modal.style.display = 'none';
		if(!JogoAtivo){
			iniciarJogo();
		}
	}
	celulas.forEach(celula =>{
		celula.addEventListener('click', lidarComCliqueNaCelula)
	});

	botaoReiniciar.addEventListener('click', iniciarJogo);
	botaoZerarPlacar.addEventListener('click', ()=>{
		placares.X = 0;
		placares.O = 0;
		atualizarPlacar();
		exibirModal('Placar zerado', 'O placar foi reiniciado com sucesso!');
		iniciarJogo();
	});
	botaoFecharModal.addEventListener('click', fecharModal);
	window.addEventListener('click', (e)=>{
		if(e.target === modal){
			fecharModal();
		}
	})
	iniciarJogo();
	atualizarPlacar();

})