// PintArte - Main JavaScript

// --- ESTADO DO JOGO ---
const gameState = {
    money: 1000,
    reputation: 0,
    level: 'Aprendiz',
    contractsCompleted: 0,
    inventory: {
        1: 0, // Tinta P
        2: 0, // Tinta M  
        3: 0, // Tinta G
        4: 0, // Tinta GG
        5: 0  // Tinta PP
    }
};

// --- ESTADO DO CONTRATO ATUAL ---
let currentContract = null;

// --- DADOS DO JOGO ---
const contractsData = [
    // APRENDIZ
    { level: 'Aprendiz', name: "Parede Retangular", client: "Sr. Jorge", shape: 'rectangle', reward: 350, penalty: 10 },
    { level: 'Aprendiz', name: "Muro Triangular", client: "Dona Íris", shape: 'triangle', reward: 300, penalty: 15 },
    { level: 'Aprendiz', name: "Telhado Trapezoidal", client: "Construtora Silva", shape: 'trapezoid', reward: 400, penalty: 12 },
    
    // PINTOR
    { level: 'Pintor', name: "Piso em L", client: "Arquiteta Lúcia", shape: 'l-shape', reward: 750, penalty: 25 },
    { level: 'Pintor', name: "Tampo de Mesa Redondo", client: "Marceneiro Davi", shape: 'circle', reward: 900, penalty: 30 },
    { level: 'Pintor', name: "Piso Inclinado", client: "Designer Ana", shape: 'parallelogram', reward: 650, penalty: 20 },
    { level: 'Pintor', name: "Logo da Empresa", client: "Agência Criativa", shape: 'rhombus', reward: 550, penalty: 18 },
    { level: 'Pintor', name: "Corredor em T", client: "Shopping Plaza", shape: 't-shape', reward: 850, penalty: 28 },
    { level: 'Pintor', name: "Pátio em U", client: "Escola Municipal", shape: 'u-shape', reward: 950, penalty: 32 },
    
    // MESTRE
    { level: 'Mestre', name: "Pintar Contêiner", client: "Logística Global", shape: 'prism', reward: 1900, penalty: 50 },
    { level: 'Mestre', name: "Piso Hexagonal", client: "Arquiteta Moderna", shape: 'hexagon', reward: 1200, penalty: 40 },
    { level: 'Mestre', name: "Quadra Setorizada", client: "Clube Esportivo", shape: 'sector', reward: 1400, penalty: 45 },
    { level: 'Mestre', name: "Tanque Cilíndrico", client: "Saneamento S.A.", shape: 'cylinder', reward: 2200, penalty: 60 },
    { level: 'Mestre', name: "Monumento Piramidal", client: "Prefeitura", shape: 'pyramid', reward: 2500, penalty: 70 },
    { level: 'Mestre', name: "Contêiner Cúbico", client: "Transportes XYZ", shape: 'cube', reward: 1800, penalty: 55 },
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

function showFailureOptionsModal(message) {
    const modal = document.getElementById('feedback-modal');
    const messageEl = document.getElementById('feedback-message');
    const buttonEl = document.getElementById('feedback-button');
    
    messageEl.innerHTML = message;
    
    // Substituir o botão único por dois botões
    buttonEl.style.display = 'none';
    
    // Criar container para os botões se não existir
    let buttonsContainer = document.getElementById('failure-buttons-container');
    if (!buttonsContainer) {
        buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'failure-buttons-container';
        buttonsContainer.className = 'flex gap-4 mt-8';
        buttonEl.parentNode.appendChild(buttonsContainer);
    }
    
    buttonsContainer.innerHTML = `
        <button id="new-contract-btn" class="btn btn-green flex-1 text-xl py-3 rounded-lg">
            🎯 Novo Contrato
        </button>
        <button id="back-home-btn" class="btn flex-1 text-xl py-3 rounded-lg">
            🏠 Voltar ao Início
        </button>
    `;
    
    // Adicionar event listeners
    document.getElementById('new-contract-btn').onclick = () => {
        modal.classList.add('hidden');
        resetModalToDefault();
        showContractIntroScreen(); // Usar a tela de introdução em vez de contrato direto
    };
    
    document.getElementById('back-home-btn').onclick = () => {
        modal.classList.add('hidden');
        resetModalToDefault();
        showScreen('home-screen');
    };
    
    modal.classList.remove('hidden');
}

function resetModalToDefault() {
    const buttonEl = document.getElementById('feedback-button');
    const buttonsContainer = document.getElementById('failure-buttons-container');
    
    if (buttonsContainer) {
        buttonsContainer.innerHTML = '';
    }
    buttonEl.style.display = 'block';
}

function updateStatusDisplay() {
    moneyDisplay.innerHTML = `<i class="fas fa-coins text-yellow-400"></i> ${gameState.money}`;
    reputationDisplay.innerHTML = `<i class="fas fa-star text-yellow-400"></i> ${gameState.reputation}`;
    
    // Atualizar display do inventário se existir
    const inventoryDisplay = document.getElementById('inventory-display');
    if (inventoryDisplay) {
        const totalPaints = Object.values(gameState.inventory).reduce((sum, qty) => sum + qty, 0);
        inventoryDisplay.innerHTML = `<i class="fas fa-paint-brush text-blue-400"></i> ${totalPaints}`;
    }
}

function renderStore(mode, currentContract = null) {
    const storeContainer = document.getElementById('store-items');
    const storeFooter = document.getElementById('store-footer');
    const storeTitle = document.querySelector('#store-screen h2');
    
    storeContainer.innerHTML = '';
    
    // Definir título e instruções baseado no modo
    if (mode === 'contract') {
        storeTitle.textContent = 'Loja de Tintas - Contrato Ativo';
    } else {
        storeTitle.textContent = 'Loja de Tintas - Inventário Geral';
    }
    
    paints.forEach(paint => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'bg-gray-200 p-4 rounded-lg text-center text-black space-y-2 flex flex-col justify-between';
        
        // Mostrar quantidade no inventário
        const inventoryQty = gameState.inventory[paint.id] || 0;
        const inventoryInfo = inventoryQty > 0 ? `<p class="text-xs text-blue-600">Em estoque: ${inventoryQty}</p>` : '';
        
        let buttonContent = '';
        if (mode === 'contract') {
            // Modo contrato: opções para usar do estoque ou comprar nova
            if (inventoryQty > 0) {
                buttonContent = `
                    <button onclick="useFromInventory(${paint.id})" class="btn btn-blue w-full mt-1 py-2 rounded-lg text-sm">
                        📦 Usar do Estoque
                    </button>
                    <button onclick="buyPaintForContract(${paint.id})" class="btn btn-green w-full mt-1 py-2 rounded-lg text-sm">
                        💰 Comprar Nova
                    </button>
                `;
            } else {
                buttonContent = `
                    <button onclick="buyPaintForContract(${paint.id})" class="btn btn-green w-full mt-1 py-2 rounded-lg text-sm">
                        💰 Comprar Nova
                    </button>
                `;
            }
        } else {
            // Modo inventário geral: só comprar para estoque
            buttonContent = `
                <button onclick="buyPaintForInventory(${paint.id})" class="btn btn-green w-full mt-2 py-2 rounded-lg text-md">
                    🛒 Comprar para Estoque
                </button>
            `;
        }
        
        itemDiv.innerHTML = `
            <div>
                <p class="font-bold text-lg">${paint.name}</p>
                <p class="text-md">Cobre: ${paint.coverage}m²</p>
                ${inventoryInfo}
            </div>
            <div class="mt-4">
                 <p class="font-bold text-xl"><i class="fas fa-coins text-yellow-600"></i> ${paint.price}</p>
                 ${buttonContent}
            </div>
        `;
        storeContainer.appendChild(itemDiv);
    });

    const backButton = document.createElement('button');
    backButton.className = 'btn w-1/2 md:w-1/4 text-xl py-3 rounded-lg';
    backButton.textContent = mode === 'contract' ? 'Voltar ao Contrato' : 'Voltar ao Menu';
    backButton.onclick = () => showScreen(mode === 'contract' ? 'contract-screen' : 'home-screen');
    storeFooter.innerHTML = '';
    storeFooter.appendChild(backButton);
}

function renderReputation() {
    const reputationContainer = document.getElementById('reputation-details');
    
    // Calcular estatísticas do inventário
    const inventoryItems = [];
    let totalInventoryValue = 0;
    
    paints.forEach(paint => {
        const qty = gameState.inventory[paint.id] || 0;
        if (qty > 0) {
            inventoryItems.push(`${paint.name}: ${qty}x`);
            totalInventoryValue += qty * paint.price;
        }
    });
    
    const inventoryText = inventoryItems.length > 0 
        ? inventoryItems.join(', ') 
        : 'Inventário vazio';
    
    reputationContainer.innerHTML = `
        <p>Título: <span class="font-bold text-yellow-300">${gameState.level}</span></p>
        <p>Contratos Concluídos: <span class="font-bold">${gameState.contractsCompleted}</span></p>
        <p>Reputação: <span class="font-bold">${gameState.reputation}</span></p>
        <hr class="border-gray-500 my-4">
        <p><i class="fas fa-coins text-yellow-400"></i> Moedas: <span class="font-bold">${gameState.money}</span></p>
        <p><i class="fas fa-paint-brush text-blue-400"></i> Tintas em Estoque: <span class="font-bold text-blue-300">${inventoryText}</span></p>
        <p class="text-sm text-gray-400">Valor do Inventário: ${totalInventoryValue} moedas</p>
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
        case 'trapezoid':
            const trapezoidScale = 8;
            container.innerHTML = `
                <div style="position: relative; width: ${d.baseMaior * trapezoidScale}px; height: ${d.height * trapezoidScale}px;">
                    <div style="
                        width: 0; 
                        height: 0; 
                        border-bottom: ${d.height * trapezoidScale}px solid #f59e0b;
                        border-left: ${(d.baseMaior - d.baseMenor) * trapezoidScale / 2}px solid transparent;
                        border-right: ${(d.baseMaior - d.baseMenor) * trapezoidScale / 2}px solid transparent;
                        position: relative;
                    "></div>
                    <div style="
                        position: absolute; 
                        bottom: 0; 
                        left: ${(d.baseMaior - d.baseMenor) * trapezoidScale / 2}px;
                        width: ${d.baseMenor * trapezoidScale}px; 
                        height: ${d.height * trapezoidScale}px; 
                        background-color: #f59e0b;
                    "></div>
                </div>
            `;
            break;
        case 'circle':
            container.innerHTML = `<div class="bg-green-400 rounded-full" style="width: ${d.radius * 20}px; height: ${d.radius * 20}px;"></div>`;
            break;
        case 'parallelogram':
            container.innerHTML = `
                <div style="
                    width: ${d.base * 8}px; 
                    height: ${d.height * 8}px; 
                    background-color: #10b981; 
                    transform: skew(-20deg);
                "></div>
            `;
            break;
        case 'rhombus':
            const rhombusSize = Math.max(d.diagonal1, d.diagonal2) * 6;
            container.innerHTML = `
                <div style="
                    width: ${rhombusSize}px; 
                    height: ${rhombusSize}px; 
                    background-color: #8b5cf6; 
                    transform: rotate(45deg);
                "></div>
            `;
            break;
        case 't-shape':
            container.style.alignItems = 'flex-start';
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div class="bg-red-500" style="width: ${d.w1 * 8}px; height: ${d.h1 * 8}px;"></div>
                    <div class="bg-red-500" style="width: ${d.w2 * 8}px; height: ${d.h2 * 8}px;"></div>
                </div>
            `;
            break;
        case 'u-shape':
            container.style.alignItems = 'flex-start';
            const uScale = 6;
            container.innerHTML = `
                <div style="position: relative;">
                    <div class="bg-indigo-500" style="width: ${d.wTotal * uScale}px; height: ${d.hTotal * uScale}px;"></div>
                    <div style="
                        position: absolute; 
                        top: 0; 
                        left: ${((d.wTotal - d.wRecorte) / 2) * uScale}px;
                        width: ${d.wRecorte * uScale}px; 
                        height: ${d.hRecorte * uScale}px; 
                        background-color: white;
                    "></div>
                </div>
            `;
            break;
        case 'hexagon':
            const hexSize = d.side * 8;
            container.innerHTML = `
                <div style="
                    width: ${hexSize}px; 
                    height: ${hexSize * 0.866}px; 
                    background-color: #06b6d4;
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                "></div>
            `;
            break;
        case 'sector':
            const sectorSize = d.radius * 12;
            container.innerHTML = `
                <div style="
                    width: ${sectorSize}px; 
                    height: ${sectorSize}px; 
                    background: conic-gradient(from 0deg, #fbbf24 0deg ${d.angle}deg, transparent ${d.angle}deg 360deg);
                    border-radius: 50%;
                "></div>
            `;
            break;
        case 'cylinder':
            const cylScale = 8;
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="
                        width: ${d.radius * 2 * cylScale}px; 
                        height: ${d.radius * cylScale / 2}px; 
                        background-color: #ec4899; 
                        border-radius: 50%;
                    "></div>
                    <div style="
                        width: ${d.radius * 2 * cylScale}px; 
                        height: ${d.height * cylScale}px; 
                        background: linear-gradient(to right, #ec4899, #be185d, #ec4899);
                    "></div>
                    <div style="
                        width: ${d.radius * 2 * cylScale}px; 
                        height: ${d.radius * cylScale / 2}px; 
                        background-color: #ec4899; 
                        border-radius: 50%;
                    "></div>
                </div>
            `;
            break;
        case 'pyramid':
            const pyrScale = 6;
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="
                        width: 0; 
                        height: 0; 
                        border-left: ${d.baseWidth * pyrScale / 2}px solid transparent; 
                        border-right: ${d.baseWidth * pyrScale / 2}px solid transparent; 
                        border-bottom: ${d.pyramidHeight * pyrScale}px solid #f97316;
                    "></div>
                    <div style="
                        width: ${d.baseWidth * pyrScale}px; 
                        height: ${d.baseHeight * pyrScale / 3}px; 
                        background-color: #ea580c;
                    "></div>
                </div>
            `;
            break;
        case 'cube':
            const cubeScale = 8;
            container.innerHTML = `
                <div style="position: relative; transform: perspective(200px) rotateX(15deg) rotateY(15deg);">
                    <!-- Face frontal -->
                    <div style="
                        width: ${d.side * cubeScale}px; 
                        height: ${d.side * cubeScale}px; 
                        background-color: #ef4444;
                    "></div>
                    <!-- Face superior -->
                    <div style="
                        position: absolute; 
                        top: -${d.side * cubeScale / 4}px; 
                        left: ${d.side * cubeScale / 4}px;
                        width: ${d.side * cubeScale}px; 
                        height: ${d.side * cubeScale}px; 
                        background-color: #dc2626;
                        transform: rotateX(90deg) rotateY(0deg);
                        transform-origin: bottom;
                    "></div>
                    <!-- Face lateral -->
                    <div style="
                        position: absolute; 
                        top: 0; 
                        left: ${d.side * cubeScale}px;
                        width: ${d.side * cubeScale}px; 
                        height: ${d.side * cubeScale}px; 
                        background-color: #b91c1c;
                        transform: rotateY(90deg);
                        transform-origin: left;
                    "></div>
                </div>
            `;
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

    // Agrupar tintas iguais e mostrar origem
    const paintGroups = {};
    currentContract.paints.forEach(paint => {
        if (!paintGroups[paint.id]) {
            paintGroups[paint.id] = {
                paint: paint,
                fromInventory: 0,
                bought: 0
            };
        }
    });

    // Contar origem das tintas (simulado - em implementação real seria rastreado)
    currentContract.paints.forEach(paint => {
        paintGroups[paint.id].bought++;
    });

    Object.values(paintGroups).forEach(group => {
        const total = group.fromInventory + group.bought;
        let originText = '';
        if (group.fromInventory > 0 && group.bought > 0) {
            originText = ` (${group.fromInventory} do estoque, ${group.bought} compradas)`;
        } else if (group.fromInventory > 0) {
            originText = ` (do estoque)`;
        } else {
            originText = ` (compradas)`;
        }
        
        cartItemsContainer.innerHTML += `<p class="text-sm">- ${group.paint.name} x${total} (${group.paint.coverage * total}m²)${originText}</p>`;
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
    renderStore('contract', currentContract);
    showScreen('store-screen');
}

function showStoreForShopping() {
    renderStore('inventory');
    showScreen('store-screen');
}

function startNewContract() {
    // Esta função agora é chamada apenas para contratos diretos (sem introdução)
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
        case 'trapezoid':
            contractDetails.baseMaior = generateRandomValue(8, 16);
            contractDetails.baseMenor = generateRandomValue(4, 8);
            contractDetails.height = generateRandomValue(4, 8);
            break;
        case 'circle':
            contractDetails.radius = generateRandomValue(3, 8);
            break;
        case 'parallelogram':
            contractDetails.base = generateRandomValue(8, 15);
            contractDetails.height = generateRandomValue(5, 12);
            break;
        case 'rhombus':
            contractDetails.diagonal1 = generateRandomValue(6, 14);
            contractDetails.diagonal2 = generateRandomValue(8, 16);
            break;
        case 't-shape':
            contractDetails.w1 = generateRandomValue(10, 18);
            contractDetails.h1 = generateRandomValue(3, 6);
            contractDetails.w2 = generateRandomValue(4, 8);
            contractDetails.h2 = generateRandomValue(8, 14);
            break;
        case 'u-shape':
            contractDetails.wTotal = generateRandomValue(12, 20);
            contractDetails.hTotal = generateRandomValue(8, 14);
            contractDetails.wRecorte = generateRandomValue(6, 10);
            contractDetails.hRecorte = generateRandomValue(4, 8);
            break;
        case 'hexagon':
            contractDetails.side = generateRandomValue(4, 8);
            break;
        case 'sector':
            contractDetails.radius = generateRandomValue(6, 12);
            contractDetails.angle = generateRandomValue(45, 180);
            break;
        case 'cylinder':
            contractDetails.radius = generateRandomValue(3, 8);
            contractDetails.height = generateRandomValue(6, 12);
            break;
        case 'pyramid':
            contractDetails.baseWidth = generateRandomValue(8, 16);
            contractDetails.baseHeight = generateRandomValue(8, 16);
            contractDetails.pyramidHeight = generateRandomValue(6, 12);
            break;
        case 'cube':
            contractDetails.side = generateRandomValue(5, 12);
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
    
    setupContractScreen();
    showScreen('contract-screen');
}

// --- TELA DE INTRODUÇÃO AO CONTRATO ---
function showContractIntroScreen() {
    // Preparar contrato primeiro
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
        case 'trapezoid':
            contractDetails.baseMaior = generateRandomValue(8, 16);
            contractDetails.baseMenor = generateRandomValue(4, 8);
            contractDetails.height = generateRandomValue(4, 8);
            break;
        case 'circle':
            contractDetails.radius = generateRandomValue(3, 8);
            break;
        case 'parallelogram':
            contractDetails.base = generateRandomValue(6, 14);
            contractDetails.height = generateRandomValue(4, 9);
            break;
        case 'rhombus':
            contractDetails.diagonal1 = generateRandomValue(6, 12);
            contractDetails.diagonal2 = generateRandomValue(4, 10);
            break;
        case 'l-shape':
            contractDetails.w1 = generateRandomValue(8, 15);
            contractDetails.h1 = generateRandomValue(4, 6);
            contractDetails.w2 = generateRandomValue(4, 6);
            contractDetails.h2 = generateRandomValue(6, 10);
            break;
        case 't-shape':
            contractDetails.w1 = generateRandomValue(8, 14); // parte horizontal
            contractDetails.h1 = generateRandomValue(3, 5);
            contractDetails.w2 = generateRandomValue(3, 6);  // parte vertical
            contractDetails.h2 = generateRandomValue(6, 10);
            break;
        case 'u-shape':
            contractDetails.wTotal = generateRandomValue(10, 16);
            contractDetails.hTotal = generateRandomValue(8, 12);
            contractDetails.wRecorte = generateRandomValue(4, 8);
            contractDetails.hRecorte = generateRandomValue(4, 6);
            break;
        case 'hexagon':
            contractDetails.side = generateRandomValue(4, 8);
            break;
        case 'sector':
            contractDetails.radius = generateRandomValue(5, 10);
            contractDetails.angle = generateRandomValue(60, 270);
            break;
        case 'prism':
            contractDetails.width = generateRandomValue(12, 18);
            contractDetails.height = generateRandomValue(6, 10);
            contractDetails.depth = generateRandomValue(3, 5);
            break;
        case 'cylinder':
            contractDetails.radius = generateRandomValue(3, 8);
            contractDetails.height = generateRandomValue(8, 15);
            break;
        case 'pyramid':
            contractDetails.baseWidth = generateRandomValue(6, 12);
            contractDetails.baseHeight = generateRandomValue(6, 12);
            contractDetails.pyramidHeight = generateRandomValue(8, 15);
            break;
        case 'cube':
            contractDetails.side = generateRandomValue(5, 12);
            break;
    }

    // Armazenar contrato temporariamente
    window.tempContract = contractDetails;

    // Preparar texto do contrato
    const contractText = generateContractText(contractDetails);

    // Mostrar tela com fade-in
    showScreenWithFade('contract-intro-screen', () => {
        // Iniciar vídeo
        const video = document.getElementById('contract-video');
        video.currentTime = 0;
        video.play().catch(e => console.log('Vídeo não pôde ser reproduzido:', e));

        // Mostrar caixa de diálogo após um delay
        setTimeout(() => {
            const dialog = document.getElementById('game-boy-dialog');
            dialog.classList.add('show');

            // Iniciar animação de texto após a caixa aparecer
            setTimeout(() => {
                typeText('dialog-text', contractText, () => {
                    // Mostrar botões após o texto terminar
                    setTimeout(() => {
                        document.getElementById('dialog-buttons').style.opacity = '1';
                        setupContractButtons();
                    }, 500);
                });
            }, 300);
        }, 800);
    });
}

function generateContractText(contract) {
    const clientMessages = {
        "Sr. Jorge": "Olá! Sou o Sr. Jorge e preciso pintar uma parede da minha casa.",
        "Dona Íris": "Oi querido! Sou a Dona Íris e tenho um projeto especial para você.",
        "Construtora Silva": "Bom dia! Somos da Construtora Silva e temos um telhado para pintar.",
        "Arquiteta Lúcia": "Bom dia! Sou a Arquiteta Lúcia e tenho um projeto comercial.",
        "Marceneiro Davi": "E aí! Sou o Marceneiro Davi e preciso de ajuda com uma peça.",
        "Designer Ana": "Olá! Sou a Designer Ana e tenho um piso especial para pintar.",
        "Agência Criativa": "Olá! Somos da Agência Criativa e precisamos pintar um logo.",
        "Shopping Plaza": "Bom dia! Representamos o Shopping Plaza e temos um corredor.",
        "Escola Municipal": "Olá! Somos da Escola Municipal e temos um pátio interno.",
        "Logística Global": "Olá! Representamos a Logística Global. Temos um projeto industrial.",
        "Arquiteta Moderna": "Oi! Sou uma arquiteta e tenho um projeto inovador.",
        "Clube Esportivo": "Olá! Somos do Clube Esportivo e temos uma quadra especial.",
        "Saneamento S.A.": "Bom dia! Somos da empresa de saneamento e temos um tanque.",
        "Prefeitura": "Olá! Representamos a Prefeitura e temos um monumento.",
        "Transportes XYZ": "Oi! Somos da Transportes XYZ e temos um contêiner especial."
    };

    const shapeDescriptions = {
        "rectangle": "uma superfície retangular",
        "triangle": "uma superfície triangular",
        "trapezoid": "uma superfície trapezoidal",
        "circle": "uma superfície circular",
        "parallelogram": "uma superfície em paralelogramo",
        "rhombus": "uma superfície em formato de losango",
        "l-shape": "uma superfície em formato de L",
        "t-shape": "uma superfície em formato de T",
        "u-shape": "uma superfície em formato de U",
        "hexagon": "uma superfície hexagonal",
        "sector": "um setor circular",
        "prism": "um contêiner (todas as faces externas)",
        "cylinder": "um tanque cilíndrico (superfície externa)",
        "pyramid": "uma pirâmide (todas as faces)",
        "cube": "um cubo (todas as faces)"
    };

    const instructions = {
        "rectangle": "Calcule a área: base × altura",
        "triangle": "Calcule a área: (base × altura) ÷ 2",
        "trapezoid": "Calcule a área: (base maior + base menor) × altura ÷ 2",
        "circle": "Calcule a área: π × raio² (use π = 3.14)",
        "parallelogram": "Calcule a área: base × altura",
        "rhombus": "Calcule a área: diagonal maior × diagonal menor ÷ 2",
        "l-shape": "Calcule a área total das duas partes",
        "t-shape": "Calcule a área total das duas partes",
        "u-shape": "Calcule a área total menos o recorte central",
        "hexagon": "Calcule a área: 2.6 × lado²",
        "sector": "Calcule a área: ângulo/360 × π × raio²",
        "prism": "Calcule a área de superfície: 2(lw + lh + wh)",
        "cylinder": "Calcule a área de superfície: 2πr² + 2πrh",
        "pyramid": "Calcule a área: área base + 4 × área faces triangulares",
        "cube": "Calcule a área de superfície: 6 × lado²"
    };

    return `${clientMessages[contract.client]}\n\n` +
           `Projeto: ${contract.name}\n\n` +
           `Preciso pintar ${shapeDescriptions[contract.shape]}.\n\n` +
           `${instructions[contract.shape]}\n\n` +
           `Recompensa: ${contract.reward} moedas\n\n` +
           `Você aceita este trabalho?`;
}

function typeText(elementId, text, callback) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
    element.classList.add('typing-cursor');
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            if (text[i] === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += text[i];
            }
            i++;
            
            // Som de digitação ocasional
            if (i % 3 === 0) {
                playClickSound();
            }
        } else {
            element.classList.remove('typing-cursor');
            clearInterval(typeInterval);
            if (callback) callback();
        }
    }, 40); // Velocidade de digitação
}

function setupContractButtons() {
    document.getElementById('accept-contract-btn').onclick = () => {
        acceptContract();
    };
    
    document.getElementById('decline-contract-btn').onclick = () => {
        declineContract();
    };
}

function acceptContract() {
    // Usar o contrato temporário
    currentContract = {
        details: window.tempContract,
        paints: [],
        totalCoverage: 0,
        totalCost: 0
    };
    
    // Transição suave para a tela de contrato
    hideScreenWithFade('contract-intro-screen', () => {
        setupContractScreen();
        showScreenWithFade('contract-screen');
    });
}

function declineContract() {
    // Voltar para a tela inicial
    hideScreenWithFade('contract-intro-screen', () => {
        showScreenWithFade('home-screen');
    });
}

function showScreenWithFade(screenId, callback) {
    // Esconder tela atual com fade-out
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        currentScreen.classList.add('fade-transition', 'fade-out');
        setTimeout(() => {
            currentScreen.classList.remove('active', 'fade-transition', 'fade-out');
            showNewScreen();
        }, 600);
    } else {
        showNewScreen();
    }
    
    function showNewScreen() {
        const nextScreen = document.getElementById(screenId);
        nextScreen.classList.add('fade-transition');
        nextScreen.classList.add('active');
        
        setTimeout(() => {
            nextScreen.style.opacity = '1';
            if (callback) callback();
        }, 50);
        
        // Remover classe de transição após animação
        setTimeout(() => {
            nextScreen.classList.remove('fade-transition');
        }, 700);
    }
}

function hideScreenWithFade(screenId, callback) {
    const screen = document.getElementById(screenId);
    screen.classList.add('fade-transition', 'fade-out');
    
    setTimeout(() => {
        screen.classList.remove('active', 'fade-transition', 'fade-out');
        
        // Parar vídeo se existir
        const video = screen.querySelector('video');
        if (video) {
            video.pause();
        }
        
        // Reset do dialog
        const dialog = document.getElementById('game-boy-dialog');
        if (dialog) {
            dialog.classList.remove('show');
            document.getElementById('dialog-buttons').style.opacity = '0';
        }
        
        if (callback) callback();
    }, 600);
}

function setupContractScreen() {
    document.getElementById('contract-client').textContent = `CLIENTE: ${currentContract.details.client}`;
    document.getElementById('contract-project').textContent = `PROJETO: ${currentContract.details.name}`;
    document.getElementById('contract-reward').innerHTML = `RECOMPENSA: <i class="fas fa-coins text-yellow-500"></i> ${currentContract.details.reward}`;

    let dimensionsText = '', areaLabelText = 'Calcule a área (m²):';
    const d = currentContract.details;
    switch (d.shape) {
        case 'rectangle': dimensionsText = `Base: ${d.width}m, Altura: ${d.height}m`; break;
        case 'triangle': dimensionsText = `Base: ${d.base}m, Altura: ${d.height}m`; break;
        case 'trapezoid': dimensionsText = `Base maior: ${d.baseMaior}m, Base menor: ${d.baseMenor}m, Altura: ${d.height}m`; break;
        case 'circle': dimensionsText = `Raio: ${d.radius}m. Use Pi = 3.14 e arredonde.`; break;
        case 'parallelogram': dimensionsText = `Base: ${d.base}m, Altura: ${d.height}m`; break;
        case 'rhombus': dimensionsText = `Diagonal maior: ${d.diagonal1}m, Diagonal menor: ${d.diagonal2}m`; break;
        case 't-shape': dimensionsText = `Forma T: Horizontal [${d.w1}x${d.h1}], Vertical [${d.w2}x${d.h2}]`; break;
        case 'u-shape': dimensionsText = `Forma U: Total [${d.wTotal}x${d.hTotal}], Recorte [${d.wRecorte}x${d.hRecorte}]`; break;
        case 'hexagon': dimensionsText = `Lado: ${d.side}m. Use fórmula: 2.6 × lado²`; break;
        case 'sector': dimensionsText = `Raio: ${d.radius}m, Ângulo: ${d.angle}°. Use Pi = 3.14`; break;
        case 'cylinder': 
            dimensionsText = `Raio: ${d.radius}m, Altura: ${d.height}m`; 
            areaLabelText = 'Calcule a área de SUPERFÍCIE (m²):';
            break;
        case 'pyramid': 
            dimensionsText = `Base: ${d.baseWidth}x${d.baseHeight}m, Altura: ${d.pyramidHeight}m`; 
            areaLabelText = 'Calcule a área de SUPERFÍCIE (m²):';
            break;
        case 'cube': 
            dimensionsText = `Lado: ${d.side}m`; 
            areaLabelText = 'Calcule a área de SUPERFÍCIE (m²):';
            break;
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
    renderCart();
}

function addPaintToCart(paintId) {
    // Esta função foi substituída por buyPaintForContract e useFromInventory
    // Mantida para compatibilidade, mas redireciona para a nova função
    buyPaintForContract(paintId);
}

// --- FUNÇÕES DO SISTEMA DE INVENTÁRIO ---
function buyPaintForInventory(paintId) {
    const paint = paints.find(p => p.id === paintId);
    if (gameState.money < paint.price) {
        showFeedbackModal("💰 Dinheiro insuficiente para comprar esta tinta!");
        return;
    }
    
    gameState.money -= paint.price;
    gameState.inventory[paint.id] = (gameState.inventory[paint.id] || 0) + 1;
    
    updateStatusDisplay();
    showFeedbackModal(`🛒 ${paint.name} adicionada ao seu inventário!`, "OK", () => {
        // Atualizar a loja para mostrar a nova quantidade
        renderStore('inventory');
    });
}

function buyPaintForContract(paintId) {
    const paint = paints.find(p => p.id === paintId);
    if (gameState.money < paint.price) {
        showFeedbackModal("💰 Dinheiro insuficiente para comprar esta tinta!");
        return;
    }
    
    if (!currentContract) {
        showFeedbackModal("❌ Nenhum contrato ativo!");
        return;
    }
    
    gameState.money -= paint.price;
    currentContract.paints.push(paint);
    currentContract.totalCoverage += paint.coverage;
    currentContract.totalCost += paint.price;
    
    document.getElementById('paint-btn').disabled = false;
    updateStatusDisplay();
    showFeedbackModal(`💰 ${paint.name} comprada e adicionada ao projeto!`, "OK", () => {
        // Atualizar a loja para mostrar as mudanças
        renderStore('contract', currentContract);
    });
}

function useFromInventory(paintId) {
    const paint = paints.find(p => p.id === paintId);
    const inventoryQty = gameState.inventory[paint.id] || 0;
    
    if (inventoryQty <= 0) {
        showFeedbackModal("📦 Você não tem esta tinta em estoque!");
        return;
    }
    
    if (!currentContract) {
        showFeedbackModal("❌ Nenhum contrato ativo!");
        return;
    }
    
    // Remover do inventário
    gameState.inventory[paint.id]--;
    
    // Adicionar ao contrato (sem custo adicional)
    currentContract.paints.push(paint);
    currentContract.totalCoverage += paint.coverage;
    // Não adiciona ao custo total pois já foi pago antes
    
    document.getElementById('paint-btn').disabled = false;
    updateStatusDisplay();
    showFeedbackModal(`📦 ${paint.name} retirada do estoque e adicionada ao projeto!`, "OK", () => {
        // Atualizar a loja para mostrar as mudanças
        renderStore('contract', currentContract);
    });
}

function getCorrectArea() {
    if (!currentContract) return 0;
    const d = currentContract.details;
    switch (d.shape) {
        case 'rectangle': return d.width * d.height;
        case 'triangle': return (d.base * d.height) / 2;
        case 'trapezoid': return ((d.baseMaior + d.baseMenor) * d.height) / 2;
        case 'circle': return Math.round(3.14 * d.radius * d.radius);
        case 'parallelogram': return d.base * d.height;
        case 'rhombus': return (d.diagonal1 * d.diagonal2) / 2;
        case 't-shape': return (d.w1 * d.h1) + (d.w2 * d.h2);
        case 'u-shape': return (d.wTotal * d.hTotal) - (d.wRecorte * d.hRecorte);
        case 'hexagon': return Math.round(2.6 * d.side * d.side);
        case 'sector': return Math.round((d.angle / 360) * 3.14 * d.radius * d.radius);
        case 'cylinder': 
            // Área de superfície: 2πr² + 2πrh
            return Math.round(2 * 3.14 * d.radius * d.radius + 2 * 3.14 * d.radius * d.height);
        case 'pyramid':
            // Área de superfície: área da base + 4 × área das faces triangulares
            const baseArea = d.baseWidth * d.baseHeight;
            // Aproximação da área das faces triangulares usando altura da pirâmide
            const faceArea = 4 * ((d.baseWidth * Math.sqrt((d.pyramidHeight * d.pyramidHeight) + (d.baseWidth * d.baseWidth / 4))) / 2);
            return Math.round(baseArea + faceArea);
        case 'cube': 
            // Área de superfície: 6 × lado²
            return 6 * d.side * d.side;
        case 'l-shape': return (d.w1 * d.h1) + (d.w2 * d.h2);
        case 'prism':
            // Área de superfície de um prisma retangular: 2(lw + lh + wh)
            const area1 = d.width * d.depth;  // Base superior e inferior
            const area2 = d.width * d.height; // Frente e trás
            const area3 = d.depth * d.height; // Laterais esquerda e direita
            return 2 * (area1 + area2 + area3);
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

    if (!currentContract.paints || currentContract.paints.length === 0) {
        document.getElementById('contract-feedback').textContent = "Você precisa comprar tinta antes de pintar!";
        document.getElementById('contract-feedback').style.color = '#ef4444';
        return;
    }

    // Permitir tolerância de 1% para arredondamentos
    const tolerance = Math.max(1, correctArea * 0.01);
    const isCorrect = Math.abs(userAnswer - correctArea) <= tolerance;

    if (!isCorrect) {
        // Jogador errou o cálculo! Toca o som de falha
        playFailureSound();
        feedbackMessage = `❌ <strong>Cálculo Incorreto!</strong><br><br>A área era de ${correctArea}m² (±${tolerance.toFixed(1)}). <br><br>Você perdeu o custo da tinta e -5 de reputação.<br><br><strong>O que deseja fazer?</strong>`;
        gameState.reputation = Math.max(0, gameState.reputation - 5);
        
        currentContract = null; // Finaliza o contrato
        updatePlayerLevel();
        updateStatusDisplay();
        
        // Mostrar modal com opções
        showFailureOptionsModal(feedbackMessage);
        return;
    } else {
        if (currentContract.totalCoverage < correctArea) {
            // Cálculo certo mas tinta insuficiente! Toca o som de falha
            playFailureSound();
            feedbackMessage = `❌ <strong>Tinta Insuficiente!</strong><br><br>Cálculo correto, mas a tinta não foi suficiente! O cliente ficou insatisfeito. <br><br>Você perdeu o custo da tinta e -10 de reputação.<br><br><strong>O que deseja fazer?</strong>`;
            gameState.reputation = Math.max(0, gameState.reputation - 10);
            
            currentContract = null; // Finaliza o contrato
            updatePlayerLevel();
            updateStatusDisplay();
            
            // Mostrar modal com opções
            showFailureOptionsModal(feedbackMessage);
            return;
        } else {
            // Jogador acertou! Toca o som de sucesso
            playSuccessSound();
            const profit = currentContract.details.reward - currentContract.totalCost;
            feedbackMessage = `✅ <strong>Trabalho Concluído!</strong><br><br>A recompensa foi de ${currentContract.details.reward}, o custo da tinta foi ${currentContract.totalCost}.<br>Lucro de: ${profit} moedas. <br>+10 de reputação.<br><br>🎯 <strong>Próximo contrato chegando...</strong>`;
            gameState.money += currentContract.details.reward;
            gameState.reputation += 10;
            gameState.contractsCompleted++;
            
            currentContract = null; // Finaliza o contrato
            updatePlayerLevel();
            updateStatusDisplay();
            showFeedbackModal(feedbackMessage, "Próximo Contrato", () => showContractIntroScreen());
        }
    }
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
    // Iniciar splash screen
    showSplashScreen();
});

// --- SPLASH SCREEN ---
function showSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const publisherLogo = document.getElementById('publisher-logo');
    const homeScreen = document.getElementById('home-screen');
    
    // Garantir que a splash screen esteja visível
    splashScreen.style.display = 'flex';
    homeScreen.classList.remove('active');
    
    // Sequência da splash screen
    setTimeout(() => {
        // Fade-in da logo (1s)
        publisherLogo.classList.add('fade-in');
        
        setTimeout(() => {
            // Fade-out da logo (1s)
            publisherLogo.classList.remove('fade-in');
            publisherLogo.classList.add('fade-out');
            
            setTimeout(() => {
                // Esconder splash screen e mostrar jogo (0.5s)
                splashScreen.style.opacity = '0';
                
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                    homeScreen.classList.add('active');
                    
                    // Inicializar o jogo após a splash screen
                    initializeGame();
                }, 500);
            }, 1000);
        }, 1500); // Logo fica visível por 1.5s
    }, 300); // Pequeno delay inicial
}

function initializeGame() {
    updateStatusDisplay();
    showScreen('home-screen');
    initBackgroundMusic();
    
    // Iniciar animações da tela inicial
    startHomeScreenAnimations();
    
    // Adiciona som de clique para todos os cliques do mouse esquerdo
    document.addEventListener('click', (event) => {
        // Verifica se é o botão esquerdo do mouse (button 0)
        if (event.button === 0 || event.which === 1 || event.button === undefined) {
            playClickSound();
        }
    });
}

// --- ANIMAÇÕES DA TELA INICIAL ---
function startHomeScreenAnimations() {
    const bgVideo = document.getElementById('bg-video');
    const gameLogo = document.getElementById('game-logo');
    const btnContract = document.getElementById('btn-contract');
    const btnStore = document.getElementById('btn-store');
    const btnReputation = document.getElementById('btn-reputation');
    
    // Fazer fade-in do vídeo de fundo primeiro
    setTimeout(() => {
        bgVideo.style.opacity = '1';
    }, 100);
    
    // Animar logo do jogo
    setTimeout(() => {
        gameLogo.classList.add('fade-in-logo');
    }, 800);
    
    // Animar botões sequencialmente
    setTimeout(() => {
        btnContract.classList.add('fade-in-button');
    }, 1500);
    
    setTimeout(() => {
        btnStore.classList.add('fade-in-button');
    }, 1700);
    
    setTimeout(() => {
        btnReputation.classList.add('fade-in-button');
    }, 1900);
}
