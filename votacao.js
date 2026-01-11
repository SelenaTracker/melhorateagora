// js/votacao.js - PÁGINA DE VOTAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se os sistemas foram inicializados
    if (!window.SelenaStreamTracker || !window.SelenaStreamTracker.storage) {
        console.error('Sistema não inicializado!');
        return;
    }

    const storage = window.SelenaStreamTracker.storage;
    const pointsSystem = window.SelenaStreamTracker.pointsSystem;
    const { formatNumber, getTimeRemaining } = window.SelenaStreamTracker;

    // Elementos DOM
    const votingOptions = document.getElementById('votingOptions');
    const votingTimer = document.getElementById('votingTimer');
    const nextResetTime = document.getElementById('nextResetTime');
    const totalVotes = document.getElementById('totalVotes');
    const userVotingStatus = document.getElementById('userVotingStatus');
    const votingResultPreview = document.getElementById('votingResultPreview');
    const resultsChart = document.getElementById('resultsChart');
    
    // Música foco atual
    const currentFocusSong = document.getElementById('currentFocusSong');
    const currentFocusDescription = document.getElementById('currentFocusDescription');
    const focusSince = document.getElementById('focusSince');
    const focusVotes = document.getElementById('focusVotes');
    const focusTotalMini = document.getElementById('focusTotalMini');
    const focusGoalMini = document.getElementById('focusGoalMini');
    const focusProgressMini = document.getElementById('focusProgressMini');
    
    // Histórico
    const votingHistory = document.getElementById('votingHistory');
    const refreshHistoryBtn = document.getElementById('refreshHistory');
    const exportVotesBtn = document.getElementById('exportVotes');
    
    // Footer
    const totalVoters = document.getElementById('totalVoters');
    const totalVotesFooter = document.getElementById('totalVotesFooter');
    
    // Modais
    const voteConfirmationModal = document.getElementById('voteConfirmationModal');
    const voteResultModal = document.getElementById('voteResultModal');
    const simulateFocusBtn = document.getElementById('simulateFocusBtn');

    // Estado
    let selectedSong = null;
    let votingData = null;
    let userHasVoted = false;
    let voteOptions = [
        { id: 1, name: "A Year Without Rain", color: "#8A2BE2" },
        { id: 2, name: "Bluest Flame", color: "#2196F3" },
        { id: 3, name: "Only You", color: "#FF6B8B" },
        { id: 4, name: "Anxiety", color: "#4CAF50" }
    ];

    // 1. INICIALIZAR
    initializeVoting();

    function initializeVoting() {
        // Carregar dados da votação
        loadVotingData();
        
        // Configurar timer
        setupTimer();
        
        // Configurar opções de voto
        setupVotingOptions();
        
        // Carregar música foco atual
        loadCurrentFocus();
        
        // Carregar histórico
        loadVotingHistory();
        
        // Configurar sistema de login
        setupLoginSystem();
        
        // Atualizar informações do usuário
        updateUserInfo();
        
        // Configurar eventos
        setupEventListeners();
        
        // Atualizar timer a cada segundo
        setInterval(updateTimer, 1000);
    }

    function loadVotingData() {
        votingData = storage.getVotingData();
        
        if (!votingData) {
            // Inicializar dados de votação
            votingData = {
                currentVotes: {
                    "A Year Without Rain": 0,
                    "Bluest Flame": 0,
                    "Only You": 0,
                    "Anxiety": 0
                },
                totalVotes: 0,
                nextReset: storage.getNextResetTime(),
                votingHistory: [],
                currentVoters: []
            };
            storage.updateVotingData(votingData);
        }
        
        // Verificar se usuário já votou
        checkUserVotingStatus();
        
        // Atualizar contadores
        updateVoteCounters();
    }

    function checkUserVotingStatus() {
        const userData = storage.getUserData();
        const userIP = 'user-' + (userData.email || 'guest'); // Simulação de identificador
        
        userHasVoted = votingData.currentVoters.includes(userIP);
        
        if (userVotingStatus) {
            if (userHasVoted) {
                userVotingStatus.textContent = 'Já votou ✓';
                userVotingStatus.style.color = '#4CAF50';
            } else {
                userVotingStatus.textContent = 'Pode votar';
                userVotingStatus.style.color = '#FF9800';
            }
        }
    }

    function updateVoteCounters() {
        if (totalVotes) {
            totalVotes.textContent = votingData.totalVotes;
        }
        
        if (totalVotesFooter) {
            totalVotesFooter.textContent = votingData.totalVotes;
        }
        
        if (totalVoters) {
            totalVoters.textContent = votingData.currentVoters.length;
        }
    }

    function setupTimer() {
        updateTimer();
        
        if (nextResetTime) {
            const resetDate = new Date(votingData.nextReset);
            nextResetTime.textContent = resetDate.toLocaleString('pt-BR');
        }
    }

    function updateTimer() {
        const time = getTimeRemaining(votingData.nextReset);
        
        // Atualizar display
        document.getElementById('timerDays').textContent = 
            String(time.days).padStart(2, '0');
        document.getElementById('timerHours').textContent = 
            String(time.hours).padStart(2, '0');
        document.getElementById('timerMinutes').textContent = 
            String(time.minutes).padStart(2, '0');
        document.getElementById('timerSeconds').textContent = 
            String(time.seconds).padStart(2, '0');
        
        // Verificar se acabou o tempo
        if (time.total <= 0) {
            resetVoting();
        }
    }

    function resetVoting() {
        // Encontrar música mais votada
        const votes = votingData.currentVotes;
        let maxVotes = 0;
        let winningSong = null;
        
        Object.entries(votes).forEach(([songName, voteCount]) => {
            if (voteCount > maxVotes) {
                maxVotes = voteCount;
                winningSong = songName;
            }
        });
        
        // Registrar no histórico
        votingData.votingHistory.push({
            date: new Date().toISOString(),
            winner: winningSong,
            votes: maxVotes,
            totalVotes: votingData.totalVotes,
            voteDistribution: { ...votes }
        });
        
        // Resetar votação atual
        votingData.currentVotes = {
            "A Year Without Rain": 0,
            "Bluest Flame": 0,
            "Only You": 0,
            "Anxiety": 0
        };
        votingData.totalVotes = 0;
        votingData.currentVoters = [];
        votingData.nextReset = storage.getNextResetTime();
        
        storage.updateVotingData(votingData);
        
        // Atualizar música foco se houver vencedor
        if (winningSong) {
            updateFocusSong(winningSong, maxVotes);
        }
        
        // Recarregar dados
        loadVotingData();
        setupVotingOptions();
        loadCurrentFocus();
        
        // Mostrar notificação
        if (winningSong) {
            showNotification(`Votação encerrada! "${winningSong}" é a nova Música Foco!`, 'success');
        } else {
            showNotification('Votação reiniciada!', 'info');
        }
    }

    function updateFocusSong(songName, votes) {
        const focusSong = storage.getFocusSong();
        const musicData = storage.getMusicData();
        
        // Encontrar a música no banco de dados
        let song = musicData.find(s => 
            s.name.includes(songName) || songName.includes(s.name)
        );
        
        // Se não encontrar, usar a primeira opção de voto correspondente
        if (!song) {
            const voteOption = voteOptions.find(opt => opt.name === songName);
            if (voteOption) {
                // Encontrar música similar
                song = musicData.find(s => 
                    s.name.toLowerCase().includes(songName.toLowerCase()) ||
                    songName.toLowerCase().includes(s.name.toLowerCase())
                ) || musicData[0];
            }
        }
        
        if (song) {
            focusSong.previousSongs = focusSong.previousSongs || [];
            focusSong.previousSongs.push({
                songId: song.id,
                songName: song.name,
                date: new Date().toISOString(),
                votes: votes
            });
            
            focusSong.songId = song.id;
            focusSong.startDate = new Date().toISOString();
            focusSong.endDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            
            storage.updateFocusSong(focusSong);
        }
    }

    function setupVotingOptions() {
        if (!votingOptions) return;
        
        votingOptions.innerHTML = voteOptions.map(option => {
            const votes = votingData.currentVotes[option.name] || 0;
            const percentage = votingData.totalVotes > 0 ? 
                Math.round((votes / votingData.totalVotes) * 100) : 0;
            
            return `
                <div class="vote-option" data-song="${option.name}">
                    <div class="vote-option-header" style="border-left-color: ${option.color}">
                        <div class="song-icon">
                            <i class="fas fa-music"></i>
                        </div>
                        <div class="song-info">
                            <h4>${option.name}</h4>
                            <div class="song-stats">
                                <span class="votes-count">${votes} votos</span>
                                <span class="votes-percentage">${percentage}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="vote-option-content">
                        <div class="progress-bar">
                            <div class="progress" 
                                 style="width: ${percentage}%; background: ${option.color}">
                            </div>
                        </div>
                        <button class="btn-vote ${userHasVoted ? 'disabled' : ''}" 
                                data-song="${option.name}"
                                ${userHasVoted ? 'disabled' : ''}>
                            <i class="fas fa-vote-yea"></i>
                            ${userHasVoted ? 'Já Votou' : 'Votar nesta Música'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Adicionar eventos aos botões de voto
        document.querySelectorAll('.btn-vote:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', function() {
                const songName = this.dataset.song;
                selectSongForVoting(songName);
            });
        });
        
        // Mostrar/ocultar prévia dos resultados
        if (votingData.totalVotes > 0) {
            votingResultPreview.style.display = 'block';
            updateResultsChart();
        } else {
            votingResultPreview.style.display = 'none';
        }
    }

    function selectSongForVoting(songName) {
        const userData = storage.getUserData();
        
        if (!userData.loggedIn) {
            showNotification('Você precisa estar logado para votar!', 'error');
            document.getElementById('loginModal').style.display = 'block';
            return;
        }
        
        if (userHasVoted) {
            showNotification('Você já votou nesta rodada!', 'error');
            return;
        }
        
        selectedSong = songName;
        
        // Mostrar modal de confirmação
        showVoteConfirmationModal();
    }

    function showVoteConfirmationModal() {
        if (!selectedSong) return;
        
        const songInfo = voteOptions.find(opt => opt.name === selectedSong);
        const songElement = document.querySelector(`.vote-option[data-song="${selectedSong}"]`);
        
        // Atualizar informações no modal
        document.getElementById('selectedSongInfo').innerHTML = `
            <div class="selected-song-display" style="border-color: ${songInfo.color}">
                <div class="selected-song-icon">
                    <i class="fas fa-music" style="color: ${songInfo.color}"></i>
                </div>
                <div class="selected-song-details">
                    <h4>${selectedSong}</h4>
                    <p>${songElement.querySelector('.votes-count').textContent}</p>
                </div>
            </div>
        `;
        
        document.getElementById('confirmSongName').textContent = selectedSong;
        
        // Mostrar modal
        voteConfirmationModal.style.display = 'block';
        
        // Configurar eventos dos botões
        document.getElementById('cancelVote').onclick = function() {
            voteConfirmationModal.style.display = 'none';
            selectedSong = null;
        };
        
        document.getElementById('confirmVote').onclick = function() {
            submitVote();
            voteConfirmationModal.style.display = 'none';
        };
    }

    function submitVote() {
        if (!selectedSong || userHasVoted) return;
        
        const userData = storage.getUserData();
        const userIP = 'user-' + (userData.email || 'guest');
        
        // Registrar voto
        votingData.currentVotes[selectedSong]++;
        votingData.totalVotes++;
        votingData.currentVoters.push(userIP);
        
        storage.updateVotingData(votingData);
        
        // Atualizar estado do usuário
        userHasVoted = true;
        checkUserVotingStatus();
        
        // Adicionar pontos
        if (!storage.hasCompletedTaskToday('vote')) {
            pointsSystem.awardPoints('vote');
            updateUserInfo();
        }
        
        // Atualizar interface
        setupVotingOptions();
        updateVoteCounters();
        
        // Mostrar resultado
        showVoteResult();
        
        // Registrar no histórico do usuário
        const userHistory = userData.votingHistory || [];
        userHistory.push({
            date: new Date().toISOString(),
            song: selectedSong,
            cycle: votingData.nextReset
        });
        userData.votingHistory = userHistory;
        storage.updateUserData(userData);
        
        selectedSong = null;
    }

    function showVoteResult() {
        const votes = votingData.currentVotes[selectedSong] || 0;
        const total = votingData.totalVotes;
        const percentage = Math.round((votes / total) * 100);
        
        document.getElementById('voteResultContent').innerHTML = `
            <div class="vote-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Voto Registrado com Sucesso! 🎉</h3>
                <div class="vote-details">
                    <p>Você votou em: <strong>${selectedSong}</strong></p>
                    <div class="vote-stats">
                        <div class="vote-stat">
                            <span class="label">Seu voto é o:</span>
                            <span class="value">${votes}º</span>
                        </div>
                        <div class="vote-stat">
                            <span class="label">Porcentagem:</span>
                            <span class="value">${percentage}%</span>
                        </div>
                    </div>
                    <div class="vote-message">
                        <p>Obrigado por participar! A votação termina em:</p>
                        <div class="remaining-time">
                            <span id="resultTimer">Carregando...</span>
                        </div>
                    </div>
                </div>
                <div class="vote-actions">
                    <button class="btn-primary" id="closeResultModal">Continuar</button>
                    <button class="btn-secondary" id="shareVote">
                        <i class="fas fa-share-alt"></i> Compartilhar
                    </button>
                </div>
            </div>
        `;
        
        // Atualizar timer no modal
        function updateResultTimer() {
            const time = getTimeRemaining(votingData.nextReset);
            const timerElement = document.getElementById('resultTimer');
            if (timerElement) {
                timerElement.textContent = 
                    `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`;
            }
        }
        
        updateResultTimer();
        const timerInterval = setInterval(updateResultTimer, 1000);
        
        // Mostrar modal
        voteResultModal.style.display = 'block';
        
        // Configurar eventos
        document.getElementById('closeResultModal').onclick = function() {
            voteResultModal.style.display = 'none';
            clearInterval(timerInterval);
        };
        
        document.getElementById('shareVote').onclick = function() {
            shareVote();
        };
        
        // Fechar modal após 10 segundos
        setTimeout(() => {
            if (voteResultModal.style.display === 'block') {
                voteResultModal.style.display = 'none';
                clearInterval(timerInterval);
            }
        }, 10000);
    }

    function shareVote() {
        const text = `Acabei de votar em "${selectedSong}" na Música Foco do Dia da Selena Gomez! 🎵`;
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: 'Votei na Música Foco!',
                text: text,
                url: url
            });
        } else {
            // Fallback para copiar para área de transferência
            navigator.clipboard.writeText(`${text} ${url}`).then(() => {
                showNotification('Link copiado para a área de transferência!', 'success');
            });
        }
    }

    function updateResultsChart() {
        if (!resultsChart) return;
        
        const votes = votingData.currentVotes;
        const total = votingData.totalVotes;
        
        let chartHTML = '<div class="results-bars">';
        
        Object.entries(votes).forEach(([songName, voteCount]) => {
            const percentage = total > 0 ? Math.round((voteCount / total) * 100) : 0;
            const option = voteOptions.find(opt => opt.name === songName);
            const color = option ? option.color : '#8A2BE2';
            
            chartHTML += `
                <div class="result-bar">
                    <div class="bar-label">
                        <span class="song-name">${songName}</span>
                        <span class="song-votes">${voteCount} votos (${percentage}%)</span>
                    </div>
                    <div class="bar-container">
                        <div class="bar" style="width: ${percentage}%; background: ${color}"></div>
                    </div>
                </div>
            `;
        });
        
        chartHTML += '</div>';
        resultsChart.innerHTML = chartHTML;
    }

    function loadCurrentFocus() {
        const focusSong = storage.getFocusSong();
        if (!focusSong) return;
        
        const song = storage.getMusicById(focusSong.songId);
        if (!song) return;
        
        // Atualizar informações
        currentFocusSong.textContent = song.name;
        currentFocusDescription.textContent = 'Música mais votada da última rodada';
        
        if (focusSince) {
            const startDate = new Date(focusSong.startDate);
            focusSince.textContent = startDate.toLocaleDateString('pt-BR');
        }
        
        // Encontrar votos desta música
        const votes = votingData.votingHistory
            .filter(h => h.winner === song.name || song.name.includes(h.winner))
            .reduce((sum, h) => sum + (h.votes || 0), 0);
        
        if (focusVotes) {
            focusVotes.textContent = votes;
        }
        
        // Atualizar mini estatísticas
        focusTotalMini.textContent = formatNumber(song.totalStreams);
        focusGoalMini.textContent = formatNumber(song.goal);
        
        const progress = Math.round((song.totalStreams / song.goal) * 100);
        focusProgressMini.textContent = `${progress}%`;
        
        // Configurar botão de simulação
        if (simulateFocusBtn) {
            simulateFocusBtn.addEventListener('click', function() {
                openSimulationModal(song);
            });
        }
    }

    function openSimulationModal(song) {
        // Implementação similar à da home
        const modal = document.getElementById('simulationModal');
        if (!modal) {
            // Se não existe na página, criar dinamicamente
            createSimulationModal();
        }
        
        // Preencher dados
        const songInput = document.getElementById('simulationSong');
        const currentInput = document.getElementById('simulationCurrent');
        const goalInput = document.getElementById('simulationGoal');
        
        if (songInput) songInput.value = song.name;
        if (currentInput) currentInput.value = formatNumber(song.totalStreams);
        if (goalInput) goalInput.value = formatNumber(song.goal);
        
        // Mostrar modal
        modal.style.display = 'block';
    }

    function createSimulationModal() {
        const modalHTML = `
            <div class="modal" id="simulationModal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3><i class="fas fa-calculator"></i> Simulação de Meta</h3>
                    <div class="simulation-form">
                        <div class="form-group">
                            <label>Música:</label>
                            <input type="text" id="simulationSong" readonly>
                        </div>
                        <div class="form-group">
                            <label>Streams atuais:</label>
                            <input type="text" id="simulationCurrent" readonly>
                        </div>
                        <div class="form-group">
                            <label>Meta atual:</label>
                            <input type="text" id="simulationGoal" readonly>
                        </div>
                        <div class="form-group">
                            <label>Média diária esperada:</label>
                            <input type="number" id="dailyAverage" placeholder="Ex: 50000" min="1">
                        </div>
                        <button class="btn-primary" id="calculateSimulation">
                            <i class="fas fa-calculator"></i> Calcular
                        </button>
                        <div class="simulation-result" id="simulationResult"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Configurar eventos
        const modal = document.getElementById('simulationModal');
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        const calculateBtn = document.getElementById('calculateSimulation');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', function() {
                calculateSimulation();
            });
        }
    }

    function calculateSimulation() {
        const dailyAverage = parseInt(document.getElementById('dailyAverage').value) || 0;
        const songName = document.getElementById('simulationSong').value;
        const currentText = document.getElementById('simulationCurrent').value;
        const goalText = document.getElementById('simulationGoal').value;
        
        const current = parseNumber(currentText);
        const goal = parseNumber(goalText);
        
        if (!dailyAverage || dailyAverage <= 0) {
            const resultDiv = document.getElementById('simulationResult');
            resultDiv.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Insira uma média diária válida (maior que 0)</p>
                </div>
            `;
            resultDiv.style.display = 'block';
            return;
        }
        
        const days = Math.ceil((goal - current) / dailyAverage);
        const date = new Date();
        date.setDate(date.getDate() + days);
        
        const resultDiv = document.getElementById('simulationResult');
        resultDiv.innerHTML = `
            <div class="simulation-success">
                <i class="fas fa-calculator"></i>
                <h4>Resultado da Simulação</h4>
                <p>Para <strong>${songName}</strong>:</p>
                <p>Com média diária de <strong>${formatNumber(dailyAverage)} streams</strong>:</p>
                <p><strong>${days} dias</strong> para alcançar a meta</p>
                <p>Data estimada: <strong>${date.toLocaleDateString('pt-BR')}</strong></p>
                <p>Streams faltantes: <strong>${formatNumber(goal - current)}</strong></p>
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    function loadVotingHistory() {
        if (!votingHistory) return;
        
        const history = votingData.votingHistory;
        
        if (history.length === 0) {
            votingHistory.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-history"></i>
                    <p>Nenhuma votação registrada ainda</p>
                    <p class="subtext">As votações encerradas aparecerão aqui</p>
                </div>
            `;
            return;
        }
        
        votingHistory.innerHTML = history.slice(-10).reverse().map(item => {
            const date = new Date(item.date);
            const winnerVotes = item.votes || 0;
            const total = item.totalVotes || 0;
            const percentage = total > 0 ? Math.round((winnerVotes / total) * 100) : 0;
            
            // Calcular distribuição de votos
            const distribution = item.voteDistribution || {};
            const distributionHTML = Object.entries(distribution)
                .map(([song, votes]) => `
                    <div class="distribution-item">
                        <span class="song-name">${song}</span>
                        <span class="song-votes">${votes} (${Math.round((votes / total) * 100)}%)</span>
                    </div>
                `).join('');
            
            return `
                <div class="history-item">
                    <div class="history-header">
                        <span class="history-date">${date.toLocaleString('pt-BR')}</span>
                        <span class="history-winner">Vencedor: ${item.winner}</span>
                    </div>
                    <div class="history-content">
                        <div class="winner-info">
                            <div class="winner-stats">
                                <span class="stat">${winnerVotes} votos</span>
                                <span class="stat">${percentage}% do total</span>
                                <span class="stat">${total} votos totais</span>
                            </div>
                        </div>
                        <div class="distribution">
                            <h5>Distribuição de Votos:</h5>
                            <div class="distribution-list">
                                ${distributionHTML}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function setupEventListeners() {
        // Botão atualizar histórico
        if (refreshHistoryBtn) {
            refreshHistoryBtn.addEventListener('click', function() {
                loadVotingHistory();
                showNotification('Histórico atualizado!', 'info');
            });
        }
        
        // Botão exportar votos
        if (exportVotesBtn) {
            exportVotesBtn.addEventListener('click', exportVotingData);
        }
        
        // Fechar modais ao clicar fora
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });
        
        // Fechar modais com ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });
    }

    function exportVotingData() {
        if (votingData.votingHistory.length === 0) {
            showNotification('Nenhum dado para exportar!', 'info');
            return;
        }
        
        const exportData = {
            exportedAt: new Date().toISOString(),
            totalCycles: votingData.votingHistory.length,
            currentVotes: votingData.currentVotes,
            votingHistory: votingData.votingHistory
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `votacao-metas-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showNotification('Dados de votação exportados com sucesso!', 'success');
    }

    function setupLoginSystem() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const loginModal = document.getElementById('loginModal');
        
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
                
                // Recarregar status de voto
                checkUserVotingStatus();
                setupVotingOptions();
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

    // CSS dinâmico para a página de votação
    const dynamicStyles = `
        <style>
            .voting-timer-container {
                margin: 20px 0;
            }
            
            .timer-display {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 30px;
                margin-bottom: 20px;
            }
            
            @media (max-width: 768px) {
                .timer-display {
                    grid-template-columns: 1fr;
                }
            }
            
            .timer-section {
                text-align: center;
            }
            
            .timer-label {
                display: block;
                margin-bottom: 15px;
                color: var(--text-secondary);
                font-size: 1.1em;
            }
            
            .timer {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                font-family: 'Courier New', monospace;
            }
            
            .timer-unit {
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 60px;
            }
            
            .timer-number {
                font-size: 2.5em;
                font-weight: bold;
                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                line-height: 1;
            }
            
            .timer-label-small {
                font-size: 0.8em;
                color: var(--text-secondary);
                margin-top: 5px;
            }
            
            .timer-separator {
                font-size: 2em;
                font-weight: bold;
                color: var(--primary-color);
                margin-top: -10px;
            }
            
            .timer-info {
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .timer-info p {
                margin: 10px 0;
                display: flex;
                justify-content: space-between;
            }
            
            .timer-info strong {
                color: var(--primary-color);
            }
            
            .voting-phase {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
            
            .phase-indicator {
                flex: 1;
                text-align: center;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                border: 1px solid rgba(255, 255, 255, 0.1);
                opacity: 0.5;
                transition: var(--transition);
            }
            
            .phase-indicator.active {
                opacity: 1;
                border-color: var(--primary-color);
                background: rgba(138, 43, 226, 0.1);
            }
            
            .phase-indicator i {
                font-size: 1.5em;
                margin-bottom: 10px;
                display: block;
                color: var(--primary-color);
            }
            
            .voting-instructions {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            
            .instruction {
                background: rgba(138, 43, 226, 0.1);
                border-radius: var(--border-radius);
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
                border: 1px solid rgba(138, 43, 226, 0.2);
            }
            
            .instruction i {
                color: var(--primary-color);
                font-size: 1.2em;
            }
            
            .voting-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            
            .vote-option {
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: var(--transition);
            }
            
            .vote-option:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            }
            
            .vote-option-header {
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 15px;
                border-left: 4px solid;
            }
            
            .song-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5em;
            }
            
            .song-info h4 {
                margin: 0 0 5px 0;
                color: white;
            }
            
            .song-stats {
                display: flex;
                gap: 15px;
                font-size: 0.9em;
            }
            
            .votes-count {
                color: var(--text-secondary);
            }
            
            .votes-percentage {
                color: var(--primary-color);
                font-weight: bold;
            }
            
            .vote-option-content {
                padding: 20px;
                padding-top: 0;
            }
            
            .btn-vote {
                width: 100%;
                padding: 12px;
                background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
                color: white;
                border: none;
                border-radius: 30px;
                font-weight: bold;
                cursor: pointer;
                transition: var(--transition);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-top: 15px;
            }
            
            .btn-vote:hover:not(.disabled) {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(138, 43, 226, 0.4);
            }
            
            .btn-vote.disabled {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-secondary);
                cursor: not-allowed;
            }
            
            .results-bars {
                margin-top: 20px;
            }
            
            .result-bar {
                margin-bottom: 15px;
            }
            
            .bar-label {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 0.9em;
            }
            
            .song-name {
                color: white;
            }
            
            .song-votes {
                color: var(--text-secondary);
            }
            
            .bar-container {
                height: 10px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                overflow: hidden;
            }
            
            .bar {
                height: 100%;
                border-radius: 5px;
                transition: width 0.5s ease;
            }
            
            .current-focus {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr;
                gap: 30px;
                align-items: center;
            }
            
            @media (max-width: 1024px) {
                .current-focus {
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
            }
            
            .focus-song-info {
                display: flex;
                align-items: center;
                gap: 20px;
            }
            
            .song-cover {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2em;
                color: white;
            }
            
            .song-details h3 {
                margin: 0 0 10px 0;
                color: white;
            }
            
            .focus-meta {
                display: flex;
                gap: 20px;
                margin-top: 10px;
                color: var(--text-secondary);
                font-size: 0.9em;
            }
            
            .focus-meta i {
                margin-right: 5px;
            }
            
            .focus-stats-mini {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .mini-stat {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: var(--border-radius);
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .mini-stat .label {
                display: block;
                font-size: 0.8em;
                color: var(--text-secondary);
                margin-bottom: 5px;
            }
            
            .mini-stat .value {
                display: block;
                font-weight: bold;
                font-size: 1.2em;
                color: var(--primary-color);
            }
            
            .focus-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .rules-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .rule-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                padding: 20px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: var(--transition);
            }
            
            .rule-card:hover {
                border-color: var(--primary-color);
                transform: translateY(-5px);
            }
            
            .rule-icon {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: rgba(138, 43, 226, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 15px;
                font-size: 1.5em;
                color: var(--primary-color);
            }
            
            .rule-card h4 {
                margin: 0 0 10px 0;
                color: white;
            }
            
            .history-controls {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .voting-history {
                max-height: 500px;
                overflow-y: auto;
            }
            
            .history-item {
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                padding: 20px;
                margin-bottom: 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .history-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .history-date {
                color: var(--text-secondary);
            }
            
            .history-winner {
                color: var(--primary-color);
                font-weight: bold;
            }
            
            .winner-stats {
                display: flex;
                gap: 20px;
                margin-bottom: 15px;
            }
            
            .winner-stats .stat {
                background: rgba(138, 43, 226, 0.1);
                padding: 8px 15px;
                border-radius: 20px;
                color: var(--primary-color);
                font-weight: bold;
            }
            
            .distribution h5 {
                margin-bottom: 10px;
                color: var(--text-secondary);
            }
            
            .distribution-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 10px;
            }
            
            .distribution-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                font-size: 0.9em;
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
            
            .loading-history {
                text-align: center;
                padding: 40px;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255, 255, 255, 0.1);
                border-top-color: var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* Modais específicos da votação */
            .selected-song-display {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                border-left: 4px solid;
                margin-bottom: 20px;
            }
            
            .selected-song-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5em;
            }
            
            .confirmation-text {
                text-align: center;
                margin: 15px 0;
            }
            
            .warning-text {
                background: rgba(255, 152, 0, 0.1);
                border: 1px solid rgba(255, 152, 0, 0.3);
                border-radius: var(--border-radius);
                padding: 15px;
                margin: 20px 0;
                color: #FF9800;
            }
            
            .warning-text i {
                margin-right: 10px;
            }
            
            .confirmation-actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
            
            .vote-success {
                text-align: center;
                padding: 20px;
            }
            
            .success-icon {
                font-size: 60px;
                color: #4CAF50;
                margin-bottom: 20px;
            }
            
            .vote-details {
                margin: 25px 0;
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
            }
            
            .vote-stats {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin: 20px 0;
            }
            
            .vote-stat {
                text-align: center;
            }
            
            .vote-stat .label {
                display: block;
                color: var(--text-secondary);
                margin-bottom: 5px;
            }
            
            .vote-stat .value {
                display: block;
                font-size: 1.5em;
                font-weight: bold;
                color: var(--primary-color);
            }
            
            .remaining-time {
                font-family: 'Courier New', monospace;
                font-size: 1.2em;
                font-weight: bold;
                color: var(--primary-color);
                margin: 15px 0;
                padding: 10px;
                background: rgba(138, 43, 226, 0.1);
                border-radius: var(--border-radius);
            }
            
            .vote-actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
            
            .community-links, .community-rules {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 15px;
            }
            
            .community-links a, .community-rules a {
                display: flex;
                align-items: center;
                gap: 10px;
                color: var(--text-secondary);
                text-decoration: none;
                transition: var(--transition);
            }
            
            .community-links a:hover, .community-rules a:hover {
                color: var(--primary-color);
                padding-left: 5px;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', dynamicStyles);
});
