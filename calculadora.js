// js/calculadora.js - PÁGINA CALCULADORA
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se os sistemas foram inicializados
    if (!window.SelenaStreamTracker || !window.SelenaStreamTracker.storage) {
        console.error('Sistema não inicializado!');
        return;
    }

    const storage = window.SelenaStreamTracker.storage;
    const pointsSystem = window.SelenaStreamTracker.pointsSystem;
    const { formatNumber, parseNumber, calculateDaysToGoal } = window.SelenaStreamTracker;

    // Elementos DOM principais
    const currentStreamsInput = document.getElementById('currentStreams');
    const targetGoalInput = document.getElementById('targetGoal');
    const dailyAverageInput = document.getElementById('dailyAverage');
    const calculatorModeSelect = document.getElementById('calculatorMode');
    const calculateBtn = document.getElementById('calculateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exampleBtn = document.getElementById('exampleBtn');
    const calculatorResult = document.getElementById('calculatorResult');
    const calculationsHistory = document.getElementById('calculationsHistory');

    // Calculadoras avançadas
    const growthInitialInput = document.getElementById('growthInitial');
    const growthFinalInput = document.getElementById('growthFinal');
    const growthPeriodInput = document.getElementById('growthPeriod');
    const calculateGrowthBtn = document.getElementById('calculateGrowth');
    const growthResult = document.getElementById('growthResult');

    const projectionCurrentInput = document.getElementById('projectionCurrent');
    const projectionGrowthInput = document.getElementById('projectionGrowth');
    const projectionMonthsInput = document.getElementById('projectionMonths');
    const calculateProjectionBtn = document.getElementById('calculateProjection');
    const projectionResult = document.getElementById('projectionResult');

    const compareAInput = document.getElementById('compareA');
    const compareBInput = document.getElementById('compareB');
    const compareGoalInput = document.getElementById('compareGoal');
    const calculateCompareBtn = document.getElementById('calculateCompare');
    const compareResult = document.getElementById('compareResult');

    // Histórico
    const clearHistoryBtn = document.getElementById('clearHistory');
    const exportHistoryBtn = document.getElementById('exportHistory');

    // Estado
    let calculationHistory = JSON.parse(localStorage.getItem('calculatorHistory')) || [];

    // 1. INICIALIZAR
    initializeCalculator();

    function initializeCalculator() {
        // Configurar eventos
        setupEventListeners();
        
        // Carregar histórico
        loadCalculationHistory();
        
        // Configurar sistema de login
        setupLoginSystem();
        
        // Atualizar informações do usuário
        updateUserInfo();
        
        // Configurar exemplos
        setupExamples();
        
        // Configurar modo de cálculo
        setupCalculatorMode();
    }

    function setupEventListeners() {
        // Calculadora principal
        calculateBtn.addEventListener('click', calculateMain);
        clearBtn.addEventListener('click', clearCalculator);
        exampleBtn.addEventListener('click', loadRandomExample);
        
        // Tecla Enter para calcular
        [currentStreamsInput, targetGoalInput, dailyAverageInput].forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculateMain();
                }
            });
        });
        
        // Calculadoras avançadas
        calculateGrowthBtn.addEventListener('click', calculateGrowth);
        calculateProjectionBtn.addEventListener('click', calculateProjection);
        calculateCompareBtn.addEventListener('click', calculateComparison);
        
        // Histórico
        clearHistoryBtn.addEventListener('click', clearHistory);
        exportHistoryBtn.addEventListener('click', exportHistory);
        
        // Modo de cálculo
        calculatorModeSelect.addEventListener('change', updateCalculatorMode);
    }

    function setupExamples() {
        // Exemplos práticos
        document.querySelectorAll('.load-example').forEach(btn => {
            btn.addEventListener('click', function() {
                const current = this.dataset.current;
                const goal = this.dataset.goal;
                const daily = this.dataset.daily;
                
                currentStreamsInput.value = current;
                targetGoalInput.value = goal;
                dailyAverageInput.value = daily;
                
                showNotification('Exemplo carregado! Clique em Calcular.', 'info');
            });
        });
    }

    function setupCalculatorMode() {
        updateCalculatorMode();
    }

    function updateCalculatorMode() {
        const mode = calculatorModeSelect.value;
        
        // Atualizar placeholders baseados no modo
        switch(mode) {
            case 'days':
                currentStreamsInput.placeholder = "Ex: 598.745.231 ou 598M";
                targetGoalInput.placeholder = "Ex: 1.000.000.000 ou 1B";
                dailyAverageInput.placeholder = "Ex: 50.000 ou 50K";
                break;
            case 'daily':
                currentStreamsInput.placeholder = "Ex: 598.745.231 ou 598M";
                targetGoalInput.placeholder = "Ex: 1.000.000.000 ou 1B";
                dailyAverageInput.placeholder = "Dias disponíveis";
                break;
            case 'date':
                currentStreamsInput.placeholder = "Ex: 598.745.231 ou 598M";
                dailyAverageInput.placeholder = "Ex: 50.000 ou 50K";
                targetGoalInput.placeholder = "Data limite (DD/MM/AAAA)";
                break;
            case 'goal':
                currentStreamsInput.placeholder = "Ex: 598.745.231 ou 598M";
                dailyAverageInput.placeholder = "Ex: 50.000 ou 50K";
                targetGoalInput.placeholder = "Dias disponíveis";
                break;
        }
    }

    // 2. CÁLCULOS PRINCIPAIS
    function calculateMain() {
        const mode = calculatorModeSelect.value;
        let result;
        
        switch(mode) {
            case 'days':
                result = calculateDays();
                break;
            case 'daily':
                result = calculateRequiredDaily();
                break;
            case 'date':
                result = calculateByDate();
                break;
            case 'goal':
                result = calculateAchievableGoal();
                break;
        }
        
        if (result) {
            displayResult(result);
            saveToHistory(result);
            
            // Adicionar pontos
            const userData = storage.getUserData();
            if (userData.loggedIn) {
                if (!storage.hasCompletedTaskToday('use_calculator')) {
                    pointsSystem.awardPoints('use_calculator');
                    updateUserInfo();
                }
            }
        }
    }

    function calculateDays() {
        const current = parseNumber(currentStreamsInput.value);
        const goal = parseNumber(targetGoalInput.value);
        const daily = parseNumber(dailyAverageInput.value);
        
        // Validações
        if (!current || current <= 0) {
            showNotification('Insira um valor válido para streams atuais!', 'error');
            return null;
        }
        
        if (!goal || goal <= 0) {
            showNotification('Insira uma meta válida!', 'error');
            return null;
        }
        
        if (!daily || daily <= 0) {
            showNotification('Insira uma média diária válida!', 'error');
            return null;
        }
        
        if (current >= goal) {
            showNotification('A meta já foi alcançada!', 'info');
            return {
                type: 'days',
                current: current,
                goal: goal,
                daily: daily,
                days: 0,
                message: 'Meta já alcançada!',
                alreadyAchieved: true
            };
        }
        
        const days = calculateDaysToGoal(current, goal, daily);
        
        // Calcular data estimada
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + days);
        
        // Calcular progresso
        const progress = (current / goal) * 100;
        const remaining = goal - current;
        
        return {
            type: 'days',
            current: current,
            goal: goal,
            daily: daily,
            days: days,
            estimatedDate: estimatedDate,
            progress: progress,
            remaining: remaining,
            message: `Faltam ${days} dias para alcançar a meta`
        };
    }

    function calculateRequiredDaily() {
        const current = parseNumber(currentStreamsInput.value);
        const goal = parseNumber(targetGoalInput.value);
        const days = parseInt(dailyAverageInput.value) || 0;
        
        // Validações
        if (!current || current <= 0) {
            showNotification('Insira um valor válido para streams atuais!', 'error');
            return null;
        }
        
        if (!goal || goal <= 0) {
            showNotification('Insira uma meta válida!', 'error');
            return null;
        }
        
        if (!days || days <= 0) {
            showNotification('Insira um número de dias válido!', 'error');
            return null;
        }
        
        if (current >= goal) {
            return {
                type: 'daily',
                current: current,
                goal: goal,
                days: days,
                requiredDaily: 0,
                message: 'Meta já alcançada!',
                alreadyAchieved: true
            };
        }
        
        const remaining = goal - current;
        const requiredDaily = Math.ceil(remaining / days);
        
        // Comparar com média atual (se disponível)
        const currentDaily = 0; // Não temos essa informação aqui
        
        return {
            type: 'daily',
            current: current,
            goal: goal,
            days: days,
            requiredDaily: requiredDaily,
            remaining: remaining,
            message: `É necessário ${formatNumber(requiredDaily)} streams por dia`
        };
    }

    function calculateByDate() {
        const current = parseNumber(currentStreamsInput.value);
        const daily = parseNumber(dailyAverageInput.value);
        const dateString = targetGoalInput.value.trim();
        
        // Validações
        if (!current || current <= 0) {
            showNotification('Insira um valor válido para streams atuais!', 'error');
            return null;
        }
        
        if (!daily || daily <= 0) {
            showNotification('Insira uma média diária válida!', 'error');
            return null;
        }
        
        if (!dateString) {
            showNotification('Insira uma data válida!', 'error');
            return null;
        }
        
        // Parse da data (DD/MM/AAAA)
        const dateParts = dateString.split('/');
        if (dateParts.length !== 3) {
            showNotification('Formato de data inválido! Use DD/MM/AAAA', 'error');
            return null;
        }
        
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Mês começa em 0
        const year = parseInt(dateParts[2]);
        
        const targetDate = new Date(year, month, day);
        const today = new Date();
        
        if (isNaN(targetDate.getTime())) {
            showNotification('Data inválida!', 'error');
            return null;
        }
        
        if (targetDate <= today) {
            showNotification('A data deve ser futura!', 'error');
            return null;
        }
        
        // Calcular dias até a data
        const timeDiff = targetDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        // Calcular meta alcançável
        const achievableGoal = current + (daily * daysDiff);
        
        return {
            type: 'date',
            current: current,
            daily: daily,
            targetDate: targetDate,
            daysDiff: daysDiff,
            achievableGoal: achievableGoal,
            message: `Até ${targetDate.toLocaleDateString('pt-BR')} você alcançará aproximadamente ${formatNumber(achievableGoal)} streams`
        };
    }

    function calculateAchievableGoal() {
        const current = parseNumber(currentStreamsInput.value);
        const daily = parseNumber(dailyAverageInput.value);
        const days = parseInt(targetGoalInput.value) || 0;
        
        // Validações
        if (!current || current <= 0) {
            showNotification('Insira um valor válido para streams atuais!', 'error');
            return null;
        }
        
        if (!daily || daily <= 0) {
            showNotification('Insira uma média diária válida!', 'error');
            return null;
        }
        
        if (!days || days <= 0) {
            showNotification('Insira um número de dias válido!', 'error');
            return null;
        }
        
        const achievableGoal = current + (daily * days);
        
        return {
            type: 'goal',
            current: current,
            daily: daily,
            days: days,
            achievableGoal: achievableGoal,
            message: `Em ${days} dias você alcançará aproximadamente ${formatNumber(achievableGoal)} streams`
        };
    }

    // 3. CÁLCULOS AVANÇADOS
    function calculateGrowth() {
        const initial = parseNumber(growthInitialInput.value);
        const final = parseNumber(growthFinalInput.value);
        const period = parseInt(growthPeriodInput.value) || 0;
        
        if (!initial || !final || !period || period <= 0) {
            showNotification('Preencha todos os campos corretamente!', 'error');
            return;
        }
        
        if (initial <= 0) {
            showNotification('Streams iniciais devem ser maiores que 0!', 'error');
            return;
        }
        
        const growth = final - initial;
        const growthPercent = ((growth / initial) * 100).toFixed(2);
        const dailyGrowth = growth / period;
        const dailyGrowthPercent = ((dailyGrowth / initial) * 100).toFixed(3);
        
        growthResult.innerHTML = `
            <div class="advanced-result">
                <h4><i class="fas fa-chart-line"></i> Resultado do Crescimento</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="label">Crescimento Total:</span>
                        <span class="value">${formatNumber(growth)} streams</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Percentual Total:</span>
                        <span class="value">${growthPercent}%</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Crescimento Diário:</span>
                        <span class="value">${formatNumber(dailyGrowth)} streams/dia</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Percentual Diário:</span>
                        <span class="value">${dailyGrowthPercent}%/dia</span>
                    </div>
                </div>
            </div>
        `;
    }

    function calculateProjection() {
        const current = parseNumber(projectionCurrentInput.value);
        const growth = parseFloat(projectionGrowthInput.value) || 0;
        const months = parseInt(projectionMonthsInput.value) || 0;
        
        if (!current || current <= 0 || !growth || growth <= 0 || !months || months <= 0) {
            showNotification('Preencha todos os campos corretamente!', 'error');
            return;
        }
        
        let projected = current;
        let projections = [];
        
        for (let i = 1; i <= months; i++) {
            projected = projected * (1 + (growth / 100));
            projections.push({
                month: i,
                value: projected,
                growth: ((projected - current) / current * 100).toFixed(2)
            });
        }
        
        const totalGrowth = ((projected - current) / current * 100).toFixed(2);
        const monthlyAverage = ((projected - current) / months);
        
        let projectionsHTML = projections.map(p => `
            <div class="projection-item">
                <span>Mês ${p.month}:</span>
                <span>${formatNumber(Math.round(p.value))} (${p.growth}%)</span>
            </div>
        `).join('');
        
        projectionResult.innerHTML = `
            <div class="advanced-result">
                <h4><i class="fas fa-project-diagram"></i> Projeção de ${months} Meses</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="label">Valor Final:</span>
                        <span class="value">${formatNumber(Math.round(projected))}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Crescimento Total:</span>
                        <span class="value">${totalGrowth}%</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Média Mensal:</span>
                        <span class="value">${formatNumber(Math.round(monthlyAverage))}</span>
                    </div>
                </div>
                <div class="projections-list">
                    ${projectionsHTML}
                </div>
            </div>
        `;
    }

    function calculateComparison() {
        const dailyA = parseNumber(compareAInput.value);
        const dailyB = parseNumber(compareBInput.value);
        const goal = parseNumber(compareGoalInput.value);
        
        if (!dailyA || dailyA <= 0 || !dailyB || dailyB <= 0 || !goal || goal <= 0) {
            showNotification('Preencha todos os campos corretamente!', 'error');
            return;
        }
        
        const daysA = Math.ceil(goal / dailyA);
        const daysB = Math.ceil(goal / dailyB);
        const difference = Math.abs(daysA - daysB);
        const fasterBy = ((Math.max(dailyA, dailyB) - Math.min(dailyA, dailyB)) / Math.min(dailyA, dailyB) * 100).toFixed(1);
        
        let fasterMusic = dailyA > dailyB ? "Música A" : "Música B";
        let slowerMusic = dailyA > dailyB ? "Música B" : "Música A";
        
        compareResult.innerHTML = `
            <div class="advanced-result">
                <h4><i class="fas fa-balance-scale"></i> Comparação</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="label">Música A (${formatNumber(dailyA)}/dia):</span>
                        <span class="value">${daysA} dias</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Música B (${formatNumber(dailyB)}/dia):</span>
                        <span class="value">${daysB} dias</span>
                    </div>
                    <div class="result-item highlight">
                        <span class="label">Diferença:</span>
                        <span class="value">${difference} dias</span>
                    </div>
                </div>
                <div class="comparison-conclusion">
                    <p><strong>${fasterMusic}</strong> é <strong>${fasterBy}%</strong> mais rápida que <strong>${slowerMusic}</strong></p>
                    <p>Para alcançar ${formatNumber(goal)} streams:</p>
                    <ul>
                        <li>${fasterMusic}: ${daysA} dias</li>
                        <li>${slowerMusic}: ${daysB} dias</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // 4. EXIBIÇÃO DE RESULTADOS
    function displayResult(result) {
        let html = '';
        
        switch(result.type) {
            case 'days':
                html = displayDaysResult(result);
                break;
            case 'daily':
                html = displayDailyResult(result);
                break;
            case 'date':
                html = displayDateResult(result);
                break;
            case 'goal':
                html = displayGoalResult(result);
                break;
        }
        
        calculatorResult.innerHTML = html;
    }

    function displayDaysResult(result) {
        if (result.alreadyAchieved) {
            return `
                <div class="result-success">
                    <div class="result-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h3>Meta Já Alcançada! 🎉</h3>
                    <div class="result-stats">
                        <div class="stat">
                            <span class="label">Streams Atuais:</span>
                            <span class="value">${formatNumber(result.current)}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Meta:</span>
                            <span class="value">${formatNumber(result.goal)}</span>
                        </div>
                    </div>
                    <p class="congratulations">Parabéns! A meta já foi superada!</p>
                </div>
            `;
        }
        
        const progressPercent = Math.min(100, Math.round(result.progress * 10) / 10);
        const progressColor = progressPercent >= 90 ? '#4CAF50' : 
                            progressPercent >= 75 ? '#FF9800' : '#8A2BE2';
        
        return `
            <div class="result-days">
                <div class="result-header">
                    <h3><i class="fas fa-calendar-alt"></i> Dias para a Meta</h3>
                    <span class="result-badge">${result.days} dias</span>
                </div>
                
                <div class="result-summary">
                    <p>Com <strong>${formatNumber(result.daily)} streams por dia</strong>, 
                    você alcançará a meta em <strong>${result.days} dias</strong>.</p>
                </div>
                
                <div class="result-details">
                    <div class="detail-card">
                        <div class="detail-icon" style="background: rgba(138, 43, 226, 0.1);">
                            <i class="fas fa-bullseye" style="color: #8A2BE2;"></i>
                        </div>
                        <div class="detail-content">
                            <span class="label">Data Estimada</span>
                            <span class="value">${result.estimatedDate.toLocaleDateString('pt-BR')}</span>
                        </div>
                    </div>
                    
                    <div class="detail-card">
                        <div class="detail-icon" style="background: rgba(76, 175, 80, 0.1);">
                            <i class="fas fa-chart-line" style="color: #4CAF50;"></i>
                        </div>
                        <div class="detail-content">
                            <span class="label">Streams Faltantes</span>
                            <span class="value">${formatNumber(result.remaining)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="progress-section">
                    <div class="progress-header">
                        <span>Progresso Atual</span>
                        <span>${progressPercent}%</span>
                    </div>
                    <div class="progress-bar-large">
                        <div class="progress" style="width: ${progressPercent}%; background: ${progressColor};"></div>
                    </div>
                    <div class="progress-labels">
                        <span>${formatNumber(result.current)}</span>
                        <span>${formatNumber(result.goal)}</span>
                    </div>
                </div>
                
                <div class="result-tips">
                    <h4><i class="fas fa-lightbulb"></i> Dicas</h4>
                    <ul>
                        <li>Para reduzir o tempo pela metade, aumente para <strong>${formatNumber(result.daily * 2)} streams/dia</strong></li>
                        <li>Com ${formatNumber(Math.ceil(result.daily * 1.5))}/dia, alcançará em ${Math.ceil(result.days / 1.5)} dias</li>
                        <li>Média necessária para 30 dias: ${formatNumber(Math.ceil(result.remaining / 30))}/dia</li>
                    </ul>
                </div>
            </div>
        `;
    }

    function displayDailyResult(result) {
        if (result.alreadyAchieved) {
            return `
                <div class="result-success">
                    <div class="result-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h3>Meta Já Alcançada! 🎉</h3>
                    <p class="congratulations">Parabéns! A meta já foi superada!</p>
                </div>
            `;
        }
        
        return `
            <div class="result-daily">
                <div class="result-header">
                    <h3><i class="fas fa-chart-line"></i> Média Diária Necessária</h3>
                    <span class="result-badge">${formatNumber(result.requiredDaily)}/dia</span>
                </div>
                
                <div class="result-summary">
                    <p>Para alcançar <strong>${formatNumber(result.goal)} streams</strong> 
                    em <strong>${result.days} dias</strong>, você precisa de:</p>
                    <div class="daily-required">
                        <span class="required-number">${formatNumber(result.requiredDaily)}</span>
                        <span class="required-label">streams por dia</span>
                    </div>
                </div>
                
                <div class="result-breakdown">
                    <h4><i class="fas fa-calculator"></i> Detalhamento</h4>
                    <div class="breakdown-grid">
                        <div class="breakdown-item">
                            <span class="label">Streams atuais:</span>
                            <span class="value">${formatNumber(result.current)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="label">Meta:</span>
                            <span class="value">${formatNumber(result.goal)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="label">Faltam:</span>
                            <span class="value">${formatNumber(result.remaining)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="label">Dias disponíveis:</span>
                            <span class="value">${result.days}</span>
                        </div>
                    </div>
                </div>
                
                <div class="result-tips">
                    <h4><i class="fas fa-lightbulb"></i> Recomendações</h4>
                    <ul>
                        <li>Divida em metas diárias menores para acompanhar melhor</li>
                        <li>Aumente em 20% para ter uma margem de segurança</li>
                        <li>Revise o progresso semanalmente e ajuste se necessário</li>
                    </ul>
                </div>
            </div>
        `;
    }

    function displayDateResult(result) {
        return `
            <div class="result-date">
                <div class="result-header">
                    <h3><i class="fas fa-calendar-check"></i> Meta até a Data</h3>
                    <span class="result-badge">${formatNumber(result.achievableGoal)}</span>
                </div>
                
                <div class="result-summary">
                    <p>Com <strong>${formatNumber(result.daily)} streams por dia</strong>, 
                    até <strong>${result.targetDate.toLocaleDateString('pt-BR')}</strong> 
                    (daqui a <strong>${result.daysDiff} dias</strong>):</p>
                    <div class="achievable-goal">
                        <span class="goal-number">${formatNumber(result.achievableGoal)}</span>
                        <span class="goal-label">streams alcançáveis</span>
                    </div>
                </div>
                
                <div class="result-timeline">
                    <h4><i class="fas fa-road"></i> Linha do Tempo</h4>
                    <div class="timeline">
                        <div class="timeline-item today">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <strong>Hoje</strong>
                                <p>${formatNumber(result.current)} streams</p>
                            </div>
                        </div>
                        <div class="timeline-item future">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <strong>${result.targetDate.toLocaleDateString('pt-BR')}</strong>
                                <p>${formatNumber(result.achievableGoal)} streams</p>
                                <small>+${formatNumber(result.daily * result.daysDiff)} streams</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="result-growth">
                    <h4><i class="fas fa-chart-line"></i> Crescimento Estimado</h4>
                    <div class="growth-stats">
                        <div class="growth-stat">
                            <span class="label">Crescimento Total:</span>
                            <span class="value">${formatNumber(result.achievableGoal - result.current)}</span>
                        </div>
                        <div class="growth-stat">
                            <span class="label">Percentual:</span>
                            <span class="value">${(((result.achievableGoal - result.current) / result.current) * 100).toFixed(1)}%</span>
                        </div>
                        <div class="growth-stat">
                            <span class="label">Média Diária:</span>
                            <span class="value">${formatNumber(result.daily)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function displayGoalResult(result) {
        return `
            <div class="result-goal">
                <div class="result-header">
                    <h3><i class="fas fa-flag-checkered"></i> Meta Alcançável</h3>
                    <span class="result-badge">${formatNumber(result.achievableGoal)}</span>
                </div>
                
                <div class="result-summary">
                    <p>Com <strong>${formatNumber(result.daily)} streams por dia</strong> 
                    por <strong>${result.days} dias</strong>:</p>
                    <div class="final-goal">
                        <span class="goal-number">${formatNumber(result.achievableGoal)}</span>
                        <span class="goal-label">streams totais</span>
                    </div>
                </div>
                
                <div class="result-calculation">
                    <h4><i class="fas fa-calculator"></i> Cálculo</h4>
                    <div class="calculation-formula">
                        <p>${formatNumber(result.current)} + (${formatNumber(result.daily)} × ${result.days}) = ${formatNumber(result.achievableGoal)}</p>
                    </div>
                </div>
                
                <div class="result-milestones">
                    <h4><i class="fas fa-map-marker-alt"></i> Marcos Importantes</h4>
                    <div class="milestones-list">
                        ${generateMilestones(result.current, result.achievableGoal, result.days)}
                    </div>
                </div>
            </div>
        `;
    }

    function generateMilestones(current, goal, days) {
        const milestones = [
            { label: "Primeira semana", days: 7 },
            { label: "Primeiro mês", days: 30 },
            { label: "3 meses", days: 90 },
            { label: "6 meses", days: 180 }
        ];
        
        return milestones
            .filter(m => m.days <= days)
            .map(m => {
                const streams = current + ((goal - current) * (m.days / days));
                return `
                    <div class="milestone">
                        <span class="milestone-label">${m.label}:</span>
                        <span class="milestone-value">${formatNumber(Math.round(streams))} streams</span>
                    </div>
                `;
            }).join('');
    }

    // 5. HISTÓRICO
    function saveToHistory(result) {
        const historyItem = {
            id: Date.now(),
            type: result.type,
            timestamp: new Date().toISOString(),
            inputs: {
                current: currentStreamsInput.value,
                goal: targetGoalInput.value,
                daily: dailyAverageInput.value,
                mode: calculatorModeSelect.value
            },
            result: result
        };
        
        calculationHistory.unshift(historyItem);
        if (calculationHistory.length > 50) {
            calculationHistory.pop();
        }
        
        localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
        loadCalculationHistory();
    }

    function loadCalculationHistory() {
        if (!calculationsHistory) return;
        
        if (calculationHistory.length === 0) {
            calculationsHistory.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-history"></i>
                    <p>Nenhum cálculo salvo ainda</p>
                    <p class="subtext">Os cálculos que você fizer aparecerão aqui</p>
                </div>
            `;
            return;
        }
        
        calculationsHistory.innerHTML = calculationHistory.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-header">
                    <span class="history-date">${new Date(item.timestamp).toLocaleString('pt-BR')}</span>
                    <span class="history-type">${getTypeLabel(item.type)}</span>
                </div>
                <div class="history-content">
                    <div class="history-inputs">
                        <span>${item.inputs.current}</span>
                        <i class="fas fa-arrow-right"></i>
                        <span>${item.inputs.goal}</span>
                        <small>(${item.inputs.daily}/dia)</small>
                    </div>
                    <div class="history-result">
                        ${getHistoryResultPreview(item)}
                    </div>
                </div>
                <div class="history-actions">
                    <button class="btn-small btn-history-view" data-id="${item.id}">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-small btn-history-delete" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Adicionar eventos
        document.querySelectorAll('.btn-history-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                viewHistoryItem(id);
            });
        });
        
        document.querySelectorAll('.btn-history-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                deleteHistoryItem(id);
            });
        });
    }

    function getTypeLabel(type) {
        const labels = {
            'days': 'Dias Restantes',
            'daily': 'Média Diária',
            'date': 'Por Data',
            'goal': 'Meta Possível'
        };
        return labels[type] || type;
    }

    function getHistoryResultPreview(item) {
        switch(item.type) {
            case 'days':
                return `${item.result.days} dias`;
            case 'daily':
                return `${formatNumber(item.result.requiredDaily)}/dia`;
            case 'date':
                return `${formatNumber(item.result.achievableGoal)} streams`;
            case 'goal':
                return `${formatNumber(item.result.achievableGoal)} streams`;
            default:
                return 'Resultado';
        }
    }

    function viewHistoryItem(id) {
        const item = calculationHistory.find(h => h.id === id);
        if (!item) return;
        
        // Preencher campos
        currentStreamsInput.value = item.inputs.current;
        targetGoalInput.value = item.inputs.goal;
        dailyAverageInput.value = item.inputs.daily;
        calculatorModeSelect.value = item.inputs.mode;
        
        // Calcular novamente
        calculateMain();
        
        showNotification('Cálculo restaurado!', 'info');
    }

    function deleteHistoryItem(id) {
        calculationHistory = calculationHistory.filter(h => h.id !== id);
        localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
        loadCalculationHistory();
        showNotification('Cálculo removido do histórico', 'info');
    }

    function clearHistory() {
        if (calculationHistory.length === 0) return;
        
        if (confirm('Tem certeza que deseja limpar todo o histórico de cálculos?')) {
            calculationHistory = [];
            localStorage.removeItem('calculatorHistory');
            loadCalculationHistory();
            showNotification('Histórico limpo com sucesso!', 'success');
        }
    }

    function exportHistory() {
        if (calculationHistory.length === 0) {
            showNotification('Nenhum cálculo para exportar!', 'info');
            return;
        }
        
        const exportData = {
            exportedAt: new Date().toISOString(),
            totalCalculations: calculationHistory.length,
            calculations: calculationHistory
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `calculadora-metas-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showNotification('Histórico exportado com sucesso!', 'success');
    }

    // 6. UTILITÁRIOS
    function clearCalculator() {
        currentStreamsInput.value = '';
        targetGoalInput.value = '';
        dailyAverageInput.value = '';
        calculatorResult.innerHTML = `
            <div class="result-placeholder">
                <i class="fas fa-calculator"></i>
                <h3>Resultado da Calculadora</h3>
                <p>Preencha os campos e clique em Calcular</p>
            </div>
        `;
        
        // Limpar também as calculadoras avançadas
        if (growthInitialInput) growthInitialInput.value = '';
        if (growthFinalInput) growthFinalInput.value = '';
        if (growthPeriodInput) growthPeriodInput.value = '';
        if (growthResult) growthResult.innerHTML = '';
        
        if (projectionCurrentInput) projectionCurrentInput.value = '';
        if (projectionGrowthInput) projectionGrowthInput.value = '';
        if (projectionMonthsInput) projectionMonthsInput.value = '';
        if (projectionResult) projectionResult.innerHTML = '';
        
        if (compareAInput) compareAInput.value = '';
        if (compareBInput) compareBInput.value = '';
        if (compareGoalInput) compareGoalInput.value = '';
        if (compareResult) compareResult.innerHTML = '';
        
        showNotification('Calculadora limpa!', 'info');
    }

    function loadRandomExample() {
        const examples = [
            { current: "150.000.000", goal: "200.000.000", daily: "50.000" },
            { current: "500.000", goal: "1.000.000", daily: "10.000" },
            { current: "2.5M", goal: "3M", daily: "100K" },
            { current: "750.000.000", goal: "1B", daily: "250K" }
        ];
        
        const random = examples[Math.floor(Math.random() * examples.length)];
        
        currentStreamsInput.value = random.current;
        targetGoalInput.value = random.goal;
        dailyAverageInput.value = random.daily;
        
        showNotification('Exemplo carregado! Clique em Calcular.', 'info');
    }

    // 7. SISTEMA DE LOGIN (simplificado)
    function setupLoginSystem() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        
        if (loginBtn && loginModal) {
            loginBtn.addEventListener('click', function() {
                loginModal.style.display = 'block';
            });
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                const userData = storage.getUserData();
                userData.loggedIn = false;
                userData.lastActive = new Date().toISOString();
                storage.updateUserData(userData);
                
                updateUserInfo();
                showNotification('Logout realizado com sucesso!', 'info');
            });
        }
        
        // Fechar modais
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) modal.style.display = 'none';
            });
        });
        
        // Fechar ao clicar fora
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });
        
        // Login simplificado
        const submitLogin = document.getElementById('submitLoginCalc');
        if (submitLogin) {
            submitLogin.addEventListener('click', function() {
                const email = document.getElementById('loginEmailCalc').value;
                const password = document.getElementById('loginPasswordCalc').value;
                
                if (!email || !password) {
                    showNotification('Preencha todos os campos!', 'error');
                    return;
                }
                
                const userData = storage.getUserData();
                userData.loggedIn = true;
                userData.email = email;
                userData.username = email.split('@')[0];
                userData.lastLogin = new Date().toISOString();
                
                storage.updateUserData(userData);
                loginModal.style.display = 'none';
                updateUserInfo();
                showNotification(`Bem-vindo(a), ${userData.username}!`, 'success');
            });
        }
    }

    function updateUserInfo() {
        const userData = storage.getUserData();
        const userName = document.getElementById('userName');
        const userPoints = document.getElementById('userPoints');
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (userName) {
            userName.textContent = userData.loggedIn ? 
                (userData.username || 'Usuário') : 'Visitante';
        }
        
        if (userPoints) {
            const points = storage.getPoints();
            userPoints.textContent = `${points} ponto${points !== 1 ? 's' : ''}`;
        }
        
        if (loginBtn && logoutBtn) {
            if (userData.loggedIn) {
                loginBtn.style.display = 'none';
                logoutBtn.style.display = 'block';
            } else {
                loginBtn.style.display = 'block';
                logoutBtn.style.display = 'none';
            }
        }
    }

    // 8. CSS DINÂMICO
    const dynamicStyles = `
        <style>
            .calculator-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
            }
            
            @media (max-width: 1024px) {
                .calculator-grid {
                    grid-template-columns: 1fr;
                }
            }
            
            .calculator-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .input-with-help {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .help-tooltip {
                position: relative;
                cursor: help;
            }
            
            .tooltip-text {
                display: none;
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: var(--card-bg);
                color: var(--text-color);
                padding: 10px 15px;
                border-radius: var(--border-radius);
                border: 1px solid var(--primary-color);
                width: 200px;
                font-size: 0.9em;
                z-index: 1000;
                box-shadow: var(--box-shadow);
            }
            
            .help-tooltip:hover .tooltip-text {
                display: block;
            }
            
            .input-examples {
                margin-top: 5px;
                color: var(--text-secondary);
                font-size: 0.9em;
            }
            
            .calculator-actions {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            
            .calculator-result {
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                padding: 25px;
                border: 1px solid rgba(138, 43, 226, 0.2);
                min-height: 300px;
            }
            
            .result-placeholder {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: var(--text-secondary);
                text-align: center;
            }
            
            .result-placeholder i {
                font-size: 48px;
                margin-bottom: 20px;
                color: var(--primary-color);
                opacity: 0.5;
            }
            
            .result-success {
                text-align: center;
                padding: 20px;
            }
            
            .result-icon {
                font-size: 48px;
                color: #4CAF50;
                margin-bottom: 20px;
            }
            
            .result-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .result-badge {
                background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 1.2em;
            }
            
            .result-summary {
                margin-bottom: 25px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
            }
            
            .daily-required, .achievable-goal, .final-goal {
                text-align: center;
                margin: 20px 0;
            }
            
            .required-number, .goal-number {
                font-size: 3em;
                font-weight: bold;
                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                display: block;
                line-height: 1;
            }
            
            .required-label, .goal-label {
                display: block;
                color: var(--text-secondary);
                margin-top: 5px;
                font-size: 1.1em;
            }
            
            .result-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 25px;
            }
            
            .detail-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .detail-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .detail-content {
                flex: 1;
            }
            
            .detail-content .label {
                display: block;
                font-size: 0.9em;
                color: var(--text-secondary);
                margin-bottom: 5px;
            }
            
            .detail-content .value {
                display: block;
                font-weight: bold;
                font-size: 1.1em;
                color: white;
            }
            
            .progress-section {
                margin-bottom: 25px;
            }
            
            .progress-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 0.9em;
            }
            
            .progress-bar-large {
                height: 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            
            .progress-labels {
                display: flex;
                justify-content: space-between;
                font-size: 0.9em;
                color: var(--text-secondary);
            }
            
            .result-tips {
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .result-tips h4 {
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .result-tips ul {
                list-style: none;
                padding-left: 0;
            }
            
            .result-tips li {
                margin-bottom: 8px;
                padding-left: 25px;
                position: relative;
            }
            
            .result-tips li:before {
                content: '💡';
                position: absolute;
                left: 0;
            }
            
            .examples-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .example-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: var(--transition);
            }
            
            .example-card:hover {
                transform: translateY(-5px);
                border-color: var(--primary-color);
            }
            
            .example-header {
                background: rgba(138, 43, 226, 0.1);
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .example-header i {
                font-size: 24px;
            }
            
            .example-header h4 {
                margin: 0;
            }
            
            .example-content {
                padding: 15px;
            }
            
            .example-content p {
                margin: 8px 0;
            }
            
            .advanced-calculators {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .advanced-calculator {
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .advanced-calculator h3 {
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .calc-form {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .calc-result {
                margin-top: 15px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .advanced-result h4 {
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .result-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .result-item {
                background: rgba(255, 255, 255, 0.05);
                padding: 10px;
                border-radius: 8px;
            }
            
            .result-item.highlight {
                background: rgba(138, 43, 226, 0.1);
                border: 1px solid var(--primary-color);
            }
            
            .result-item .label {
                display: block;
                font-size: 0.8em;
                color: var(--text-secondary);
                margin-bottom: 5px;
            }
            
            .result-item .value {
                display: block;
                font-weight: bold;
            }
            
            .history-controls {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .calculations-history {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .history-item {
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                padding: 15px;
                margin-bottom: 10px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: var(--transition);
            }
            
            .history-item:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(138, 43, 226, 0.3);
            }
            
            .history-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 0.9em;
            }
            
            .history-date {
                color: var(--text-secondary);
            }
            
            .history-type {
                background: rgba(138, 43, 226, 0.2);
                color: var(--primary-color);
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 0.8em;
                font-weight: bold;
            }
            
            .history-content {
                margin-bottom: 10px;
            }
            
            .history-inputs {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 8px;
                flex-wrap: wrap;
            }
            
            .history-result {
                font-weight: bold;
                color: var(--primary-color);
            }
            
            .history-actions {
                display: flex;
                gap: 5px;
                justify-content: flex-end;
            }
            
            .empty-history {
                text-align: center;
                padding: 40px;
                color: var(--text-secondary);
            }
            
            .empty-history i {
                font-size: 48px;
                margin-bottom: 20px;
                color: var(--primary-color);
                opacity: 0.5;
            }
            
            .subtext {
                font-size: 0.9em;
                opacity: 0.7;
            }
            
            /* Animação de entrada */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .calculator-result > div {
                animation: fadeIn 0.5s ease;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', dynamicStyles);
});
