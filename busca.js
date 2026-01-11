// js/busca.js - PÁGINA DE BUSCA
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se os sistemas foram inicializados
    if (!window.SelenaStreamTracker || !window.SelenaStreamTracker.storage) {
        console.error('Sistema não inicializado!');
        return;
    }

    const storage = window.SelenaStreamTracker.storage;
    const pointsSystem = window.SelenaStreamTracker.pointsSystem;
    const { formatNumber, calculateDaysToGoal } = window.SelenaStreamTracker;

    // Elementos DOM
    const searchInput = document.getElementById('searchInput');
    const musicTable = document.getElementById('musicTable');
    const musicTableBody = document.getElementById('musicTableBody');
    const totalResults = document.getElementById('totalResults');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const sortSelect = document.getElementById('sortSelect');
    const filterArtist = document.getElementById('filterArtist');
    const filterAlbum = document.getElementById('filterAlbum');

    // Variáveis de estado
    let allMusicData = [];
    let filteredMusicData = [];
    let currentSort = 'name-asc';
    let currentFilters = {
        artist: 'all',
        album: 'all'
    };

    // 1. INICIALIZAR
    initializePage();

    function initializePage() {
        // Carregar dados
        loadMusicData();
        
        // Configurar busca em tempo real
        setupSearch();
        
        // Configurar ordenação
        setupSorting();
        
        // Configurar filtros
        setupFilters();
        
        // Configurar sistema de login
        setupLoginSystem();
        
        // Atualizar informações do usuário
        updateUserInfo();
        
        // Configurar listener para AdSense (se necessário)
        setupAdSense();
    }

    function loadMusicData() {
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        
        // Simular carregamento
        setTimeout(() => {
            allMusicData = storage.getMusicData();
            
            // Ordenar por nome inicialmente
            allMusicData.sort((a, b) => a.name.localeCompare(b.name));
            
            // Atualizar filtros
            updateFilterOptions();
            
            // Mostrar todos os dados inicialmente
            filteredMusicData = [...allMusicData];
            renderTable();
            
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            
            // Adicionar pontos por usar busca
            const userData = storage.getUserData();
            if (userData.loggedIn) {
                if (!storage.hasCompletedTaskToday('search_music')) {
                    pointsSystem.awardPoints('search_music');
                    updateUserInfo();
                }
            }
        }, 500);
    }

    function updateFilterOptions() {
        // Atualizar filtro de artistas
        const artists = new Set();
        allMusicData.forEach(song => {
            if (song.artist) {
                // Separar artistas em colaborações
                const artistList = song.artist.split(' ft. ')[0].split(' & ')[0];
                artists.add(artistList.trim());
            }
        });
        
        if (filterArtist) {
            const currentValue = filterArtist.value;
            filterArtist.innerHTML = `
                <option value="all">Todos os Artistas</option>
                ${Array.from(artists).sort().map(artist => 
                    `<option value="${artist}" ${currentValue === artist ? 'selected' : ''}>${artist}</option>`
                ).join('')}
            `;
        }
        
        // Atualizar filtro de álbuns
        const albums = new Set();
        allMusicData.forEach(song => {
            if (song.album) {
                albums.add(song.album);
            }
        });
        
        if (filterAlbum) {
            const currentValue = filterAlbum.value;
            filterAlbum.innerHTML = `
                <option value="all">Todos os Álbuns</option>
                ${Array.from(albums).sort().map(album => 
                    `<option value="${album}" ${currentValue === album ? 'selected' : ''}>${album}</option>`
                ).join('')}
            `;
        }
    }

    function setupSearch() {
        if (!searchInput) return;
        
        // Busca em tempo real
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            filterAndSortData(searchTerm);
            
            // Mostrar/ocultar mensagem de sem resultados
            if (noResultsMessage) {
                if (searchTerm && filteredMusicData.length === 0) {
                    noResultsMessage.style.display = 'block';
                } else {
                    noResultsMessage.style.display = 'none';
                }
            }
        });
        
        // Foco no campo de busca
        searchInput.focus();
    }

    function setupSorting() {
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            filterAndSortData(searchInput ? searchInput.value.trim() : '');
        });
    }

    function setupFilters() {
        if (filterArtist) {
            filterArtist.addEventListener('change', function() {
                currentFilters.artist = this.value;
                filterAndSortData(searchInput ? searchInput.value.trim() : '');
            });
        }
        
        if (filterAlbum) {
            filterAlbum.addEventListener('change', function() {
                currentFilters.album = this.value;
                filterAndSortData(searchInput ? searchInput.value.trim() : '');
            });
        }
        
        // Botão limpar filtros
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                if (searchInput) searchInput.value = '';
                if (filterArtist) filterArtist.value = 'all';
                if (filterAlbum) filterAlbum.value = 'all';
                if (sortSelect) sortSelect.value = 'name-asc';
                
                currentSort = 'name-asc';
                currentFilters = { artist: 'all', album: 'all' };
                
                filterAndSortData('');
            });
        }
    }

    function filterAndSortData(searchTerm) {
        // Filtrar por termo de busca
        let filtered = allMusicData;
        
        if (searchTerm) {
            filtered = filtered.filter(song => 
                song.name.toLowerCase().includes(searchTerm) ||
                song.album.toLowerCase().includes(searchTerm) ||
                song.artist.toLowerCase().includes(searchTerm)
            );
        }
        
        // Aplicar filtros
        if (currentFilters.artist !== 'all') {
            filtered = filtered.filter(song => 
                song.artist.includes(currentFilters.artist)
            );
        }
        
        if (currentFilters.album !== 'all') {
            filtered = filtered.filter(song => 
                song.album === currentFilters.album
            );
        }
        
        // Ordenar
        filtered = sortMusicData(filtered, currentSort);
        
        filteredMusicData = filtered;
        renderTable();
    }

    function sortMusicData(data, sortType) {
        const sorted = [...data];
        
        switch(sortType) {
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'streams-asc':
                sorted.sort((a, b) => a.totalStreams - b.totalStreams);
                break;
            case 'streams-desc':
                sorted.sort((a, b) => b.totalStreams - a.totalStreams);
                break;
            case 'daily-asc':
                sorted.sort((a, b) => a.dailyStreams - b.dailyStreams);
                break;
            case 'daily-desc':
                sorted.sort((a, b) => b.dailyStreams - a.dailyStreams);
                break;
            case 'goal-asc':
                sorted.sort((a, b) => a.goal - b.goal);
                break;
            case 'goal-desc':
                sorted.sort((a, b) => b.goal - a.goal);
                break;
            case 'progress-asc':
                sorted.sort((a, b) => (a.totalStreams / a.goal) - (b.totalStreams / b.goal));
                break;
            case 'progress-desc':
                sorted.sort((a, b) => (b.totalStreams / b.goal) - (a.totalStreams / a.goal));
                break;
            default:
                sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        return sorted;
    }

    function renderTable() {
        if (!musicTableBody) return;
        
        if (filteredMusicData.length === 0) {
            musicTableBody.innerHTML = `
                <tr class="no-results-row">
                    <td colspan="8">
                        <div class="no-results">
                            <i class="fas fa-search"></i>
                            <p>Nenhuma música encontrada</p>
                            <p class="subtext">Tente outro termo de busca ou limpe os filtros</p>
                        </div>
                    </td>
                </tr>
            `;
            
            if (totalResults) {
                totalResults.textContent = '0 músicas';
            }
            
            return;
        }
        
        // Criar linhas da tabela
        const rows = filteredMusicData.map(song => {
            const daysToGoal = calculateDaysToGoal(song.totalStreams, song.goal, song.dailyStreams);
            const progress = (song.totalStreams / song.goal) * 100;
            const progressPercent = Math.min(100, Math.round(progress * 10) / 10);
            
            // Determinar cor do progresso
            let progressColor = '#8A2BE2'; // padrão roxo
            if (progressPercent >= 100) {
                progressColor = '#4CAF50'; // verde
            } else if (progressPercent >= 90) {
                progressColor = '#FF9800'; // laranja
            } else if (progressPercent >= 75) {
                progressColor = '#2196F3'; // azul
            }
            
            // Verificar se é colaboração
            const isCollab = song.artist.includes(' ft. ') || song.artist.includes(' & ');
            
            return `
                <tr class="music-row ${isCollab ? 'collab-row' : ''}" data-song-id="${song.id}">
                    <td>
                        <div class="song-info">
                            <div class="song-name">
                                <strong>${song.name}</strong>
                                ${isCollab ? '<span class="collab-badge"><i class="fas fa-user-friends"></i> Colab</span>' : ''}
                            </div>
                            <div class="song-meta">
                                <span class="album"><i class="fas fa-compact-disc"></i> ${song.album}</span>
                                <span class="artist"><i class="fas fa-user"></i> ${song.artist}</span>
                            </div>
                        </div>
                    </td>
                    <td class="text-center">
                        <span class="stream-count total-streams" title="${song.totalStreams.toLocaleString('pt-BR')}">
                            ${formatNumber(song.totalStreams)}
                        </span>
                    </td>
                    <td class="text-center">
                        <span class="stream-count daily-streams ${song.dailyStreams > 100000 ? 'highlight' : ''}" 
                              title="${song.dailyStreams.toLocaleString('pt-BR')}">
                            ${formatNumber(song.dailyStreams)}
                        </span>
                    </td>
                    <td class="text-center">
                        <span class="goal-count">${formatNumber(song.goal)}</span>
                    </td>
                    <td>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress" 
                                     style="width: ${progressPercent}%; background: ${progressColor}"
                                     title="${progressPercent}% da meta">
                                </div>
                            </div>
                            <span class="progress-text">${progressPercent}%</span>
                        </div>
                    </td>
                    <td class="text-center">
                        <span class="days-count ${daysToGoal <= 30 ? 'soon' : ''}">
                            ${daysToGoal === Infinity || daysToGoal <= 0 ? 'N/A' : `${daysToGoal} dias`}
                        </span>
                    </td>
                    <td class="text-center">
                        <button class="btn-small btn-details" data-song-id="${song.id}">
                            <i class="fas fa-info-circle"></i> Detalhes
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        
        musicTableBody.innerHTML = rows;
        
        // Atualizar contador de resultados
        if (totalResults) {
            totalResults.textContent = `${filteredMusicData.length} ${filteredMusicData.length === 1 ? 'música' : 'músicas'}`;
        }
        
        // Adicionar eventos aos botões de detalhes
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const songId = parseInt(this.dataset.songId);
                showSongDetails(songId);
            });
        });
        
        // Adicionar eventos às linhas (click para expandir)
        document.querySelectorAll('.music-row').forEach(row => {
            row.addEventListener('click', function(e) {
                if (!e.target.closest('.btn-details')) {
                    const songId = parseInt(this.dataset.songId);
                    toggleRowDetails(songId, this);
                }
            });
        });
    }

    function showSongDetails(songId) {
        const song = allMusicData.find(s => s.id === songId);
        if (!song) return;
        
        const daysToGoal = calculateDaysToGoal(song.totalStreams, song.goal, song.dailyStreams);
        const progress = (song.totalStreams / song.goal) * 100;
        const progressPercent = Math.min(100, Math.round(progress * 10) / 10);
        
        // Calcular estatísticas
        const dailyGrowth = ((song.dailyStreams / song.totalStreams) * 100).toFixed(3);
        const daysAtCurrentRate = Math.ceil((song.goal - song.totalStreams) / song.dailyStreams);
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + daysAtCurrentRate);
        
        const modalHTML = `
            <div class="modal" id="songDetailsModal" style="display: block;">
                <div class="modal-content" style="max-width: 600px;">
                    <span class="close-modal">&times;</span>
                    <h3><i class="fas fa-music"></i> Detalhes da Música</h3>
                    
                    <div class="song-details">
                        <div class="detail-header">
                            <h4>${song.name}</h4>
                            <div class="detail-badges">
                                ${song.isCollab ? '<span class="badge collab"><i class="fas fa-user-friends"></i> Colaboração</span>' : ''}
                                <span class="badge album">${song.album}</span>
                            </div>
                        </div>
                        
                        <div class="detail-info">
                            <p><strong><i class="fas fa-user"></i> Artista:</strong> ${song.artist}</p>
                            <p><strong><i class="fas fa-calendar"></i> Última atualização:</strong> ${new Date(song.lastUpdated).toLocaleDateString('pt-BR')}</p>
                        </div>
                        
                        <div class="detail-stats">
                            <div class="stat-card">
                                <div class="stat-icon" style="background: rgba(138, 43, 226, 0.1);">
                                    <i class="fas fa-chart-line" style="color: #8A2BE2;"></i>
                                </div>
                                <div class="stat-content">
                                    <span class="stat-label">Streams Totais</span>
                                    <span class="stat-value">${formatNumber(song.totalStreams)}</span>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon" style="background: rgba(76, 175, 80, 0.1);">
                                    <i class="fas fa-bolt" style="color: #4CAF50;"></i>
                                </div>
                                <div class="stat-content">
                                    <span class="stat-label">Streams Diários</span>
                                    <span class="stat-value">${formatNumber(song.dailyStreams)}</span>
                                    <span class="stat-subtext">${dailyGrowth}% do total</span>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon" style="background: rgba(255, 152, 0, 0.1);">
                                    <i class="fas fa-bullseye" style="color: #FF9800;"></i>
                                </div>
                                <div class="stat-content">
                                    <span class="stat-label">Meta</span>
                                    <span class="stat-value">${formatNumber(song.goal)}</span>
                                    <span class="stat-subtext">${progressPercent}% alcançado</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="progress-section">
                            <h5><i class="fas fa-chart-bar"></i> Progresso da Meta</h5>
                            <div class="progress-bar-large">
                                <div class="progress" style="width: ${progressPercent}%"></div>
                            </div>
                            <div class="progress-info">
                                <span>${formatNumber(song.totalStreams)} / ${formatNumber(song.goal)}</span>
                                <span>${progressPercent}%</span>
                            </div>
                        </div>
                        
                        <div class="estimation-section">
                            <h5><i class="fas fa-calculator"></i> Estimativas</h5>
                            <div class="estimations">
                                <div class="estimation">
                                    <i class="fas fa-clock"></i>
                                    <div>
                                        <strong>Tempo restante</strong>
                                        <p>${daysToGoal <= 0 ? 'Meta atingida!' : `${daysToGoal} dias`}</p>
                                    </div>
                                </div>
                                <div class="estimation">
                                    <i class="fas fa-calendar-check"></i>
                                    <div>
                                        <strong>Data estimada</strong>
                                        <p>${estimatedDate.toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>
                                <div class="estimation">
                                    <i class="fas fa-tachometer-alt"></i>
                                    <div>
                                        <strong>Taxa diária necessária</strong>
                                        <p>${formatNumber(Math.ceil((song.goal - song.totalStreams) / 365))}/dia para 1 ano</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-actions">
                            <button class="btn-primary" id="simulateThisSong">
                                <i class="fas fa-calculator"></i> Simular Meta
                            </button>
                            <button class="btn-secondary" id="compareWithOthers">
                                <i class="fas fa-chart-bar"></i> Comparar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar modal ao body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('songDetailsModal');
        
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
        
        // Botão de simulação
        const simulateBtn = document.getElementById('simulateThisSong');
        if (simulateBtn) {
            simulateBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                setTimeout(() => modal.remove(), 300);
                
                // Abrir modal de simulação
                openSimulationModal(song);
            });
        }
    }

    function openSimulationModal(song) {
        // Implementação similar à da home
        const modal = document.getElementById('simulationModal');
        if (!modal) return;
        
        // Preencher dados
        const songInput = document.getElementById('simulationSong');
        const currentInput = document.getElementById('simulationCurrent');
        const goalInput = document.getElementById('simulationGoal');
        
        if (songInput) songInput.value = song.name;
        if (currentInput) currentInput.value = formatNumber(song.totalStreams);
        if (goalInput) goalInput.value = formatNumber(song.goal);
        
        // Limpar resultado anterior
        const resultDiv = document.getElementById('simulationResult');
        if (resultDiv) {
            resultDiv.innerHTML = '';
            resultDiv.style.display = 'none';
        }
        
        // Mostrar modal
        modal.style.display = 'block';
    }

    function toggleRowDetails(songId, rowElement) {
        // Verificar se já existe detalhe expandido
        const existingDetails = rowElement.nextElementSibling;
        if (existingDetails && existingDetails.classList.contains('row-details')) {
            existingDetails.remove();
            rowElement.classList.remove('expanded');
            return;
        }
        
        // Remover detalhes de outras linhas
        document.querySelectorAll('.row-details').forEach(el => el.remove());
        document.querySelectorAll('.music-row.expanded').forEach(el => el.classList.remove('expanded'));
        
        // Adicionar detalhes
        const song = allMusicData.find(s => s.id === songId);
        if (!song) return;
        
        const detailsRow = document.createElement('tr');
        detailsRow.className = 'row-details';
        detailsRow.innerHTML = `
            <td colspan="8">
                <div class="row-details-content">
                    <div class="quick-stats">
                        <div class="quick-stat">
                            <span class="label">Média semanal:</span>
                            <span class="value">${formatNumber(song.dailyStreams * 7)}</span>
                        </div>
                        <div class="quick-stat">
                            <span class="label">Média mensal:</span>
                            <span class="value">${formatNumber(song.dailyStreams * 30)}</span>
                        </div>
                        <div class="quick-stat">
                            <span class="label">Alcance da meta:</span>
                            <span class="value">${((song.totalStreams / song.goal) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                    <div class="row-actions">
                        <button class="btn-small btn-simulate" data-song-id="${songId}">
                            <i class="fas fa-calculator"></i> Simular
                        </button>
                        <button class="btn-small btn-compare" data-song-id="${songId}">
                            <i class="fas fa-chart-bar"></i> Comparar
                        </button>
                        <button class="btn-small btn-share" data-song-id="${songId}">
                            <i class="fas fa-share-alt"></i> Compartilhar
                        </button>
                    </div>
                </div>
            </td>
        `;
        
        rowElement.classList.add('expanded');
        rowElement.parentNode.insertBefore(detailsRow, rowElement.nextSibling);
        
        // Adicionar eventos aos botões
        detailsRow.querySelector('.btn-simulate').addEventListener('click', function(e) {
            e.stopPropagation();
            showSongDetails(songId);
        });
    }

    function setupLoginSystem() {
        // Similar ao da home, mas simplificado
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

    function setupAdSense() {
        // Placeholder para integração com AdSense
        const adContainer = document.querySelector('.adsense-container');
        if (adContainer) {
            // Simular carregamento de anúncio
            setTimeout(() => {
                adContainer.innerHTML = `
                    <div class="ad-placeholder">
                        <i class="fas fa-ad"></i>
                        <p>Anúncio relacionado</p>
                        <small>Suporte o site permitindo anúncios</small>
                    </div>
                `;
            }, 1000);
        }
    }

    // CSS dinâmico para a página de busca
    const dynamicStyles = `
        <style>
            .music-row {
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .music-row:hover {
                background-color: rgba(138, 43, 226, 0.05);
            }
            
            .music-row.expanded {
                background-color: rgba(138, 43, 226, 0.1);
            }
            
            .collab-row {
                border-left: 3px solid #FF6B8B;
            }
            
            .collab-badge {
                background: linear-gradient(45deg, #FF6B8B, #FF4D6D);
                color: white;
                font-size: 0.7em;
                padding: 2px 8px;
                border-radius: 10px;
                margin-left: 8px;
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }
            
            .song-info {
                padding: 8px 0;
            }
            
            .song-name {
                display: flex;
                align-items: center;
                margin-bottom: 4px;
            }
            
            .song-meta {
                display: flex;
                gap: 15px;
                font-size: 0.9em;
                color: var(--text-secondary);
            }
            
            .album, .artist {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .stream-count {
                font-weight: bold;
                font-family: 'Courier New', monospace;
            }
            
            .total-streams {
                color: var(--primary-color);
            }
            
            .daily-streams {
                color: #4CAF50;
            }
            
            .daily-streams.highlight {
                background: rgba(76, 175, 80, 0.1);
                padding: 2px 8px;
                border-radius: 10px;
            }
            
            .goal-count {
                color: #FF9800;
                font-weight: bold;
            }
            
            .progress-container {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .progress-bar {
                flex: 1;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
            }
            
            .progress {
                height: 100%;
                border-radius: 4px;
            }
            
            .progress-text {
                font-size: 0.9em;
                min-width: 40px;
                text-align: right;
            }
            
            .days-count {
                font-weight: bold;
            }
            
            .days-count.soon {
                color: #FF9800;
                background: rgba(255, 152, 0, 0.1);
                padding: 2px 8px;
                border-radius: 10px;
            }
            
            .row-details {
                background: rgba(26, 26, 46, 0.5);
            }
            
            .row-details-content {
                padding: 20px;
                animation: fadeIn 0.3s ease;
            }
            
            .quick-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .quick-stat {
                background: rgba(255, 255, 255, 0.05);
                padding: 10px 15px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .quick-stat .label {
                display: block;
                font-size: 0.8em;
                color: var(--text-secondary);
                margin-bottom: 5px;
            }
            
            .quick-stat .value {
                display: block;
                font-weight: bold;
                color: var(--primary-color);
            }
            
            .row-actions {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .no-results-row td {
                padding: 50px 20px;
                text-align: center;
            }
            
            .no-results {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
                color: var(--text-secondary);
            }
            
            .no-results i {
                font-size: 48px;
                color: var(--primary-color);
                opacity: 0.5;
            }
            
            .no-results .subtext {
                font-size: 0.9em;
                opacity: 0.7;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            /* Estilos para o modal de detalhes */
            .song-details {
                margin-top: 20px;
            }
            
            .detail-header {
                margin-bottom: 20px;
            }
            
            .detail-header h4 {
                margin-bottom: 10px;
                color: white;
            }
            
            .detail-badges {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .badge {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8em;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                gap: 5px;
            }
            
            .badge.collab {
                background: rgba(255, 107, 139, 0.2);
                color: #FF6B8B;
                border: 1px solid rgba(255, 107, 139, 0.3);
            }
            
            .badge.album {
                background: rgba(138, 43, 226, 0.2);
                color: var(--primary-color);
                border: 1px solid rgba(138, 43, 226, 0.3);
            }
            
            .detail-info {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: var(--border-radius);
                margin-bottom: 20px;
            }
            
            .detail-info p {
                margin: 8px 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .detail-info strong {
                color: var(--primary-color);
                min-width: 180px;
            }
            
            .detail-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .stat-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .stat-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .stat-content {
                flex: 1;
            }
            
            .stat-label {
                display: block;
                font-size: 0.8em;
                color: var(--text-secondary);
                margin-bottom: 5px;
            }
            
            .stat-value {
                display: block;
                font-weight: bold;
                font-size: 1.2em;
                color: white;
            }
            
            .stat-subtext {
                display: block;
                font-size: 0.8em;
                color: var(--text-secondary);
                margin-top: 2px;
            }
            
            .progress-section {
                margin-bottom: 20px;
            }
            
            .progress-section h5 {
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .progress-bar-large {
                height: 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            
            .progress-info {
                display: flex;
                justify-content: space-between;
                font-size: 0.9em;
                color: var(--text-secondary);
            }
            
            .estimation-section {
                margin-bottom: 20px;
            }
            
            .estimation-section h5 {
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .estimations {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 15px;
            }
            
            .estimation {
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius);
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .estimation i {
                font-size: 1.5em;
                color: var(--primary-color);
            }
            
            .estimation strong {
                display: block;
                font-size: 0.9em;
                margin-bottom: 5px;
                color: white;
            }
            
            .estimation p {
                margin: 0;
                font-size: 0.9em;
                color: var(--text-secondary);
            }
            
            .detail-actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', dynamicStyles);
});
