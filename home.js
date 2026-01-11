// js/home.js - PÁGINA HOME
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se os sistemas foram inicializados
    if (!window.SelenaStreamTracker || !window.SelenaStreamTracker.storage) {
        console.error('Sistema não inicializado!');
        return;
    }

    const storage = window.SelenaStreamTracker.storage;
    const goalSystem = window.SelenaStreamTracker.goalSystem;
    const pointsSystem = window.SelenaStreamTracker.pointsSystem;
    const { formatNumber, calculateDaysToGoal, calculateProgress } = window.SelenaStreamTracker;

    // 1. ATUALIZAR ESTATÍSTICAS
    updateStatistics();
    
    // 2. ATUALIZAR TOP ÁLBUNS
    updateTopAlbums();
    
    // 3. ATUALIZAR FOCO DO DIA
    updateFocusSong();
    
    // 4. ATUALIZAR METAS BATIDAS
    updateAchievedGoals();
    
    // 5. ATUALIZAR MÚSICAS EM DESTAQUE
    updateHighlightedSongs();
    
    // 6. CONFIGURAR SISTEMA DE LOGIN
    setupLoginSystem();
    
    // 7. CONFIGURAR MODAL DE SIMULAÇÃO
    setupSimulationModal();
    
    // 8. CONFIGURAR DASHBOARD DE METAS
    setupGoalDashboard();
    
    // 9. ATUALIZAR TIMER DE VOTAÇÃO
    updateVotingTimer();
    
    // 10. ATUALIZAR INFORMAÇÕES DO USUÁRIO
    updateUserInfo();

    // Função: Atualizar estatísticas
    function updateStatistics() {
        const musicData = storage.getMusicData();
        
        // Calcular totais
        const totalDaily = musicData.reduce((sum, song) => sum + song.dailyStreams, 0);
        const totalOverall = musicData.reduce((sum, song) => sum + song.totalStreams, 0);
        const totalSelena = musicData
            .filter(song => song.artist.includes('Selena Gomez') && !song.artist.includes('& The Scene'))
            .reduce((sum, song) => sum + song.totalStreams, 0);
        const totalScene = musicData
            .filter(song => song.artist.includes('Selena Gomez & The Scene'))
            .reduce((sum, song) => sum + song.totalStreams, 0);
        
        // Atualizar DOM
        document.getElementById('totalDiario').textContent = formatNumber(totalDaily);
        document.getElementById('totalGeral').textContent = formatNumber(totalOverall);
        document.getElementById('totalSelena').textContent = formatNumber(totalSelena);
        document.getElementById('totalScene').textContent = formatNumber(totalScene);
        
        // Estatísticas de metas
        const activeGoals = musicData.filter(song => song.totalStreams < song.goal).length;
        const totalGoals = musicData.length;
        const goalCompletionRate = ((totalGoals - activeGoals) / totalGoals * 100).toFixed(1);
        
        // Atualizar ou criar elemento de estatísticas de metas
        let goalStats = document.getElementById('goalStats');
        if (!goalStats) {
            const statsGrid = document.querySelector('.stats-grid');
            goalStats = document.createElement('div');
            goalStats.className = 'stat-box';
            goalStats.id = 'goalStats';
            goalStats.innerHTML = `
                <h3>Metas Ativas</h3>
                <p class="big-number">${activeGoals}/${totalGoals}</p>
                <p class="stat-label">${goalCompletionRate}% concluídas</p>
            `;
            statsGrid.appendChild(goalStats);
        } else {
            goalStats.innerHTML = `
                <h3>Metas Ativas</h3>
                <p class="big-number">${activeGoals}/${totalGoals}</p>
                <p class="stat-label">${goalCompletionRate}% concluídas</p>
            `;
        }
    }

    // Função: Atualizar top álbuns
    function updateTopAlbums() {
        const albumGrid = document.getElementById('albumGrid');
        const topAlbums = storage.getTopAlbums(6);
        
        albumGrid.innerHTML = topAlbums.map(album => `
            <div class="album-card" style="border-left-color: ${album.color}">
                <h3>${album.name}</h3>
                <p>${album.artist}</p>
                <div class="album-stats">
                    <div>
                        <span>Total</span>
                        <strong>${formatNumber(album.totalStreams)}</strong>
                    </div>
                    <div>
                        <span>Diário</span>
                        <strong>${formatNumber(album.dailyStreams)}</strong>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Função: Atualizar foco do dia
    function updateFocusSong() {
        const focusSongData = storage.getFocusSong();
        if (!focusSongData) return;
        
        const song = storage.getMusicById(focusSongData.songId);
        if (!song) return;
        
        const daysToGoal = calculateDaysToGoal(song.totalStreams, song.goal, song.dailyStreams);
        const progress = calculateProgress(song.totalStreams, song.goal);
        
        // Atualizar DOM
        document.getElementById('focusMusic').textContent = song.name;
        document.getElementById('focusDescription').textContent = 
            `Meta: alcançar ${formatNumber(song.goal)} streams`;
        document.getElementById('focusTotal').textContent = formatNumber(song.totalStreams);
        document.getElementById('focusMeta').textContent = formatNumber(song.goal);
        document.getElementById('focusRemaining').textContent = 
            daysToGoal === 0 ? 'Meta atingida!' : `${daysToGoal} dias`;
        
        // Atualizar barra de progresso
        const progressBar = document.getElementById('focusProgress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // Configurar botão de simulação
        const simulateBtn = document.getElementById('simulateBtn');
        if (simulateBtn) {
            simulateBtn.dataset.songId = song.id;
            simulateBtn.dataset.songName = song.name;
            simulateBtn.dataset.currentStreams = song.totalStreams;
            simulateBtn.dataset.goal = song.goal;
        }
    }

    // Função: Atualizar metas batidas
    function updateAchievedGoals() {
        const achievedGrid = document.getElementById('achievedGrid');
        const musicData = storage.getMusicData();
        
        // Encontrar músicas com progresso acima de 95%
        const nearlyAchieved = musicData
            .filter(song => {
                const progress = (song.totalStreams / song.goal) * 100;
                return progress >= 95 && progress < 100;
            })
            .sort((a, b) => (b.totalStreams / b.goal) - (a.totalStreams / a.goal))
            .slice(0, 6);
        
        if (nearlyAchieved.length === 0) {
            achievedGrid.innerHTML = `
                <div class="no-goals" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-bullseye" style="font-size: 48px; color: var(--primary-color); margin-bottom: 20px;"></i>
                    <p style="color: var(--text-secondary);">Nenhuma meta próxima de ser batida</p>
                </div>
            `;
            return;
        }
        
        achievedGrid.innerHTML = nearlyAchieved.map(song => {
            const progress = calculateProgress(song.totalStreams, song.goal);
            const progressColor = progress >= 100 ? '#4CAF50' : 
                                progress >= 95 ? '#FF9800' : '#8A2BE2';
            
            return `
                <div class="achieved-card">
                    <i class="fas fa-${progress >= 100 ? 'trophy' : 'bullseye'}" 
                       style="color: ${progressColor}"></i>
                    <h4>${song.name}</h4>
                    <p>Meta: ${formatNumber(song.goal)}</p>
                    <p>Atual: ${formatNumber(song.totalStreams)}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progress}%; background: ${progressColor}"></div>
                    </div>
                    <p class="achievement-text" style="color: ${progressColor}">
                        ${progress >= 100 ? '✅ Meta Batida!' : `${progress}% da meta`}
                    </p>
                </div>
            `;
        }).join('');
    }

    // Função: Atualizar músicas em destaque
    function updateHighlightedSongs() {
        const highlightedContainer = document.getElementById('highlightedSongs');
        if (!highlightedContainer) return;
        
        const musicData = storage.getMusicData();
        
        // Selecionar 6 músicas com maior crescimento diário
        const highlighted = [...musicData]
            .sort((a, b) => b.dailyStreams - a.dailyStreams)
            .slice(0, 6);
        
        highlightedContainer.innerHTML = highlighted.map(song => `
            <div class="highlight-song">
                <i class="fas fa-fire" style="color: #FF9800;"></i>
                <h5>${song.name.substring(0, 20)}${song.name.length > 20 ? '...' : ''}</h5>
                <p style="color: #4CAF50; font-weight: bold; margin: 5px 0;">
                    +${formatNumber(song.dailyStreams)}/dia
                </p>
                <p style="font-size: 0.9em; color: var(--text-secondary);">
                    ${formatNumber(song.totalStreams)} total
                </p>
            </div>
        `).join('');
    }

    // Função: Configurar dashboard de metas
    function setupGoalDashboard() {
        const checkGoalsBtn = document.getElementById('checkGoalsNow');
        const viewHistoryBtn = document.getElementById('viewGoalHistory');
        
        if (checkGoalsBtn) {
            checkGoalsBtn.addEventListener('click', function() {
                const updates = goalSystem.checkAndUpdateAllGoals();
                
                if (updates.length === 0) {
                    showNotification('Nenhuma meta precisa ser atualizada no momento.', 'info');
                } else {
                    showNotification(`${updates.length} meta(s) atualizada(s) automaticamente!`, 'success');
                    // Atualizar estatísticas
                    updateStatistics();
                    updateAchievedGoals();
                    updateFocusSong();
                }
            });
        }
        
        if (viewHistoryBtn) {
            viewHistoryBtn.addEventListener('click', showGoalHistoryModal);
        }
    }

    // Função: Modal de histórico de metas
    function showGoalHistoryModal() {
        const history = storage.getGoalUpdateHistory(20);
        
        const modalHTML = `
            <div class="modal" id="goalHistoryModal" style="display: block;">
                <div class="modal-content" style="max-width: 800px;">
                    <span class="close-modal">&times;</span>
                    <h3><i class="fas fa-history"></i> Histórico de Atualizações de Metas</h3>
                    <div class="history-container">
                        ${history.length > 0 ? `
                            <table class="history-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Música</th>
                                        <th>Meta Anterior</th>
                                        <th>Nova Meta</th>
                                        <th>Streams Diários</th>
                                        <th>Regra</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${history.map(record => `
                                        <tr>
                                            <td>${new Date(record.date).toLocaleDateString('pt-BR')}</td>
                                            <td><strong>${record.songName}</strong></td>
                                            <td>${formatNumber(record.oldGoal)}</td>
                                            <td><span class="goal-increase">${formatNumber(record.newGoal)}</span></td>
                                            <td>${formatNumber(record.dailyStreams)}</td>
                                            <td><small>${record.rule?.description || 'N/A'}</small></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : `
                            <div class="no-history">
                                <i class="fas fa-history"></i>
                                <p>Nenhuma atualização de meta registrada ainda.</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar modal ao body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('goalHistoryModal');
        
        // Fechar modal
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
        });
        
        // Fechar ao clicar fora
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    // Função: Configurar modal de simulação
    function setupSimulationModal() {
        const modal = document.getElementById('simulationModal');
        const closeBtn = modal?.querySelector('.close-modal');
        const simulateBtn = document.getElementById('simulateBtn');
        const calculateBtn = document.getElementById('calculateSimulation');
        
        if (!modal || !simulateBtn) return;
        
        // Abrir modal
        simulateBtn.addEventListener('click', function() {
            const songId = this.dataset.songId;
            const songName = this.dataset.songName;
            const currentStreams = this.dataset.currentStreams;
            const goal = this.dataset.goal;
            
            if (songId && songName) {
                document.getElementById('simulationSong').value = songName;
                document.getElementById('simulationCurrent').value = formatNumber(currentStreams);
                document.getElementById('simulationGoal').value = formatNumber(goal);
                document.getElementById('dailyAverage').value = '';
                document.getElementById('simulationResult').innerHTML = '';
                document.getElementById('simulationResult').style.display = 'none';
                
                modal.style.display = 'block';
            }
        });
        
        // Fechar modal
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
        
        // Fechar ao clicar fora
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Calcular simulação
        if (calculateBtn) {
            calculateBtn.addEventListener('click', function() {
                const dailyAverage = parseInt(document.getElementById('dailyAverage').value) || 0;
                const songId = simulateBtn.dataset.songId;
                const currentStreams = parseInt(simulateBtn.dataset.currentStreams);
                const goal = parseInt(simulateBtn.dataset.goal);
                
                if (!dailyAverage || dailyAverage <= 0) {
                    document.getElementById('simulationResult').innerHTML = `
                        <div class="error-message">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Insira uma média diária válida (maior que 0)</p>
                        </div>
                    `;
                    document.getElementById('simulationResult').style.display = 'block';
                    return;
                }
                
                const days = calculateDaysToGoal(currentStreams, goal, dailyAverage);
                const date = new Date();
                date.setDate(date.getDate() + days);
                
                // Simulação de próximas metas
                const simulation = goalSystem.simulateFutureGoals(
                    currentStreams, 
                    dailyAverage, 
                    goal, 
                    3
                );
                
                let simulationHTML = `
                    <div class="simulation-success">
                        <i class="fas fa-calculator"></i>
                        <h4>Resultado da Simulação</h4>
                        <p>Com média diária de <strong>${formatNumber(dailyAverage)} streams</strong>:</p>
                        <p><strong>${days} dias</strong> para alcançar a meta atual</p>
                        <p>Data estimada: <strong>${date.toLocaleDateString('pt-BR')}</strong></p>
                        <p>Streams faltantes: <strong>${formatNumber(goal - currentStreams)}</strong></p>
                `;
                
                if (simulation.length > 1) {
                    simulationHTML += `
                        <div class="future-goals">
                            <h5><i class="fas fa-chart-line"></i> Próximas Metas:</h5>
                            <ul>
                    `;
                    
                    simulation.slice(1).forEach(sim => {
                        simulationHTML += `
                            <li>
                                Meta ${sim.step}: ${formatNumber(sim.targetGoal)} 
                                (${sim.daysToReach} dias - ${sim.estimatedDate})
                            </li>
                        `;
                    });
                    
                    simulationHTML += `
                            </ul>
                        </div>
                    `;
                }
                
                simulationHTML += `</div>`;
                
                document.getElementById('simulationResult').innerHTML = simulationHTML;
                document.getElementById('simulationResult').style.display = 'block';
                
                // Adicionar pontos se usuário estiver logado
                const userData = storage.getUserData();
                if (userData.loggedIn) {
                    if (!storage.hasCompletedTaskToday('use_calculator')) {
                        pointsSystem.awardPoints('use_calculator');
                        updateUserInfo();
                    }
                }
            });
        }
    }

    // Função: Configurar sistema de login
    function setupLoginSystem() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        const closeModals = document.querySelectorAll('.close-modal');
        
        if (loginBtn) {
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
        
        // Botões de alternar entre login e registro
        const registerLink = document.getElementById('registerLink');
        const loginLink = document.getElementById('loginLink');
        
        if (registerLink) {
            registerLink.addEventListener('click', function(e) {
                e.preventDefault();
                loginModal.style.display = 'none';
                registerModal.style.display = 'block';
            });
        }
        
        if (loginLink) {
            loginLink.addEventListener('click', function(e) {
                e.preventDefault();
                registerModal.style.display = 'none';
                loginModal.style.display = 'block';
            });
        }
        
        // Fechar modais
        closeModals.forEach(btn => {
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
        
        // Submit login
        const submitLogin = document.getElementById('submitLogin');
        if (submitLogin) {
            submitLogin.addEventListener('click', function() {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                if (!email || !password) {
                    showNotification('Preencha todos os campos!', 'error');
                    return;
                }
                
                // Simulação de login (em produção, isso seria com backend)
                const userData = storage.getUserData();
                userData.loggedIn = true;
                userData.email = email;
                userData.username = email.split('@')[0];
                userData.lastLogin = new Date().toISOString();
                userData.lastActive = new Date().toISOString();
                
                // Verificar streak (login diário consecutivo)
                const lastLogin = userData.lastLogin ? new Date(userData.lastLogin) : null;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (lastLogin) {
                    lastLogin.setHours(0, 0, 0, 0);
                    const diffTime = today - lastLogin;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 1) {
                        userData.streak = (userData.streak || 0) + 1;
                    } else if (diffDays > 1) {
                        userData.streak = 1;
                    }
                } else {
                    userData.streak = 1;
                }
                
                storage.updateUserData(userData);
                
                // Adicionar pontos por login diário
                if (!storage.hasCompletedTaskToday('daily_login')) {
                    pointsSystem.awardPoints('daily_login');
                }
                
                // Incrementar contador de usuários (apenas na primeira vez)
                if (!userData.firstLogin) {
                    storage.incrementUserCount();
                    userData.firstLogin = new Date().toISOString();
                    storage.updateUserData(userData);
                }
                
                loginModal.style.display = 'none';
                updateUserInfo();
                showNotification(`Bem-vindo(a), ${userData.username}!`, 'success');
                
                // Limpar campos
                document.getElementById('loginEmail').value = '';
                document.getElementById('loginPassword').value = '';
            });
        }
        
        // Submit registro
        const submitRegister = document.getElementById('submitRegister');
        if (submitRegister) {
            submitRegister.addEventListener('click', function() {
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('registerConfirmPassword').value;
                
                if (!name || !email || !password || !confirmPassword) {
                    showNotification('Preencha todos os campos!', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showNotification('As senhas não coincidem!', 'error');
                    return;
                }
                
                if (password.length < 6) {
                    showNotification('A senha deve ter pelo menos 6 caracteres!', 'error');
                    return;
                }
                
                // Simulação de registro
                const userData = storage.getUserData();
                userData.loggedIn = true;
                userData.username = name;
                userData.email = email;
                userData.lastLogin = new Date().toISOString();
                userData.lastActive = new Date().toISOString();
                userData.streak = 1;
                userData.firstLogin = new Date().toISOString();
                
                storage.updateUserData(userData);
                storage.incrementUserCount();
                
                // Adicionar pontos por registro
                pointsSystem.awardPoints('daily_login');
                
                registerModal.style.display = 'none';
                updateUserInfo();
                showNotification(`Conta criada com sucesso, ${name}!`, 'success');
                
                // Limpar campos
                document.getElementById('registerName').value = '';
                document.getElementById('registerEmail').value = '';
                document.getElementById('registerPassword').value = '';
                document.getElementById('registerConfirmPassword').value = '';
            });
        }
    }

    // Função: Atualizar timer de votação
    function updateVotingTimer() {
        const timerHours = document.getElementById('timerHours');
        const timerMinutes = document.getElementById('timerMinutes');
        const timerSeconds = document.getElementById('timerSeconds');
        
        if (!timerHours || !timerMinutes || !timerSeconds) return;
        
        function updateTimer() {
            const votingData = storage.getVotingData();
            if (!votingData || !votingData.nextReset) return;
            
            const time = getTimeRemaining(votingData.nextReset);
            
            timerHours.textContent = String(time.hours + (time.days * 24)).padStart(2, '0');
            timerMinutes.textContent = String(time.minutes).padStart(2, '0');
            timerSeconds.textContent = String(time.seconds).padStart(2, '0');
            
            // Se o tempo acabou, atualizar a votação
            if (time.total <= 0) {
                updateVotingTimer();
                updateFocusSongFromVotes();
            }
        }
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // Função: Atualizar informações do usuário
    function updateUserInfo() {
        const userData = storage.getUserData();
        const userName = document.getElementById('userName');
        const userPoints = document.getElementById('userPoints');
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const totalUsers = document.getElementById('totalUsers');
        const totalSongs = document.getElementById('totalSongs');
        
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
        
        if (totalUsers) {
            totalUsers.textContent = storage.getTotalUsers();
        }
        
        if (totalSongs) {
            totalSongs.textContent = storage.getMusicData().length;
        }
    }

    // Função auxiliar para getTimeRemaining
    function getTimeRemaining(endTime) {
        const total = Date.parse(endTime) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        
        return {
            total,
            days,
            hours: hours + (days * 24),
            minutes,
            seconds
        };
    }

    // Função auxiliar para updateFocusSongFromVotes
    function updateFocusSongFromVotes() {
        const votingData = storage.getVotingData();
        const votes = votingData.currentVotes;
        
        let maxVotes = 0;
        let winningSong = null;
        
        Object.entries(votes).forEach(([songName, voteCount]) => {
            if (voteCount > maxVotes) {
                maxVotes = voteCount;
                winningSong = songName;
            }
        });
        
        if (winningSong) {
            const musicData = storage.getMusicData();
            const song = musicData.find(s => 
                s.name.includes(winningSong) || winningSong.includes(s.name)
            );
            
            if (song) {
                const focusSong = storage.getFocusSong();
                focusSong.previousSongs = focusSong.previousSongs || [];
                focusSong.previousSongs.push({
                    songId: song.id,
                    songName: song.name,
                    date: new Date().toISOString(),
                    votes: maxVotes
                });
                
                focusSong.songId = song.id;
                focusSong.startDate = new Date().toISOString();
                focusSong.endDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
                
                storage.updateFocusSong(focusSong);
                
                // Atualizar display
                updateFocusSong();
                
                showNotification(`"${song.name}" é a nova Música Foco do Dia!`, 'success');
            }
        }
    }

    // Newsletter subscription
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            const email = document.getElementById('newsletterEmail').value;
            
            if (!email || !email.includes('@')) {
                showNotification('Insira um e-mail válido!', 'error');
                return;
            }
            
            // Simular subscrição
            document.getElementById('newsletterEmail').value = '';
            showNotification('Inscrito na newsletter com sucesso!', 'success');
            
            // Adicionar pontos
            if (storage.getUserData().loggedIn) {
                pointsSystem.awardPoints('daily_login');
                updateUserInfo();
            }
        });
    }
});
