// slider.js (versão corrigida para usar API)
document.addEventListener('DOMContentLoaded', async function() {
    const sliderContainer = document.getElementById('slider-relacionadas');

    if (sliderContainer) {
        try {
            // Busca receitas da API com verificação adicional
            console.log('Iniciando fetch das receitas para o slider...');
            const response = await fetch('/receitas');
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const receitas = await response.json();
            console.log('Receitas carregadas para o slider:', receitas.length);

            // Limpa o container antes de adicionar novos elementos
            sliderContainer.innerHTML = '';

            // Preenche o slider com as receitas da API
            receitas.forEach(receita => {
                const slide = document.createElement('div');
                slide.className = 'receita-slide';
                slide.innerHTML = `
                    <a href="detalhes.html?id=${receita.id}">
                        <img src="${receita.imagem}" alt="${receita.titulo}">
                        <h4 class="text-center text-light mt-2">${receita.titulo}</h4>
                    </a>
                `;
                sliderContainer.appendChild(slide);
            });

            // Inicializa funcionalidades do slider
            inicializarSlider();
            console.log('Slider preenchido com sucesso!');

        } catch (error) {
            console.error('Erro detalhado ao carregar receitas para o slider:', error);
            sliderContainer.innerHTML = `
                <div class="text-center text-light">
                    <p>Erro ao carregar receitas relacionadas</p>
                    <p class="small">Verifique se o servidor está rodando</p>
                </div>
            `;
        }
    }
});

function inicializarSlider() {
    const slides = document.querySelectorAll('.receita-slide');
    console.log('Inicializando slider com', slides.length, 'slides');
    
    if (slides.length > 0) {
        // Adiciona funcionalidade de scroll suave automático
        let currentIndex = 0;
        const container = document.getElementById('slider-relacionadas');
        
        function nextSlide() {
            if (slides.length > 1) {
                currentIndex = (currentIndex + 1) % slides.length;
                const scrollPosition = currentIndex * (slides[0].offsetWidth + 25);
                container.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            }
        }
        
        // Auto-scroll a cada 3 segundos
        setInterval(nextSlide, 3000);
    }
}