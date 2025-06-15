

let todasReceitas = [];
let receitasFiltradas = [];

// Sistema de Favoritos
function getFavoritos() {
    return JSON.parse(localStorage.getItem('favoritos')) || [];
}

function toggleFavorito(id) {
    const favoritos = getFavoritos();
    const index = favoritos.indexOf(id);
    
    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push(id);
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    displayReceitas(receitasFiltradas); // Atualiza a exibição
}

function isFavorito(id) {
    return getFavoritos().includes(id);
}

// Fetch recipes from JSON Server
async function fetchReceitas() {
    try {
        console.log('Buscando receitas da API...');
        const response = await fetch('/receitas');
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const receitas = await response.json();
        console.log('Receitas carregadas:', receitas.length);
        
        todasReceitas = receitas;
        receitasFiltradas = receitas;
        displayReceitas(receitas);
        configurarPesquisa();
    } catch (error) {
        console.error('Error fetching recipes:', error);
        showErrorMessage();
    }
}

// Display recipes in the container
function displayReceitas(receitas) {
    const container = document.getElementById('receitas-container');
    if (!container) return;

    container.innerHTML = receitas.map(receita => {
        const favorito = isFavorito(receita.id);
        const coracao = favorito ? '❤️' : '🤍';
        const classFavorito = favorito ? 'favorito' : '';
        
        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100 ${classFavorito}" data-id="${receita.id}">
                    <img src="${receita.imagem}" class="card-img-top" alt="${receita.titulo}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title flex-grow-1">${receita.titulo}</h5>
                            <button class="btn btn-link p-0 ms-2 btn-favorito" onclick="toggleFavorito(${receita.id})" title="Adicionar aos favoritos">
                                <span style="font-size: 1.5rem;">${coracao}</span>
                            </button>
                        </div>
                        <p class="card-text flex-grow-1">${receita.descricao}</p>
                        <div class="mb-2">
                            <small class="text-muted">
                                <span class="badge bg-success">${receita.categoria}</span>
                                <span class="badge bg-info ms-1">⏱️ ${receita.tempoPreparo}min</span>
                                <span class="badge bg-warning ms-1">🍽️ ${receita.porcoes} porções</span>
                            </small>
                        </div>
                        <a href="detalhes.html?id=${receita.id}" class="btn btn-primary mt-auto">Ver Receita</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Configurar funcionalidade de pesquisa
function configurarPesquisa() {
    const campoPesquisa = document.getElementById('campoPesquisa');
    const btnPesquisar = document.getElementById('btnPesquisar');
    const btnLimpar = document.getElementById('btnLimpar');

    if (!campoPesquisa || !btnPesquisar || !btnLimpar) return;

    function realizarPesquisa() {
        const termo = campoPesquisa.value.toLowerCase().trim();
        
        if (termo === '') {
            receitasFiltradas = todasReceitas;
        } else {
            receitasFiltradas = todasReceitas.filter(receita => 
                receita.titulo.toLowerCase().includes(termo) ||
                receita.descricao.toLowerCase().includes(termo) ||
                receita.categoria.toLowerCase().includes(termo)
            );
        }
        
        displayReceitas(receitasFiltradas);
        
        // Feedback da pesquisa
        const container = document.getElementById('receitas-container');
        if (receitasFiltradas.length === 0 && termo !== '') {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <h4>Nenhuma receita encontrada</h4>
                        <p>Não encontramos receitas com o termo "${termo}". Tente pesquisar por outros ingredientes ou categorias.</p>
                    </div>
                </div>
            `;
        }
    }

    function limparPesquisa() {
        campoPesquisa.value = '';
        receitasFiltradas = todasReceitas;
        displayReceitas(receitasFiltradas);
    }

    // Event listeners
    btnPesquisar.addEventListener('click', realizarPesquisa);
    btnLimpar.addEventListener('click', limparPesquisa);
    
    // Pesquisa ao pressionar Enter
    campoPesquisa.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            realizarPesquisa();
        }
    });
}

// Show error message when API fails
function showErrorMessage() {
    const container = document.getElementById('receitas-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-warning text-center">
                <h4>Servidor não disponível</h4>
                <p>Não foi possível carregar as receitas. Certifique-se de que o JSON Server está rodando.</p>
                <button class="btn btn-primary" onclick="fetchReceitas()">Tentar Novamente</button>
            </div>
        </div>
    `;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', fetchReceitas);

