// PintArte - Main JavaScript

// --- ESTADO DO JOGO ---
const gameState = {
    money: 500,
    reputation: 0,
    level: 'Aprendiz',
    contractsCompleted: 0,
};

// --- ESTADO DO CONTRATO ATUAL ---
let currentContract = null;

// --- DADOS DO JOGO ---
const contractsData = [
    { level: 'Aprendiz', name: "Parede Retangular", client: "Sr. Jorge", shape: 'rectangle', reward: 250, penalty: 10 },
    { level: 'Aprendiz', name: "Muro Triangular", client: "Dona Íris", shape: 'triangle', reward: 200, penalty: 15 },
    { level: 'Pintor', name: "Piso em L", client: "Arquiteta Lúcia", shape: 'l-shape', reward: 650, penalty: 25 },
    { level: 'Pintor', name: "Tampo de Mesa Redondo", client: "Marceneiro Davi", shape: 'circle', reward: 700, penalty: 30 },
    { level: 'Mestre', name: "Pintar Contêiner", client: "Logística Global", shape: 'prism', reward: 1700, penalty: 50 },
];

const paints = [
    { id: 5, name: 'Tinta PP', coverage: 10, price: 40 },
    { id: 1, name: 'Tinta P', coverage: 20, price: 70 },
    { id: 2, name: 'Tinta M', coverage: 50, price: 150 },
    { id: 3, name: 'Tinta G', coverage: 100, price: 280 },
    { id: 4, name: 'Tinta GG', coverage: 200, price: 500 }
];

// --- ELEMENTOS DO DOM ---
const moneyDisplay = document.getElementById('money-display');
const reputationDisplay = document.getElementById('reputation-display');
const areaInput = document.getElementById('area-input');

// --- FUNÇÕES DE FEEDBACK E RENDERIZAÇÃO ---
function showFeedbackModal(message, buttonText = "OK", onConfirm = () => {}) {
    const modal = document.getElementById('feedback-modal');
    document.getElementById('feedback-message').innerHTML = message;
    const buttonEl = document.getElementById('feedback-button');
    buttonEl.textContent = buttonText;
    buttonEl.onclick = () => {
        modal.classList.add('hidden');
        onConfirm();
    };
    modal.classList.remove('hidden');
}

function updateStatusDisplay() {
    moneyDisplay.innerHTML = `<i class="fas fa-coins text-yellow-400"></i> ${gameState.money}`;
    reputationDisplay.innerHTML = `<i class="fas fa-star text-yellow-400"></i> ${gameState.reputation}`;
}

function renderStore(isForContract) {
    const storeContainer = document.getElementById('store-items');
    const storeFooter = document.getElementById('store-footer');
    storeContainer.innerHTML = '';
    
    paints.forEach(paint => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'bg-gray-200 p-4 rounded-lg text-center text-black space-y-2 flex flex-col justify-between';
        const buttonAction = isForContract ? `addPaintToCart(${paint.id})` : `buyPaint(${paint.id})`;
        const buttonText = isForContract ? 'Adicionar' : 'Comprar (WIP)';
        itemDiv.innerHTML = `
            <div>
                <p class="font-bold text-lg">${paint.name}</p>
                <p class="text-md">Cobre: ${paint.coverage}m²</p>
            </div>
            <div class="mt-4">
                 <p class="font-bold text-xl"><i class="fas fa-coins text-yellow-600"></i> ${paint.price}</p>
                 <button onclick="${buttonAction}" class="btn btn-green w-full mt-2 py-2 rounded-lg text-md">${buttonText}</button>
            </div>
        `;
        storeContainer.appendChild(itemDiv);
    });

    const backButton = document.createElement('button');
    backButton.className = 'btn w-1/2 md:w-1/4 text-xl py-3 rounded-lg';
    backButton.textContent = isForContract ? 'Voltar ao Contrato' : 'Voltar ao Menu';
    backButton.onclick = () => showScreen(isForContract ? 'contract-screen' : 'home-screen');
    storeFooter.innerHTML = '';
    storeFooter.appendChild(backButton);
}

function renderReputation() {
    const reputationContainer = document.getElementById('reputation-details');
    reputationContainer.innerHTML = `
        <p>Título: <span class="font-bold text-yellow-300">${gameState.level}</span></p>
        <p>Contratos Concluídos: <span class="font-bold">${gameState.contractsCompleted}</span></p>
        <p>Reputação: <span class="font-bold">${gameState.reputation}</span></p>
        <hr class="border-gray-500 my-4">
        <p><i class="fas fa-coins text-yellow-400"></i> Moedas: <span class="font-bold">${gameState.money}</span></p>
    `;
}

// --- FUNÇÕES DE DESENHO NO CANVAS ---
function desenharSetaComTexto(ctx, x1, y1, x2, y2, texto, posicaoTexto) {
    const tamPonta = 8;
    const angulo = Math.atan2(y2 - y1, x2 - x1);

    ctx.save();
    ctx.strokeStyle = '#2c3e50';
    ctx.fillStyle = '#2c3e50';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + tamPonta * Math.cos(angulo + Math.PI / 6), y1 + tamPonta * Math.sin(angulo + Math.PI / 6));
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + tamPonta * Math.cos(angulo - Math.PI / 6), y1 + tamPonta * Math.sin(angulo - Math.PI / 6));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - tamPonta * Math.cos(angulo - Math.PI / 6), y2 - tamPonta * Math.sin(angulo - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - tamPonta * Math.cos(angulo + Math.PI / 6), y2 - tamPonta * Math.sin(angulo + Math.PI / 6));
    ctx.stroke();

    ctx.font = 'bold 10px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let xTexto = (x1 + x2) / 2;
    let yTexto = (y1 + y2) / 2;
    const espaco = 15;

    if (posicaoTexto === 'acima') yTexto -= espaco;
    if (posicaoTexto === 'abaixo') yTexto += espaco;
    if (posicaoTexto === 'esquerda') xTexto -= ctx.measureText(texto).width / 2 + espaco;
    if (posicaoTexto === 'direita') xTexto += ctx.measureText(texto).width / 2 + 5 + espaco;
    
    ctx.fillText(texto, xTexto, yTexto);
    ctx.restore();
}

function renderPrismOnCanvas(d) {
    const container = document.getElementById('shape-container');
    container.innerHTML = '<canvas id="shape-canvas" width="400" height="300"></canvas>';
    const canvas = document.getElementById('shape-canvas');
    const ctx = canvas.getContext('2d');

    const escala = 4;
    const corPreenchimento = '#a0e0f0';
    const corLinha = '#000000';
    const deslocamentoX = 50;
    const deslocamentoY = 50;

    const L_px = d.width * escala;
    const H_px = d.height * escala;
    const P_px = d.depth * escala;

    ctx.strokeStyle = corLinha;
    ctx.fillStyle = corPreenchimento;
    ctx.lineWidth = 2;

    const xRet1 = deslocamentoX+L_px;
    const yRet1 = deslocamentoY;
    ctx.fillRect(xRet1, yRet1, L_px, H_px);
    ctx.strokeRect(xRet1, yRet1, L_px, H_px);

    const xRet2 = xRet1;
    const yRet2 = yRet1 + H_px;
    ctx.fillRect(xRet2, yRet2, L_px, H_px);
    ctx.strokeRect(xRet2, yRet2, L_px, H_px);

    const xRet3 = xRet1;
    const yRet3 = yRet2 + H_px;
    ctx.fillRect(xRet3, yRet3, L_px, H_px);
    ctx.strokeRect(xRet3, yRet3, L_px, H_px);

    const xRet4 = xRet1;
    const yRet4 = yRet3 + H_px;
    ctx.fillRect(xRet4, yRet4, L_px, H_px);
    ctx.strokeRect(xRet4, yRet4, L_px, H_px);

    const xBase1 = xRet2 - P_px;
    const yBase1 = yRet2;
    ctx.fillRect(xBase1, yBase1, P_px, H_px);
    ctx.strokeRect(xBase1, yBase1, P_px, H_px);

    const xBase2 = xRet2 + L_px;
    const yBase2 = yRet2;
    ctx.fillRect(xBase2, yBase2, P_px, H_px);
    ctx.strokeRect(xBase2, yBase2, P_px, H_px);

    // --- 7. Adicionar Rótulos e Setas ---

    // Seta para Largura (16 m)
    desenharSetaComTexto(ctx, xRet1, yRet1-10, xRet1+L_px, yRet1-10, `${d.width} m`, 'acima');
    desenharSetaComTexto(ctx, xBase1-10, yBase1, xBase1-10, yBase1+H_px, `${d.height} m`, 'esquerda');
    desenharSetaComTexto(ctx, xBase1, yBase1+H_px+10, xBase1+P_px, yBase1+H_px+10, `${d.depth} m`, 'abaixo');
}

function renderShape(contract) {
    const container = document.getElementById('shape-container');
    container.innerHTML = '';
    container.style.cssText = 'margin: auto; display: flex; align-items: center; justify-content: center; min-height: 210px; padding: 20px 0;';

    const d = contract.details;
    switch (d.shape) {
        case 'rectangle':
            container.innerHTML = `<div class="bg-blue-500" style="width: ${d.width * 10}px; height: ${d.height * 10}px;"></div>`;
            break;
        case 'triangle':
            container.innerHTML = `<div style="width: 0; height: 0; border-left: ${d.base * 5}px solid transparent; border-right: ${d.base * 5}px solid transparent; border-bottom: ${d.height * 10}px solid #60a5fa;"></div>`;
            break;
        case 'circle':
            container.innerHTML = `<div class="bg-green-400 rounded-full" style="width: ${d.radius * 20}px; height: ${d.radius * 20}px;"></div>`;
            break;
        case 'l-shape':
            container.style.alignItems = 'flex-start';
            container.innerHTML = `
                <div>
                    <div class="bg-purple-500" style="width: ${d.w1 * 10}px; height: ${d.h1 * 10}px;"></div>
                    <div class="bg-purple-500" style="width: ${d.w2 * 10}px; height: ${d.h2 * 10}px;"></div>
                </div>
            `;
            break;
        case 'prism':
            renderPrismOnCanvas(d);
            break;
    }
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');
    cartItemsContainer.innerHTML = '';

    if (!currentContract || currentContract.paints.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-gray-400 text-sm">Nenhuma tinta selecionada.</p>';
        cartSummaryContainer.innerHTML = '';
        return;
    }

    currentContract.paints.forEach(paint => {
        cartItemsContainer.innerHTML += `<p class="text-sm">- ${paint.name} (${paint.coverage}m²)</p>`;
    });

    cartSummaryContainer.innerHTML = `
        <p>Cobertura Total: ${currentContract.totalCoverage}m²</p>
        <p>Custo Total: ${currentContract.totalCost} moedas</p>
    `;
}

// --- LÓGICA DO JOGO ---
function generateRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updatePlayerLevel() {
    if (gameState.contractsCompleted >= 8) gameState.level = 'Mestre';
    else if (gameState.contractsCompleted >= 3) gameState.level = 'Pintor';
    else gameState.level = 'Aprendiz';
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const nextScreen = document.getElementById(screenId);
    if (nextScreen) {
        nextScreen.classList.add('active');
    }
    window.scrollTo(0, 0);

    if (screenId === 'reputation-screen') renderReputation();
    if (screenId === 'contract-screen') renderCart();
}

function showStoreForContract() {
    renderStore(true);
    showScreen('store-screen');
}

function showStoreForShopping() {
    renderStore(false);
    showScreen('store-screen');
}

function startNewContract() {
    updatePlayerLevel();
    const availableContracts = contractsData.filter(c => c.level === gameState.level);
    const contractDetails = { ...availableContracts[Math.floor(Math.random() * availableContracts.length)] };

    // Gerar dimensões aleatórias
    switch (contractDetails.shape) {
        case 'rectangle':
            contractDetails.width = generateRandomValue(5, 15);
            contractDetails.height = generateRandomValue(5, 10);
            break;
        case 'triangle':
            contractDetails.base = generateRandomValue(6, 18);
            contractDetails.height = generateRandomValue(5, 12);
            break;
        case 'circle':
            contractDetails.radius = generateRandomValue(3, 8);
            break;
        case 'l-shape':
            contractDetails.w1 = generateRandomValue(8, 15);
            contractDetails.h1 = generateRandomValue(4, 6);
            contractDetails.w2 = generateRandomValue(4, 6);
            contractDetails.h2 = generateRandomValue(6, 10);
            break;
        case 'prism':
            contractDetails.width = generateRandomValue(12, 18);
            contractDetails.height = generateRandomValue(6, 10);
            contractDetails.depth = generateRandomValue(3, 5);
            break;
    }

    currentContract = {
        details: contractDetails,
        paints: [],
        totalCoverage: 0,
        totalCost: 0
    };
    
    document.getElementById('contract-client').textContent = `CLIENTE: ${currentContract.details.client}`;
    document.getElementById('contract-project').textContent = `PROJETO: ${currentContract.details.name}`;
    document.getElementById('contract-reward').innerHTML = `RECOMPENSA: <i class="fas fa-coins text-yellow-500"></i> ${currentContract.details.reward}`;

    let dimensionsText = '', areaLabelText = 'Calcule a área (m²):';
    const d = currentContract.details;
    switch (d.shape) {
        case 'rectangle': dimensionsText = `Base: ${d.width}m, Altura: ${d.height}m`; break;
        case 'triangle': dimensionsText = `Base: ${d.base}m, Altura: ${d.height}m`; break;
        case 'circle': dimensionsText = `Raio: ${d.radius}m. Use Pi = 3.14 e arredonde.`; break;
        case 'l-shape': dimensionsText = `Forma L: [${d.w1}x${d.h1}] e [${d.w2}x${d.h2}]`; break;
        case 'prism': 
            dimensionsText = ``; // Removido pois agora está na imagem
            areaLabelText = 'Calcule a área de SUPERFÍCIE (m²):';
            break;
    }
    document.getElementById('shape-dimensions').textContent = dimensionsText;
    document.getElementById('area-label').textContent = areaLabelText;

    renderShape(currentContract);
    
    areaInput.value = '';
    document.getElementById('contract-feedback').textContent = '';
    document.getElementById('paint-btn').disabled = true;
    showScreen('contract-screen');
}

function addPaintToCart(paintId) {
    const paint = paints.find(p => p.id === paintId);
    if (gameState.money < paint.price) {
        showFeedbackModal("Dinheiro insuficiente!");
        return;
    }
    gameState.money -= paint.price;
    currentContract.paints.push(paint);
    currentContract.totalCoverage += paint.coverage;
    currentContract.totalCost += paint.price;
    
    document.getElementById('paint-btn').disabled = false;
    updateStatusDisplay();
    showFeedbackModal(`${paint.name} adicionada ao projeto!`);
}

function getCorrectArea() {
    if (!currentContract) return 0;
    const d = currentContract.details;
    switch (d.shape) {
        case 'rectangle': return d.width * d.height;
        case 'triangle': return (d.base * d.height) / 2;
        case 'circle': return Math.round(3.14 * d.radius * d.radius);
        case 'l-shape': return (d.w1 * d.h1) + (d.w2 * d.h2);
        case 'prism':
            // MUDANÇA: Adicionados comentários para explicar a fórmula
            // A fórmula da área de superfície de um prisma retangular é a soma da área de suas 6 faces.
            const bases = 2 * (d.depth * d.height);
            const retangulos = 4 * (d.width * d.height);
            return bases + retangulos;
        default: return 0;
    }
}

function checkAnswer() {
    const correctArea = getCorrectArea();
    const userAnswer = parseFloat(areaInput.value);
    let feedbackMessage;

    if (isNaN(userAnswer)) {
         document.getElementById('contract-feedback').textContent = "Insira um valor numérico.";
         document.getElementById('contract-feedback').style.color = '#facc15';
         return;
    }

    if (userAnswer !== correctArea) {
        // Jogador errou o cálculo! Toca o som de falha
        playFailureSound();
        feedbackMessage = `Cálculo Incorreto! A área era de ${correctArea}m². <br><br>Você perdeu o custo da tinta e -5 de reputação.`;
        gameState.reputation -= 5;
    } else {
        if (currentContract.totalCoverage < correctArea) {
            // Cálculo certo mas tinta insuficiente! Toca o som de falha
            playFailureSound();
            feedbackMessage = `Cálculo correto, mas a tinta não foi suficiente! O cliente ficou insatisfeito. <br><br>Você perdeu o custo da tinta e -10 de reputação.`;
            gameState.reputation -= 10;
        } else {
            // Jogador acertou! Toca o som de sucesso
            playSuccessSound();
            const profit = currentContract.details.reward - currentContract.totalCost;
            feedbackMessage = `Trabalho concluído! <br><br>A recompensa foi de ${currentContract.details.reward}, o custo da tinta foi ${currentContract.totalCost}.<br>Lucro de: ${profit} moedas. <br>+10 de reputação.`;
            gameState.money += currentContract.details.reward;
            gameState.reputation += 10;
            gameState.contractsCompleted++;
        }
    }
    
    currentContract = null; // Finaliza o contrato
    updatePlayerLevel();
    updateStatusDisplay();
    showFeedbackModal(feedbackMessage, "Continuar", () => showScreen('home-screen'));
}

function abandonContract() {
    if(currentContract && currentContract.totalCost > 0) {
        gameState.money += currentContract.totalCost; // Devolve o dinheiro
    }
    currentContract = null;
    updateStatusDisplay();
    showScreen('home-screen');
}

// --- SISTEMA DE ÁUDIO ---
function initBackgroundMusic() {
    const music = document.getElementById('background-music');
    music.volume = 0.3; // Volume mais baixo para não incomodar
    
    // Tenta tocar automaticamente quando a página carrega
    const tryPlay = () => {
        music.play().then(() => {
            console.log('Música iniciada automaticamente');
        }).catch(error => {
            console.log('Autoplay foi bloqueado pelo navegador. A música tocará na primeira interação.');
            // Adiciona listeners para tocar na primeira interação
            document.addEventListener('click', startMusicOnInteraction, { once: true });
            document.addEventListener('keydown', startMusicOnInteraction, { once: true });
            document.addEventListener('touchstart', startMusicOnInteraction, { once: true });
        });
    };

    // Tenta tocar imediatamente
    tryPlay();
    
    // Tenta novamente após um pequeno delay
    setTimeout(tryPlay, 500);
}

function startMusicOnInteraction() {
    const music = document.getElementById('background-music');
    if (music.paused) {
        music.play().then(() => {
            console.log('Música iniciada após interação do usuário');
        }).catch(error => {
            console.log('Erro ao iniciar música:', error);
        });
    }
}

function toggleMusic() {
    const music = document.getElementById('background-music');
    const icon = document.getElementById('music-icon');
    
    if (music.paused) {
        music.play();
        icon.classList.remove('fa-volume-mute');
        icon.classList.add('fa-volume-up');
    } else {
        music.pause();
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
    }
}

function playClickSound() {
    const clickSound = document.getElementById('click-sound');
    clickSound.currentTime = 0; // Reinicia o som para permitir cliques rápidos
    clickSound.volume = 0.5; // Volume do som de clique
    clickSound.play().catch(error => {
        console.log('Erro ao tocar som de clique:', error);
    });
}

function playSuccessSound() {
    const successSound = document.getElementById('success-sound');
    successSound.currentTime = 0; // Reinicia o som
    successSound.volume = 0.7; // Volume do som de acerto
    successSound.play().catch(error => {
        console.log('Erro ao tocar som de acerto:', error);
    });
}

function playFailureSound() {
    const failureSound = document.getElementById('failure-sound');
    failureSound.currentTime = 0; // Reinicia o som
    failureSound.volume = 0.7; // Volume do som de falha
    failureSound.play().catch(error => {
        console.log('Erro ao tocar som de falha:', error);
    });
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    updateStatusDisplay();
    showScreen('home-screen');
    initBackgroundMusic();
    
    // Adiciona som de clique para todos os cliques do mouse esquerdo
    document.addEventListener('click', (event) => {
        // Verifica se é o botão esquerdo do mouse (button 0)
        if (event.button === 0 || event.which === 1 || event.button === undefined) {
            playClickSound();
        }
    });
});
