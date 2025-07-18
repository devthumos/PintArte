# 🧪 FLUXO DE TESTES - PintArte

## 📋 Objetivo
Testar sistematicamente todas as funcionalidades do jogo PintArte para garantir que não há bugs e que a experiência do usuário está fluindo corretamente.

---

## 🚀 TESTE 1: CARREGAMENTO E INICIALIZAÇÃO

### ✅ Checklist Inicial:
- [ ] **Página carrega sem erros** - Verificar no console do navegador (F12)
- [ ] **Música de fundo toca automaticamente** ou após primeira interação
- [ ] **Interface inicial exibe corretamente:**
  - [ ] Título "EMPRESA PINTARTE" visível
  - [ ] Status bar mostra: 💰 500 moedas, ⭐ 0 reputação  
  - [ ] Botão de música funcionando (🔊/🔇)
  - [ ] Botões: NOVO CONTRATO, LOJA, REPUTAÇÃO

### 🔧 Como Testar:
1. Abra `pintarte.html` no navegador
2. Verifique se tudo carrega visualmente
3. Clique no botão de música para testar toggle
4. Verifique se sons de clique funcionam

---

## 🎯 TESTE 2: NAVEGAÇÃO ENTRE TELAS

### ✅ Checklist:
- [ ] **Tela REPUTAÇÃO:**
  - [ ] Mostra título atual, contratos concluídos, reputação, moedas
  - [ ] Botão "Voltar" retorna ao menu principal
- [ ] **Tela LOJA:**
  - [ ] Mostra 5 tipos de tinta (PP, P, M, G, GG)
  - [ ] Preços e coberturas corretos
  - [ ] Botão "Voltar ao Menu" funciona
- [ ] **Transições suaves** entre telas
- [ ] **Scroll automático** para topo ao mudar tela

### 🔧 Como Testar:
1. No menu principal, clique em "REPUTAÇÃO"
2. Verifique informações e volte
3. Clique em "LOJA"  
4. Verifique produtos e volte
5. Teste navegação múltiplas vezes

---

## 📐 TESTE 3: SISTEMA DE CONTRATOS - FORMAS BÁSICAS

### ✅ Checklist Retângulo:
- [ ] **Gerar contrato retangular** (nível Aprendiz)
- [ ] **Verificar informações:**
  - [ ] Cliente e projeto exibidos
  - [ ] Dimensões mostradas (ex: Base: 8m, Altura: 6m)
  - [ ] Forma visual aparece corretamente
- [ ] **Calcular área:** Base × Altura (ex: 8 × 6 = 48)
- [ ] **Teste sem tinta:** Botão "PINTAR" deve dar erro
- [ ] **Comprar tinta suficiente** e testar sucesso
- [ ] **Testar cálculo errado** e verificar penalidade

### ✅ Checklist Triângulo:
- [ ] **Gerar até conseguir triângulo**
- [ ] **Cálculo correto:** (Base × Altura) ÷ 2
- [ ] **Forma visual triangular** aparece
- [ ] **Fluxo completo** de compra e pintura

### ✅ Checklist Círculo:
- [ ] **Gerar até conseguir círculo**  
- [ ] **Cálculo:** π × raio² (usar Pi = 3.14, arredondar)
- [ ] **Forma visual circular** aparece
- [ ] **Teste com tolerância** de ±1%

### 🔧 Como Testar:
1. Clique "NOVO CONTRATO" várias vezes até conseguir cada forma
2. Para cada forma, anote as dimensões
3. Calcule a área manualmente
4. Teste cenários: sem tinta, tinta insuficiente, cálculo errado, sucesso

---

## 🏗️ TESTE 4: FORMAS AVANÇADAS (NÍVEIS SUPERIORES)

### ✅ Checklist Forma L (Nível Pintor):
- [ ] **Completar 3+ contratos** para desbloquear
- [ ] **Verificar cálculo:** Área1 + Área2
- [ ] **Forma visual** em L aparece
- [ ] **Recompensa maior** (≈650 moedas)

### ✅ Checklist Prisma (Nível Mestre):
- [ ] **Completar 8+ contratos** para desbloquear  
- [ ] **Canvas renderiza** prisma com medidas
- [ ] **Fórmula correta:** 2(lw + lh + wh)
- [ ] **Recompensa máxima** (≈1700 moedas)

### 🔧 Como Testar:
1. Complete contratos básicos para ganhar experiência
2. Verifique se nível muda: Aprendiz → Pintor → Mestre
3. Teste formas avançadas quando disponíveis

---

## 💰 TESTE 5: SISTEMA ECONÔMICO

### ✅ Checklist Dinheiro:
- [ ] **Inicia com 500 moedas**
- [ ] **Comprar tinta desconta** do total
- [ ] **Sucesso em contrato** soma recompensa
- [ ] **Falha mantém** desconto da tinta
- [ ] **Abandonar contrato** devolve dinheiro da tinta
- [ ] **Não pode comprar** com dinheiro insuficiente

### ✅ Checklist Reputação:
- [ ] **Inicia com 0**
- [ ] **Sucesso:** +10 reputação
- [ ] **Cálculo errado:** -5 reputação  
- [ ] **Tinta insuficiente:** -10 reputação
- [ ] **Nunca fica negativa**

### 🔧 Como Testar:
1. Monitore saldo antes/depois de cada ação
2. Erre propositalmente para testar penalidades
3. Teste cenário de ficar sem dinheiro

---

## 🎵 TESTE 6: SISTEMA DE ÁUDIO

### ✅ Checklist Sons:
- [ ] **Música de fundo** toca em loop
- [ ] **Toggle música** funciona (🔊/🔇)
- [ ] **Som de clique** em todos os botões
- [ ] **Som de sucesso** quando acerta
- [ ] **Som de falha** quando erra
- [ ] **Volumes apropriados** (não muito alto)

### 🔧 Como Testar:
1. Teste com/sem fones de ouvido
2. Verifique se não há sobreposição de sons
3. Teste mute/unmute durante gameplay

---

## 🛒 TESTE 7: SISTEMA DE LOJA E TINTAS

### ✅ Checklist Compras:
- [ ] **Acesso via menu** (compras livres)
- [ ] **Acesso via contrato** (compras para projeto)
- [ ] **Diferentes contextos** funcionam corretamente
- [ ] **Feedback visual** após compra
- [ ] **Carrinho atualiza** corretamente
- [ ] **Cobertura calculada** corretamente

### 🔧 Como Testar:
1. Teste loja pelo menu principal
2. Teste loja durante um contrato
3. Verifique se comportamentos são diferentes
4. Teste múltiplas compras da mesma tinta

---

## 🎲 TESTE 8: GERAÇÃO ALEATÓRIA

### ✅ Checklist Aleatoriedade:
- [ ] **Contratos variam** a cada clique
- [ ] **Dimensões mudam** mesmo na mesma forma
- [ ] **Todos os tipos** aparecem eventualmente
- [ ] **Valores estão** nos intervalos esperados

### 🔧 Como Testar:
1. Gere 10+ contratos seguidos
2. Anote variedade de formas e dimensões
3. Verifique se não há padrões óbvios

---

## 🚨 TESTE 9: CENÁRIOS DE ERRO

### ✅ Checklist Casos Extremos:
- [ ] **Input vazio** no campo área
- [ ] **Números negativos** no campo área
- [ ] **Números muito grandes** (9999999)
- [ ] **Texto inválido** no campo área
- [ ] **Múltiplos cliques rápidos** nos botões
- [ ] **Fechar modal** durante operação

### 🔧 Como Testar:
1. Digite valores inválidos propositalmente
2. Teste comportamento com entradas extremas
3. Verifique se há travamentos ou erros

---

## 📱 TESTE 10: RESPONSIVIDADE

### ✅ Checklist Dispositivos:
- [ ] **Desktop** (1920x1080)
- [ ] **Tablet** (768x1024)
- [ ] **Mobile** (375x667)
- [ ] **Interface adaptativa** funciona
- [ ] **Textos legíveis** em todas as telas
- [ ] **Botões clicáveis** facilmente

### 🔧 Como Testar:
1. Redimensione janela do navegador
2. Teste em dispositivos diferentes
3. Use DevTools para simular tamanhos

---

## 🔄 TESTE 11: PROGRESSÃO COMPLETA

### ✅ Checklist Jornada Completa:
- [ ] **Começar do zero**
- [ ] **Completar 15+ contratos**
- [ ] **Atingir nível Mestre**
- [ ] **Testar todas as formas**
- [ ] **Acumular reputação significativa**
- [ ] **Gerenciar economia** eficientemente

### 🔧 Como Testar:
1. Jogue uma sessão completa de 15-20 minutos
2. Simule jogador real aprendendo
3. Verifique se progressão é satisfatória

---

## 📊 FORMULÁRIO DE FEEDBACK

**Para cada teste, anote:**

### ✅ **FUNCIONOU CORRETAMENTE:**
- [ ] Funcionalidade X
- [ ] Funcionalidade Y

### ❌ **BUGS ENCONTRADOS:**
- [ ] Bug: [Descrição] - Passos para reproduzir
- [ ] Bug: [Descrição] - Severidade (baixa/média/alta)

### 💡 **SUGESTÕES DE MELHORIA:**
- [ ] Sugestão: [Descrição]
- [ ] UX: [Feedback sobre experiência]

### 🎯 **PONTUAÇÃO GERAL:**
- **Facilidade de uso:** ⭐⭐⭐⭐⭐ (1-5)
- **Diversão:** ⭐⭐⭐⭐⭐ (1-5) 
- **Estabilidade:** ⭐⭐⭐⭐⭐ (1-5)
- **Qualidade áudio:** ⭐⭐⭐⭐⭐ (1-5)

---

## 🚀 CONCLUSÃO

Após completar todos os testes, você terá uma visão completa da qualidade e estabilidade do jogo PintArte. Use este feedback para priorizar correções e melhorias!

**Tempo estimado total:** 30-45 minutos
**Recomendação:** Teste em sessões de 10-15 minutos para manter foco.
