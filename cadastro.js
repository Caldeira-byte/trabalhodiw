// Arquivo JavaScript para a página de cadastro
// Sistema CRUD completo com JSON Server

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const formReceita = document.getElementById('formReceita');
    const tabelaReceitas = document.getElementById('tabelaReceitas');
    const filtroReceitas = document.getElementById('filtroReceitas');

    // Elementos de estatísticas
    const totalReceitas = document.getElementById('totalReceitas');
    const categoriaPopular = document.getElementById('categoriaPopular');

    // Elementos do modal de edição
    const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
    const formEditarReceita = document.getElementById('formEditarReceita');
    const salvarEdicao = document.getElementById('salvarEdicao');

    // Array para armazenar receitas
    let receitas = [];
    let receitaEditando = null;

    // ===== FUNÇÕES DE API =====

    // Buscar todas as receitas
    async function buscarReceitas() {
        try {
            console.log('Buscando receitas...');
            const response = await fetch('/receitas');

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            receitas = await response.json();
            renderizarTabela();
            atualizarEstatisticas();
            console.log('Receitas carregadas:', receitas.length);
        } catch (error) {
            console.error('Erro ao buscar receitas:', error);
            mostrarMensagem('Erro ao carregar receitas. Verifique se o servidor está rodando.', 'danger');
        }
    }

    // Criar nova receita
    async function criarReceita(dadosReceita) {
        try {
            const response = await fetch('/receitas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosReceita)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const novaReceita = await response.json();
            console.log('Receita criada:', novaReceita);
            mostrarMensagem('Receita cadastrada com sucesso!', 'success');
            buscarReceitas(); // Recarregar lista
            formReceita.reset(); // Limpar formulário
            return novaReceita;
        } catch (error) {
            console.error('Erro ao criar receita:', error);
            mostrarMensagem('Erro ao cadastrar receita.', 'danger');
        }
    }

    // Atualizar receita
    async function atualizarReceita(id, dadosReceita) {
        try {
            const response = await fetch(`/receitas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosReceita)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const receitaAtualizada = await response.json();
            console.log('Receita atualizada:', receitaAtualizada);
            mostrarMensagem('Receita atualizada com sucesso!', 'success');
            buscarReceitas(); // Recarregar lista
            return receitaAtualizada;
        } catch (error) {
            console.error('Erro ao atualizar receita:', error);
            mostrarMensagem('Erro ao atualizar receita.', 'danger');
        }
    }

    // Excluir receita
    async function excluirReceita(id) {
        try {
            const response = await fetch(`/receitas/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Receita excluída:', id);
            mostrarMensagem('Receita excluída com sucesso!', 'success');
            buscarReceitas(); // Recarregar lista
        } catch (error) {
            console.error('Erro ao excluir receita:', error);
            mostrarMensagem('Erro ao excluir receita.', 'danger');
        }
    }

    // ===== FUNÇÕES DE UI =====

    // Mostrar mensagens de feedback
    function mostrarMensagem(texto, tipo) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
        alertDiv.innerHTML = `
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);

        // Auto remover após 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Função para atualizar estatísticas
    function atualizarEstatisticas() {
        totalReceitas.textContent = receitas.length;

        if (receitas.length > 0) {
            // Calcular categoria mais popular
            const categorias = {};
            receitas.forEach(receita => {
                categorias[receita.categoria] = (categorias[receita.categoria] || 0) + 1;
            });

            const categoriaMaisPopular = Object.keys(categorias).reduce((a, b) => 
                categorias[a] > categorias[b] ? a : b
            );

            categoriaPopular.textContent = categoriaMaisPopular;
        } else {
            categoriaPopular.textContent = '-';
        }
    }

    // Função para renderizar tabela
    function renderizarTabela(receitasFiltradas = receitas) {
        if (receitasFiltradas.length === 0) {
            tabelaReceitas.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted">
                        ${receitas.length === 0 ? 'Nenhuma receita cadastrada ainda' : 'Nenhuma receita encontrada'}
                    </td>
                </tr>
            `;
            return;
        }

        tabelaReceitas.innerHTML = receitasFiltradas.map(receita => `
            <tr>
                <td>
                    <strong>${receita.titulo}</strong>
                    <br>
                    <small class="text-muted">${receita.descricao?.substring(0, 50)}...</small>
                </td>
                <td>
                    <span class="badge bg-secondary">${receita.categoria}</span>
                    <br>
                    <small class="text-muted">${receita.porcoes} porções</small>
                </td>
                <td>
                    <strong>${receita.tempoPreparo} min</strong>
                    <br>
                    <small class="text-muted">${receita.dificuldade || 'N/A'}</small>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editarReceita(${receita.id})" title="Editar">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="confirmarExclusao(${receita.id}, '${receita.titulo}')" title="Excluir">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Processar dados do formulário
    function processarDadosFormulario(form) {
        const formData = new FormData(form);
        const dados = {};

        // Campos simples
        for (let [key, value] of formData.entries()) {
            if (key === 'ingredientes' || key === 'preparo') {
                // Converter textarea em array
                dados[key] = value.split('\n').filter(item => item.trim() !== '');
            } else if (key === 'tempoPreparo' || key === 'porcoes') {
                // Converter para número
                dados[key] = parseInt(value);
            } else {
                dados[key] = value;
            }
        }

        // Adicionar campos extras
        dados.dificuldade = dados.dificuldade || 'Médio';
        dados.dataCriacao = new Date().toISOString();
        dados.autor = 'Usuário do Sistema';

        return dados;
    }

    // ===== EVENT LISTENERS =====

    // Envio do formulário principal
    if (formReceita) {
        formReceita.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Formulário submetido');

            const dadosReceita = processarDadosFormulario(this);
            await criarReceita(dadosReceita);
        });
    }

    // Filtro de receitas
    if (filtroReceitas) {
        filtroReceitas.addEventListener('input', function(e) {
            const filtro = e.target.value.toLowerCase();
            const receitasFiltradas = receitas.filter(receita => 
                receita.titulo.toLowerCase().includes(filtro) ||
                receita.categoria.toLowerCase().includes(filtro) ||
                receita.descricao.toLowerCase().includes(filtro)
            );
            renderizarTabela(receitasFiltradas);
        });
    }

    // Salvar edição no modal
    if (salvarEdicao) {
        salvarEdicao.addEventListener('click', async function() {
            if (receitaEditando) {
                const dadosAtualizados = {
                    ...receitaEditando,
                    titulo: document.getElementById('editarTitulo').value,
                    descricao: document.getElementById('editarDescricao').value,
                    categoria: document.getElementById('editarCategoria').value,
                    tempoPreparo: parseInt(document.getElementById('editarTempoPreparo').value),
                    porcoes: parseInt(document.getElementById('editarPorcoes').value)
                };

                await atualizarReceita(receitaEditando.id, dadosAtualizados);
                modalEditar.hide();
                receitaEditando = null;
            }
        });
    }

    // ===== FUNÇÕES GLOBAIS =====

    // Função global para editar receita
    window.editarReceita = function(id) {
        const receita = receitas.find(r => r.id === id);
        if (!receita) return;

        receitaEditando = receita;

        // Preencher o modal
        document.getElementById('editarId').value = receita.id;
        document.getElementById('editarTitulo').value = receita.titulo;
        document.getElementById('editarDescricao').value = receita.descricao;
        document.getElementById('editarCategoria').value = receita.categoria;
        document.getElementById('editarTempoPreparo').value = receita.tempoPreparo;
        document.getElementById('editarPorcoes').value = receita.porcoes;

        modalEditar.show();
    };

    // Função global para confirmar exclusão
    window.confirmarExclusao = function(id, titulo) {
        if (confirm(`Tem certeza que deseja excluir a receita "${titulo}"?`)) {
            excluirReceita(id);
        }
    };

    // ===== INICIALIZAÇÃO =====
    console.log('Sistema de cadastro inicializado');
    buscarReceitas(); // Carregar receitas ao iniciar
});