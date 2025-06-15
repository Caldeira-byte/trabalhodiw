
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("detalhes-container");

  const urlParams = new URLSearchParams(window.location.search);
  const receitaId = urlParams.get("id");

  if (receitaId) {
    fetch(`/receitas/${receitaId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Receita não encontrada - Status: ${response.status}`);
        }
        return response.json();
      })
      .then(receita => {
        container.innerHTML = `
          <div class="row">
            <div class="col-md-6">
              <img src="${receita.imagem}" alt="${receita.titulo}" class="img-fluid rounded shadow mb-3">
            </div>
            <div class="col-md-6">
              <h1 class="text-success">${receita.titulo}</h1>
              <p class="lead">${receita.descricao}</p>
              <div class="recipe-info mb-3">
                <span class="badge bg-primary me-2">⏱️ ${receita.tempoPreparo} min</span>
                <span class="badge bg-success me-2">🍽️ ${receita.porcoes} porções</span>
                <span class="badge bg-warning text-dark me-2">📊 ${receita.dificuldade}</span>
                <span class="badge bg-info">${receita.categoria}</span>
              </div>
            </div>
          </div>
          
          <div class="row mt-4">
            <div class="col-md-6">
              <h4 class="text-success">🛒 Ingredientes:</h4>
              <ul class="list-group">
                ${receita.ingredientes.map(ingrediente => `<li class="list-group-item">${ingrediente}</li>`).join('')}
              </ul>
            </div>
            <div class="col-md-6">
              <h4 class="text-success">👨‍🍳 Modo de Preparo:</h4>
              <ol class="list-group list-group-numbered">
                ${receita.preparo.map(passo => `<li class="list-group-item">${passo}</li>`).join('')}
              </ol>
            </div>
          </div>
          
          <div class="text-center mt-4">
            <a href="index.html" class="btn btn-success btn-lg">🏠 Voltar ao Início</a>
            <a href="biblioteca.html" class="btn btn-outline-success btn-lg ms-2">📚 Ver Mais Receitas</a>
          </div>
        `;
      })
      .catch(error => {
        console.error("Erro ao carregar a receita:", error);
        container.innerHTML = `<p class="text-danger">Erro ao carregar detalhes da receita.</p>`;
      });
  } else {
    container.innerHTML = "<p class='text-warning'>Nenhuma receita selecionada.</p>";
  }
});
