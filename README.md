# PintArte - Jogo Educativo de Geometria

## 📖 Visão Geral

**PintArte** é um jogo educativo web que ensina conceitos de geometria através de contratos de pintura. O jogador assume o papel de uma empresa de pintura que precisa calcular áreas de diferentes formas geométricas para comprar a quantidade correta de tinta e completar projetos.

## 🎮 Mecânicas do Jogo

### Sistema de Progressão
- **3 Níveis de Jogador**: Aprendiz → Pintor → Mestre
- **Critérios de Progressão**:
  - Aprendiz: 0-2 contratos concluídos
  - Pintor: 3-7 contratos concluídos  
  - Mestre: 8+ contratos concluídos

### Sistema de Recursos
- **Moedas**: Recurso principal para comprar tintas (inicia com 500)
- **Reputação**: Medida de sucesso do jogador (inicia com 0)

### Contratos por Nível

#### Nível Aprendiz
- **Parede Retangular** (Sr. Jorge) - Recompensa: 250 moedas
- **Muro Triangular** (Dona Íris) - Recompensa: 200 moedas

#### Nível Pintor  
- **Piso em L** (Arquiteta Lúcia) - Recompensa: 650 moedas
- **Tampo de Mesa Redondo** (Marceneiro Davi) - Recompensa: 700 moedas

#### Nível Mestre
- **Pintar Contêiner** (Logística Global) - Recompensa: 1700 moedas

## 📐 Formas Geométricas

### 1. Retângulo
- **Fórmula**: Área = largura × altura
- **Dimensões**: Largura (5-15m), Altura (5-10m)

### 2. Triângulo
- **Fórmula**: Área = (base × altura) ÷ 2
- **Dimensões**: Base (6-18m), Altura (5-12m)

### 3. Círculo
- **Fórmula**: Área = π × raio² (usando π = 3.14)
- **Dimensões**: Raio (3-8m)
- **Observação**: Resultado deve ser arredondado

### 4. Forma em L
- **Fórmula**: Área = (w1 × h1) + (w2 × h2)
- **Dimensões**: 
  - Retângulo 1: w1 (8-15m), h1 (4-6m)
  - Retângulo 2: w2 (4-6m), h2 (6-10m)

### 5. Prisma Retangular (Área de Superfície)
- **Fórmula**: Área = 2(L×P + A×P + L×A)
- **Simplificada**: 2(P×A) + 4(L×A)
- **Dimensões**: Largura (12-18m), Altura (6-10m), Profundidade (3-5m)
- **Visualização**: Canvas com planificação 3D e medidas

## 🎨 Sistema de Tintas

### Tipos de Tinta (por cobertura)
1. **Tinta PP**: 10m² - 40 moedas
2. **Tinta P**: 20m² - 70 moedas  
3. **Tinta M**: 50m² - 150 moedas
4. **Tinta G**: 100m² - 280 moedas
5. **Tinta GG**: 200m² - 500 moedas

### Estratégia de Compra
- Jogador deve calcular área correta
- Comprar tinta suficiente para cobrir a área
- Otimizar custo vs. cobertura para maximizar lucro

## 🏆 Sistema de Pontuação

### Cenários de Sucesso
- **Acerto Total**: Área correta + tinta suficiente
  - Recebe recompensa completa
  - +10 pontos de reputação
  - Lucro = recompensa - custo da tinta

### Cenários de Falha
- **Erro no Cálculo**: Área incorreta
  - Perde custo da tinta
  - -5 pontos de reputação
  
- **Tinta Insuficiente**: Área correta, mas pouca tinta
  - Perde custo da tinta  
  - -10 pontos de reputação

## 🔊 Sistema de Áudio

### Música de Fundo
- **Arquivo**: `ost.mp3`
- **Comportamento**: Loop infinito, volume 30%
- **Controle**: Botão na barra superior (volume-up/mute)

### Efeitos Sonoros
- **Clique**: `click.mp3` (volume 50%) - Todos os cliques do mouse
- **Sucesso**: `acerto.mp3` (volume 70%) - Contrato concluído com êxito
- **Falha**: `falha.mp3` (volume 70%) - Erro no contrato

### Tecnologia de Áudio
- Autoplay inteligente com fallback para interação do usuário
- Compatibilidade com políticas de autoplay dos navegadores

## 🎯 Objetivos Educacionais

### Competências Desenvolvidas
1. **Cálculo de Áreas**: Diferentes formas geométricas
2. **Aplicação de Fórmulas**: Contexto prático e real
3. **Gestão de Recursos**: Otimização de custos
4. **Tomada de Decisão**: Análise custo-benefício
5. **Resolução de Problemas**: Geometria aplicada

### Metodologia
- **Aprendizagem por Descoberta**: Experimentação livre
- **Feedback Imediato**: Sons e mensagens de resultado
- **Progressão Gradual**: Complexidade crescente por nível
- **Gamificação**: Sistema de recompensas e progressão

## 🖥️ Aspectos Técnicos

### Tecnologias Utilizadas
- **HTML5**: Estrutura e canvas para visualizações
- **CSS3**: Styling com Tailwind CSS e Press Start 2P font
- **JavaScript**: Lógica do jogo e interatividade
- **Web Audio API**: Sistema de som

### Características da Interface
- **Design Retro**: Fonte pixelizada e cores vibrantes
- **Responsivo**: Adaptável a diferentes tamanhos de tela
- **Visual Claro**: Contraste alto para facilitar leitura
- **Navegação Intuitiva**: Telas bem organizadas

### Renderização de Formas
- **Formas Simples**: CSS puro (retângulo, triângulo, círculo, L)
- **Forma Complexa**: Canvas HTML5 com medidas (prisma)
- **Dimensões Dinâmicas**: Geradas aleatoriamente a cada contrato

## 🚀 Fluxo de Jogo

1. **Tela Inicial**: Escolher ação (Novo Contrato, Loja, Reputação)
2. **Novo Contrato**: Visualizar forma, dimensões e recompensa
3. **Cálculo**: Inserir área calculada
4. **Loja**: Comprar tintas necessárias
5. **Execução**: Tentar pintar (validação)
6. **Resultado**: Feedback com som e pontuação
7. **Progressão**: Retorno ao menu principal

## 📊 Balanceamento

### Economia do Jogo
- **Custo vs. Recompensa**: Margem de lucro variável
- **Risco vs. Recompensa**: Projetos maiores = maior recompensa/risco
- **Progressão**: Dificuldade e recompensas aumentam com o nível

### Dificuldade Progressiva
- **Aprendiz**: Formas básicas (retângulo, triângulo)
- **Pintor**: Formas compostas (L, círculo)
- **Mestre**: Geometria 3D (área de superfície)

---

## 🎓 Valor Educacional

O PintArte transforma o aprendizado de geometria em uma experiência lúdica e prática, onde conceitos abstratos ganham aplicação real através de simulação empresarial. O jogo incentiva tanto a precisão matemática quanto o pensamento estratégico, preparando estudantes para aplicações reais da geometria.
