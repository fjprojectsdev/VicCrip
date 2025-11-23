let token = localStorage.getItem('token');
const API_URL = window.location.origin;

// Verifica se já está logado
if (token) {
    showDashboard();
}

// Login
async function login() {
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    
    if (!password) {
        errorMsg.textContent = 'Digite a senha';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        if (res.ok) {
            const data = await res.json();
            token = data.token;
            localStorage.setItem('token', token);
            errorMsg.textContent = '';
            showDashboard();
        } else {
            errorMsg.textContent = 'Senha incorreta!';
        }
    } catch (error) {
        errorMsg.textContent = 'Erro ao conectar com o servidor';
        console.error(error);
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    location.reload();
}

// Mostra Dashboard
function showDashboard() {
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadDashboard();
}

// Carrega todos os dados
async function loadDashboard() {
    const headers = { 'Authorization': `Bearer ${token}` };
    
    try {
        const [stats, words, groups, admins, logs] = await Promise.all([
            fetch(`${API_URL}/api/stats`, { headers }).then(r => r.json()),
            fetch(`${API_URL}/api/banned-words`, { headers }).then(r => r.json()),
            fetch(`${API_URL}/api/allowed-groups`, { headers }).then(r => r.json()),
            fetch(`${API_URL}/api/admins`, { headers }).then(r => r.json()),
            fetch(`${API_URL}/api/logs`, { headers }).then(r => r.json())
        ]);

        // Atualiza estatísticas
        document.getElementById('bannedWords').textContent = stats.bannedWords;
        document.getElementById('allowedGroups').textContent = stats.allowedGroups;
        document.getElementById('admins').textContent = stats.admins;
        document.getElementById('lembretes').textContent = stats.lembretes;

        // Renderiza listas
        renderWords(words);
        renderGroups(groups);
        renderAdmins(admins);
        renderLogs(logs);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        if (error.message.includes('401') || error.message.includes('403')) {
            logout();
        }
    }
}

// Renderiza palavras banidas
function renderWords(words) {
    const container = document.getElementById('wordsList');
    
    if (words.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhuma palavra banida</div>';
        return;
    }

    container.innerHTML = words.map(word => `
        <div class="list-item">
            <span>${word}</span>
            <button class="btn btn-danger" onclick="removeWord('${word}')">Remover</button>
        </div>
    `).join('');
}

// Renderiza grupos
function renderGroups(groups) {
    const container = document.getElementById('groupsList');
    
    if (groups.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum grupo permitido</div>';
        return;
    }

    container.innerHTML = groups.map(group => `
        <div class="list-item">
            <span>${group}</span>
            <button class="btn btn-danger" onclick="removeGroup('${escapeHtml(group)}')">Remover</button>
        </div>
    `).join('');
}

// Renderiza admins
function renderAdmins(admins) {
    const container = document.getElementById('adminsList');
    
    if (admins.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum administrador cadastrado</div>';
        return;
    }

    container.innerHTML = admins.map(admin => `
        <div class="list-item">
            <span>${admin}</span>
            <span class="badge badge-success">Ativo</span>
        </div>
    `).join('');
}

// Renderiza logs
function renderLogs(logs) {
    const container = document.getElementById('logsList');
    
    if (logs.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum log disponível</div>';
        return;
    }

    container.innerHTML = logs.map(log => `
        <div class="log-item">
            <div class="log-time">${formatDate(log.timestamp)}</div>
            <div class="log-action">${log.action}</div>
        </div>
    `).join('');
}

// Adiciona palavra banida
async function addWord() {
    const input = document.getElementById('newWord');
    const word = input.value.trim();
    
    if (!word) return;
    
    try {
        const res = await fetch(`${API_URL}/api/banned-words`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word })
        });
        
        if (res.ok) {
            input.value = '';
            loadDashboard();
        }
    } catch (error) {
        console.error('Erro ao adicionar palavra:', error);
    }
}

// Remove palavra banida
async function removeWord(word) {
    if (!confirm(`Remover a palavra "${word}"?`)) return;
    
    try {
        const res = await fetch(`${API_URL}/api/banned-words/${encodeURIComponent(word)}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            loadDashboard();
        }
    } catch (error) {
        console.error('Erro ao remover palavra:', error);
    }
}

// Adiciona grupo
async function addGroup() {
    const input = document.getElementById('newGroup');
    const name = input.value.trim();
    
    if (!name) return;
    
    try {
        const res = await fetch(`${API_URL}/api/allowed-groups`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        
        if (res.ok) {
            input.value = '';
            loadDashboard();
        }
    } catch (error) {
        console.error('Erro ao adicionar grupo:', error);
    }
}

// Remove grupo
async function removeGroup(name) {
    if (!confirm(`Remover o grupo "${name}"?`)) return;
    
    try {
        const res = await fetch(`${API_URL}/api/allowed-groups/${encodeURIComponent(name)}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            loadDashboard();
        }
    } catch (error) {
        console.error('Erro ao remover grupo:', error);
    }
}

// Helpers
function formatDate(dateString) {
    if (!dateString) return 'Data inválida';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Auto-refresh a cada 30 segundos
setInterval(() => {
    if (token) {
        loadDashboard();
    }
}, 30000);
