document.addEventListener('DOMContentLoaded',() =>{
	const celulas = document.querySelectorAll('.celula');
	const jogadorAtualSpan = document.querySelector('#jogador-atual span');
	const botaoReiniciar = document.querySelector('#reiniciar');
	const botaoZerarPlacar = document.querySelector('#zerar');
	const placarJogadorX = document.querySelector('#pontuacao-jogadorX');
	const placarJogadorO = document.querySelector('#pontuacao-jogadorO');
	const modal = document.querySelector('#modal');
	const menu = document.querySelector('#menu');
	const tituloModal = document.querySelector('#titulo-modal');
	const mensagemModal = document.querySelector('#mensagem-modal');
	const botaoFecharModal = document.querySelector('#fechar-modal');
	const botaoMenuJogador = document.querySelector('#humano-menu');
	const botaoMenuIa = document.querySelector("#ia-menu");

	let tabuleiro = ['','','','','','','','','']
	let jogadorAtual = "X";
	let jogoAtivo = true;
	// Define se o jogo será contra a IA 
	let modoIA = false;
	let placares={
		X:0,
		O:0
	}
	const combinacoesVitoria = [
		[0,1,2],[3,4,5],[6,7,8],
		[0,3,6],[1,4,7],[2,5,8],
		[0,4,8],[2,4,6]
	];
	exibirMenu();
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
	function verificarResultado(tabuleiroTeste) {
	for (let i = 0; i < combinacoesVitoria.length; i++) {
		const [a, b, c] = combinacoesVitoria[i];

		if (
			tabuleiroTeste[a] &&
			tabuleiroTeste[a] === tabuleiroTeste[b] &&
			tabuleiroTeste[a] === tabuleiroTeste[c]
		) {
			return tabuleiroTeste[a];
		}
	}

	if (!tabuleiroTeste.includes('')) {
		return 'empate';
	}

	return null;
}

function minimax(tabuleiroTeste, profundidade, maximizando) {
	const resultado = verificarResultado(tabuleiroTeste);
	// Se a IA venceu
	if (resultado === 'O') {
		return 10 - profundidade;
	}
	// Se o jogador venceu
	if (resultado === 'X') {
		return profundidade - 10;
	}
	// Empate
	if (resultado === 'empate') {
		return 0;
	}
	// Maximiza a pontuação da IA
	if (maximizando) {
		let melhorPontuacao = -Infinity;
		for (let i = 0; i < tabuleiroTeste.length; i++) {
			if (tabuleiroTeste[i] === '') {
				tabuleiroTeste[i] = 'O';
				const pontuacao = minimax(
					tabuleiroTeste,
					profundidade + 1,
					false
				);
				tabuleiroTeste[i] = '';
				melhorPontuacao = Math.max(
					melhorPontuacao,
					pontuacao
				);
			}
		}
		return melhorPontuacao;
	}
	// Minimiza a pontuação do jogador
	else {
		let melhorPontuacao = Infinity;

		for (let i = 0; i < tabuleiroTeste.length; i++) {
			if (tabuleiroTeste[i] === '') {

				tabuleiroTeste[i] = 'X';

				const pontuacao = minimax(
					tabuleiroTeste,
					profundidade + 1,
					true
				);

				tabuleiroTeste[i] = '';

				melhorPontuacao = Math.min(
					melhorPontuacao,
					pontuacao
				);
			}
		}

		return melhorPontuacao;
	}
	}

	function jogadaIA() {
	if (!jogoAtivo) {
		return;
	}
	let melhorPontuacao = -Infinity;
	let melhorJogada = -1;
	for (let i = 0; i < tabuleiro.length; i++) {
		if (tabuleiro[i] === '') {
			// Simula a jogada da IA
			tabuleiro[i] = 'O';
			const pontuacao = minimax(
				tabuleiro,
				0,
				false
			);
			// Desfaz a jogada
			tabuleiro[i] = '';
			if (pontuacao > melhorPontuacao) {
				melhorPontuacao = pontuacao;
				melhorJogada = i;
			}
		}
	}
	// Faz a melhor jogada encontrada
	if (melhorJogada !== -1) {
		tabuleiro[melhorJogada] = 'O';
		const celulaIA = document.querySelector(
			`.celula[data-index="${melhorJogada}"]`
		);
		celulaIA.classList.add('o');
		if (!verificarVencedor()) {
			trocarJogador();
		}
	}
	}

	function lidarComCliqueNaCelula(e){
		const celula = e.target;
		const indice = Number(celula.getAttribute('data-index'));
		if(tabuleiro[indice] !=='' || !jogoAtivo || (modoIA && jogadorAtual === 'O')){
			return;
		}
		tabuleiro[indice] = jogadorAtual;
		celula.classList.add(jogadorAtual.toLowerCase());
		if(!verificarVencedor()){
			trocarJogador();
			if(modoIA && jogadorAtual === 'O'){
				setTimeout(() => {
					jogadaIA();
				}, 300);
			}
		}
	}
	function exibirMenu(){
		menu.style.display = 'flex';
	}

	function exibirModal(titulo, mensagem){
		tituloModal.textContent = titulo;
		mensagemModal.textContent = mensagem;
		modal.style.display = 'flex';
	}

	function fecharModal(){
		modal.style.display = 'none';
		if(!jogoAtivo){
			iniciarJogo();
		}
	}
	celulas.forEach(celula =>{
		celula.addEventListener('click', lidarComCliqueNaCelula)
	});
	botaoMenuJogador.addEventListener('click', ()=>{
		console.log("Opção 2 jogadores selecionada");
		modoIA = false;
		menu.style.display = 'none';
		iniciarJogo();
	})
	botaoMenuIa.addEventListener('click',()=>{
		console.log("Opção 1 jogador selecionada");
		modoIA = true;
		menu.style.display = 'none';
		iniciarJogo();
	})
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
	atualizarPlacar();

})