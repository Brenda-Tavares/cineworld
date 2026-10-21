# CineWorld

**Plataforma de descoberta de filmes com busca em linguagem natural e disponibilidade em streaming.**

Site no ar: [https://cineworld-site.vercel.app](https://cineworld-site.vercel.app)

Autora: **Brenda Tavares** (ShipClaw) — Portfólio/contato: **tavaresbrenda@proton.me**

---

## O Problema

Encontrar um filme é fragmentado. Você chega a uma plataforma de streaming, navega pelo que já está no catálogo e só então descobre que o filme que você realmente queria não está disponível no seu país. Motores de busca não respondem sobre disponibilidade. Bancos de dados no estilo Letterboxd dizem *o que* um filme é, não *onde você pode assisti-lo legalmente agora*.

O problema inverso é igualmente comum: você lembra de um filme vagamente — "aquele com o mergulhador, ambientado no espaço, talvez nos anos 2010" — e não consegue lembrar o título. Busca por palavras-chave não pode ajudar, porque você não tem as palavras-chave.

O CineWorld resolve ambos com uma única interface: descreva o que você quer em linguagem natural, receba o título de volta e veja imediatamente se ele transmite de graça, por assinatura, para aluguel ou para compra.

## A Solução

Um catálogo de filmes em página única que transforma lembrança e descoberta em um único fluxo:

1. **Navegue ou filtre** — populares, mais bem avaliados, lançamentos futuros, nacionais ou internacionais, por gênero, ano ou origem.
2. **Busque por intenção** — digite uma descrição em vez de um título. O endpoint de IA resolve para uma entrada real do catálogo.
3. **Verifique a disponibilidade** — cada título mostra onde é transmitido, dividido entre gratuito, assinatura, aluguel e compra.

## Funcionalidades

- **Busca de IA em linguagem natural** — descreva um filme com suas próprias palavras; o Gemini extrai a intenção e a resolve contra o catálogo do TMDB.
- **Modo Identificar** — para lembrança imprecisa. Retorna o título mais compatível, com uma explicação localizada de por que ele correspondeu.
- **Disponibilidade em streaming** — provedores de assinatura, aluguel, compra e gratuito com anúncios, resolvidos por país com fallback brasileiro.
- **Filtragem e ordenação** — popularidade, avaliação, data de lançamento, próximos lançamentos, gênero, ano e nacional versus internacional.
- **8 idiomas** — inglês, português, espanhol, chinês simplificado, chinês tradicional (Hong Kong), japonês, russo e coreano, todos no lado do cliente e sem recarregar.
- **Sem necessidade de conta** — nada para se cadastrar, nada armazenado em um servidor que você controla.
- **Responsivo** — desktop, tablet e celular a partir de um único layout.

## Stack Tecnológica

| Camada | Escolha | Por quê |
|---|---|---|
| Frontend | HTML5, CSS3, JavaScript vanilla | A UI é uma única visão de catálogo com filtragem. Um framework adicionaria uma etapa de build e um runtime sem remover complexidade significativa. |
| Backend | Node.js nas Vercel Serverless Functions | As chaves do TMDB e do Gemini jamais podem chegar ao navegador. Serverless significa nenhum servidor para manter, e a superfície de API são cinco endpoints pequenos. |
| Cliente HTTP | `axios` | Timeouts e tratamento de erros consistentes em toda a camada de API. |
| Dados de filmes | TMDB API | O catálogo de referência para títulos, metadados, artes e provedores de streaming. |
| IA | Google Gemini API | Converte descrições em texto livre em intenção de busca estruturada. |
| Sanitização | DOMPurify (cdnjs) | O texto do catálogo é renderizado como HTML. O DOMPurify remove marcação injetada antes de ela chegar ao DOM. |
| Ícones | Font Awesome (cdnjs) | Conjunto de ícones consistente sem enviar uma fonte de ícones. |
| Hospedagem | Vercel | Frontend estático mais funções serverless, CDN global e execução por região. |

### Estrutura do projeto

```
front-end/
  index.html          Página única para todos os idiomas
  style.css           Toda a estilização
  script.js           Dicionário i18n, renderização do catálogo, filtros, busca de IA
  js/lang-selector.js Dropdown de idioma, independente do script.js
  <locale>/           sobre, privacidade e termos por idioma
api/
  movies.js           Listagem do catálogo, filtros, ordenação
  movie.js            Detalhe de um único título
  genres.js           Lista de gêneros
  streaming.js        Provedores de streaming por país
  ai-search.js        Busca em linguagem natural e modo identificar
  index.js            Ponto de entrada da API
lib/
  rate-limit.js       Limitador de requisições por IP, compartilhado
vercel.json           Roteamento (rewrites) e headers de segurança
```

## Introdução

Requer Node.js 22 ou mais recente. Testado no Node 22 localmente; a Vercel compila no Node 24 (`engines.node`).

```bash
npm install
cp .env.example .env   # depois preencha suas chaves
vercel dev
```

### Variáveis de ambiente

| Variável | Obrigatória | Propósito |
|---|---|---|
| `TMDB_API_KEY` | Sim | Dados do catálogo. Usada por `movies`, `movie`, `genres` e `streaming`. |
| `GEMINI_API_KEY` | Não | Busca em linguagem natural. Sem ela, o restante do site funciona normalmente. |
| `GOOGLE_SEARCH_API_KEY` | Não | Busca na web complementar e opcional para resultados de IA. Inativa enquanto não definida. |
| `GOOGLE_SEARCH_CX` | Não | ID do mecanismo de busca para a variável acima. |

Obtenha uma chave do TMDB em [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) e uma chave do Gemini em [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

## Segurança

- **Segredos ficam no servidor.** Todas as chaves são lidas de variáveis de ambiente. Nenhuma chave está presente no bundle do frontend.
- **Rate limiting.** Um limitador compartilhado por IP limita as solicitações por endpoint (`lib/rate-limit.js`). Como as funções da Vercel são stateless e distribuídas, o limite é por instância e aproximado, não um limite global.

### Auditoria de dependências

`axios` é a única dependência de runtime, e o `npm audit` reporta **0 vulnerabilidades**.

Não há `@vercel/node` no `package.json`. O runtime de Node.js da Vercel compila as funções de `/api` com um builder próprio fornecido pela plataforma, então o pacote nunca foi necessário aqui — ele apenas puxava uma cadeia de dependências de build (`ts-morph` → `fast-glob` → `micromatch` → `braces`) que respondia por todos os avisos que este projeto já teve, incluindo o crítico do `node-tar`. O `@vercel/speed-insights` permanece como devDependency: o script servido de `/_vercel/speed-insights/script.js` vem da edge da Vercel, não de `node_modules`.

`engines.node` está fixado em `24.x`, porque a Vercel descontinuou o Node.js 20 em 01/10/2026 e qualquer build fixado em `20.x` agora falha imediatamente com `BUILD_UTILS_NODE_VERSION_DISCONTINUED`.

- **Validação de entrada.** Consultas de busca têm o tamanho verificado e são rejeitadas antes de chegar a qualquer API upstream.
- **Renderização sanitizada.** Texto da API é sanitizado com DOMPurify antes de ser inserido no DOM.
- **Content Security Policy.** `connect-src` é apenas `'self'`, então o navegador só pode falar com a própria API deste site e com mais nada. `script-src` permite apenas self, cdnjs e o hash inline do JSON-LD. `img-src` é limitado a self, imagens do TMDB, Wikimedia e `data:`. `frame-src` e `object-src` são `none`, `base-uri` é `self`, `form-action` é `self`, e `frame-ancestors` é `none`.
- **Requisições cross-origin** são restritas à origem de produção.
- **Transporte** é apenas HTTPS, com `upgrade-insecure-requests` imposto.

## Privacidade

O CineWorld não tem contas, banco de dados nem publicidade. Não usa Google AdSense nem Google Analytics. O único dado gravado no seu dispositivo é a sua escolha de idioma, em `localStorage` sob `cineworld_language`.

Terceiros que recebem dados: TMDB (termos de busca), Gemini (sua consulta, apenas ao usar a busca de IA), Google Fonts (endereço IP e página de referência), Vercel (hospedagem e logs de requisições), Vercel Speed Insights (métricas Core Web Vitals e user agent do navegador), cdnjs (ícones) e Wikimedia Commons (logos de plataformas). Detalhes completos estão na política de privacidade, disponível nos 8 idiomas.

## Detalhes Técnicos

- **Arquitetura:** Serverless na Vercel com funções em `/api/*`; frontend estático sob `/front-end/`.
- **CSP (pronta para produção):** estrita, sem event handlers inline; DOMPurify na renderização do cliente; HTTPS imposto.
- **Segurança:** rate limiting por IP (`lib/rate-limit.js`), CORS restrito à origem de produção, validação e sanitização de entrada.
- **Dependências:** apenas `axios` em runtime, `@vercel/speed-insights` como devDependency; `npm audit = 0` (Node 24.x).
- **Garantia de qualidade:** sintaxe do JS validada (`node -c`) nos endpoints modificados; nenhum segredo no repositório; EOL normalizado; refatoração compatível com CSP para evitar o bloqueio de `unsafe-inline`.
- **Em andamento:** revisão contínua de hardening (headers, cache, consistência); testes e checagens permanecem leves e executados sob demanda.

## Créditos

Dados do catálogo e artes fornecidos pela [TMDB](https://www.themoviedb.org/). Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.

---

## Autora

**Brenda Tavares** — Desenvolvedora Full-Stack

- Bacharelado em Humanidades, Universidade Federal da Bahia (UFBA)
- Desenvolvimento Backend, Universidade Pitágoras Unopar Anhanguera
- GitHub: <https://github.com/Brenda-Tavares>
- LinkedIn: <https://www.linkedin.com/in/brenda-campos-tavares/>
- E-mail: tavaresbrenda@proton.me

---

Inglês: [README.md](README.md) | Chinês simplificado:
[README-ZH.md](README-ZH.md)
