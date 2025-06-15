
# Testes da API - Sistema de Receitas

## Configuração Base
- **Base URL**: `https://[seu-repl-name].[seu-username].replit.dev` 
- **Porta Local**: `http://localhost:3000` (para testes locais)

## 1. Testes GET (Buscar dados)

### GET - Listar todas as receitas
```
GET /receitas
```
**Resposta esperada**: Array com todas as receitas (200 OK)

### GET - Buscar receita por ID
```
GET /receitas/1
```
**Resposta esperada**: Objeto da receita com ID 1 (200 OK)

### GET - Buscar receita inexistente
```
GET /receitas/999
```
**Resposta esperada**: Erro 404 Not Found

### GET - Filtrar receitas por categoria
```
GET /receitas?categoria=Sobremesa
```
**Resposta esperada**: Array com receitas da categoria Sobremesa

## 2. Testes POST (Criar dados)

### POST - Criar nova receita
```
POST /receitas
Content-Type: application/json

{
  "titulo": "Teste API",
  "descricao": "Receita criada via API",
  "categoria": "Teste",
  "tempoPreparo": 15,
  "porcoes": 2,
  "dificuldade": "Fácil",
  "imagem": "teste.jpg",
  "ingredientes": ["Ingrediente 1", "Ingrediente 2"],
  "preparo": ["Passo 1", "Passo 2"],
  "autor": "Usuário Teste"
}
```
**Resposta esperada**: Objeto criado com ID gerado (201 Created)

## 3. Testes PUT (Atualizar dados)

### PUT - Atualizar receita completa
```
PUT /receitas/1
Content-Type: application/json

{
  "id": 1,
  "titulo": "Pão de Queijo Atualizado",
  "descricao": "Descrição atualizada via PUT",
  "categoria": "Lanches",
  "tempoPreparo": 50,
  "porcoes": 25,
  "dificuldade": "Fácil",
  "imagem": "pao.webp",
  "ingredientes": ["500g de polvilho doce", "1 xícara de leite"],
  "preparo": ["Ferva o leite", "Misture com polvilho"],
  "dataCriacao": "2024-01-15T10:30:00Z",
  "autor": "Maria Silva"
}
```
**Resposta esperada**: Objeto atualizado (200 OK)

## 4. Testes PATCH (Atualização parcial)

### PATCH - Atualizar apenas o título
```
PATCH /receitas/1
Content-Type: application/json

{
  "titulo": "Novo Título via PATCH"
}
```
**Resposta esperada**: Objeto com título atualizado (200 OK)

## 5. Testes DELETE (Remover dados)

### DELETE - Remover receita
```
DELETE /receitas/5
```
**Resposta esperada**: Status 200 OK (objeto removido)

### DELETE - Tentar remover receita inexistente
```
DELETE /receitas/999
```
**Resposta esperada**: Status 404 Not Found

## Como testar no Replit

1. **Thunder Client**: Instale a extensão Thunder Client no VS Code
2. **Acesse seu Repl**: Certifique-se que o JSON Server está rodando
3. **Use a URL correta**: Substitua a Base URL pela URL do seu Repl
4. **Execute os testes**: Copie e cole as requisições no Thunder Client

## Exemplos de Respostas

### GET /receitas (Sucesso)
```json
[
  {
    "id": 1,
    "titulo": "Pão de Queijo",
    "descricao": "Receita tradicional mineira...",
    "categoria": "Lanches",
    "tempoPreparo": 45,
    "porcoes": 20
  }
]
```

### POST /receitas (Sucesso)
```json
{
  "id": 6,
  "titulo": "Teste API",
  "descricao": "Receita criada via API",
  "categoria": "Teste"
}
```
