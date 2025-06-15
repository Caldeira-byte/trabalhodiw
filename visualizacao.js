
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de visualização iniciado');
    
    let receitas = [];
    let graficos = {};

    // Carregar dados da API
    async function carregarDados() {
        try {
            console.log('📡 Buscando dados da API...');
            const response = await fetch('/receitas');
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            receitas = await response.json();
            console.log('✅ Receitas carregadas:', receitas.length);
            
            if (receitas.length === 0) {
                mostrarMensagemVazia();
                return;
            }
            
            // Processar e criar visualizações
            atualizarEstatisticas();
            criarGraficos();
            criarTabelaResumo();
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            mostrarErro();
        }
    }

    // Atualizar estatísticas básicas
    function atualizarEstatisticas() {
        const total = receitas.length;
        
        if (total === 0) return;
        
        // Calcular médias
        const tempoMedio = receitas.reduce((acc, r) => acc + (parseInt(r.tempoPreparo) || 0), 0) / total;
        const porcoesMedia = receitas.reduce((acc, r) => acc + (parseInt(r.porcoes) || 0), 0) / total;
        
        // Encontrar categoria mais popular
        const categorias = {};
        receitas.forEach(r => {
            const cat = r.categoria || 'Outros';
            categorias[cat] = (categorias[cat] || 0) + 1;
        });
        
        const categoriaMaisPopular = Object.keys(categorias).length > 0 
            ? Object.keys(categorias).reduce((a, b) => categorias[a] > categorias[b] ? a : b)
            : 'N/A';
        
        // Atualizar DOM
        document.getElementById('totalReceitasNum').textContent = total;
        document.getElementById('tempoMedio').textContent = Math.round(tempoMedio);
        document.getElementById('porcoesMedia').textContent = Math.round(porcoesMedia);
        document.getElementById('categoriaMaisPopular').textContent = categoriaMaisPopular;
        
        console.log('📊 Estatísticas atualizadas:', { total, tempoMedio: Math.round(tempoMedio) });
    }

    // Criar todos os gráficos
    function criarGraficos() {
        console.log('🎨 Criando gráficos...');
        
        // Processar dados para gráficos
        const dadosCategoria = {};
        const dadosTempo = { 'Até 30min': 0, '31-60min': 0, '1-2 horas': 0, 'Mais de 2h': 0 };
        const dadosPorcoes = {};

        receitas.forEach(receita => {
            // Categorias
            const categoria = receita.categoria || 'Outros';
            dadosCategoria[categoria] = (dadosCategoria[categoria] || 0) + 1;

            // Tempo
            const tempo = parseInt(receita.tempoPreparo) || 0;
            if (tempo <= 30) dadosTempo['Até 30min']++;
            else if (tempo <= 60) dadosTempo['31-60min']++;
            else if (tempo <= 120) dadosTempo['1-2 horas']++;
            else dadosTempo['Mais de 2h']++;

            // Porções
            const porcoes = parseInt(receita.porcoes) || 0;
            let faixa;
            if (porcoes <= 2) faixa = '1-2 pessoas';
            else if (porcoes <= 4) faixa = '3-4 pessoas';
            else if (porcoes <= 8) faixa = '5-8 pessoas';
            else faixa = '8+ pessoas';
            dadosPorcoes[faixa] = (dadosPorcoes[faixa] || 0) + 1;
        });

        // Criar gráficos
        criarGraficoPizza(dadosCategoria);
        criarGraficoBarra(dadosTempo);
        criarGraficoLinha(dadosPorcoes);
    }

    // Gráfico de Pizza - Categorias
    function criarGraficoPizza(dados) {
        const canvas = document.getElementById('graficoCategoria');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const cores = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

        graficos.pizza = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(dados),
                datasets: [{
                    data: Object.values(dados),
                    backgroundColor: cores,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
        console.log('✅ Gráfico de pizza criado');
    }

    // Gráfico de Barras - Tempo
    function criarGraficoBarra(dados) {
        const canvas = document.getElementById('graficoTempo');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');

        graficos.barra = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(dados),
                datasets: [{
                    label: 'Número de Receitas',
                    data: Object.values(dados),
                    backgroundColor: ['#19db6a', '#36A2EB', '#FFCE56', '#FF6384'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
        console.log('✅ Gráfico de barras criado');
    }

    // Gráfico de Linha - Porções
    function criarGraficoLinha(dados) {
        const canvas = document.getElementById('graficoPorcoes');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');

        graficos.linha = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(dados),
                datasets: [{
                    label: 'Receitas por Porções',
                    data: Object.values(dados),
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
        console.log('✅ Gráfico de linha criado');
    }

    // Criar tabela resumo
    function criarTabelaResumo() {
        const tbody = document.getElementById('tabelaResumo');
        if (!tbody) return;
        
        const categorias = {};
        receitas.forEach(r => {
            const cat = r.categoria || 'Outros';
            categorias[cat] = (categorias[cat] || 0) + 1;
        });

        const total = receitas.length;
        const resumo = Object.entries(categorias).map(([categoria, quantidade]) => {
            const receitasCategoria = receitas.filter(r => r.categoria === categoria);
            const tempoMedio = receitasCategoria.reduce((acc, r) => acc + (parseInt(r.tempoPreparo) || 0), 0) / quantidade;
            const porcoesMedia = receitasCategoria.reduce((acc, r) => acc + (parseInt(r.porcoes) || 0), 0) / quantidade;
            const percentual = ((quantidade / total) * 100).toFixed(1);

            return { categoria, quantidade, tempoMedio: Math.round(tempoMedio), porcoesMedia: Math.round(porcoesMedia), percentual };
        });

        tbody.innerHTML = resumo.map(item => '<tr><td><strong>' + item.categoria + '</strong></td><td><span class="badge bg-primary">' + item.quantidade + '</span></td><td>' + item.tempoMedio + ' min</td><td>' + item.porcoesMedia + ' porções</td><td><span class="badge bg-success">' + item.percentual + '%</span></td></tr>').join('');
        
        console.log('📋 Tabela resumo criada');
    }

    // Mostrar mensagem quando não há receitas
    function mostrarMensagemVazia() {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = '<div class="alert alert-info text-center mt-5"><h4>📝 Nenhuma Receita Cadastrada</h4><p>Você precisa cadastrar algumas receitas primeiro para ver os gráficos!</p><a href="cadastro.html" class="btn btn-success btn-lg">➕ Cadastrar Primeira Receita</a></div>';
        }
    }

    // Mostrar erro
    function mostrarErro() {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = '<div class="alert alert-danger text-center mt-5"><h4>🚫 Erro ao Carregar Dados</h4><p>Não foi possível conectar com o servidor.</p><button class="btn btn-danger" onclick="location.reload()">🔄 Tentar Novamente</button></div>';
        }
    }

    // Verificar se Chart.js foi carregado
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js não foi carregado!');
        mostrarErro();
        return;
    }
    
    console.log('✅ Chart.js carregado com sucesso');
    
    // Inicializar
    carregarDados();
});
