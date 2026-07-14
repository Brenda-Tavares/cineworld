# CineWorld

> Projeto de portfólio — Plataforma de descoberta de filmes com interface multilíngue,
> integração com TMDB API e assistente de filmes por IA.

---

## Sobre o Projeto

O CineWorld é uma aplicação web desenvolvida para descoberta e exploração de filmes através de uma interface responsiva e multilíngue.

A plataforma integra APIs do TMDB para busca dinâmica de filmes, filtragem e navegação de conteúdo, além de contar com interação por IA conversacional capaz de sugerir filmes contextualmente com base na intenção do usuário.

---

## Funcionalidades

* Busca dinâmica de filmes
* Filtragem por gênero e categoria
* Ordenação por avaliação, popularidade e data de lançamento
* Filtragem por país e ano
* Suporte a múltiplos idiomas
* Informações sobre plataformas de streaming
* Sugestões de filmes assistidas por IA
* Interface responsiva
* Sistema de contato
* Middleware de segurança e proteção de API
* Deploy na Vercel

---

## Tecnologias

### Frontend

* HTML5, CSS3 (Design System próprio, glassmorphism, variáveis CSS), JavaScript (vanilla)
* Font Awesome (ícones)
* Google Fonts (Cinzel, DM Sans)

### Backend

* Node.js
* Vercel Serverless Functions

### APIs & Serviços

* TMDB API
* Google Gemini AI

### Infraestrutura & Segurança

* Content Security Policy (headers)
* Rate limiting (server-side)
* Validação de entrada (server-side)
* CORS restrito ao domínio de produção

### Infraestrutura

* Vercel (deploy)

---

## Demonstração

https://cineworld-site.vercel.app

---

## Desenvolvimento Local

```bash
npm install
vercel dev
```

A aplicação rodará localmente em:

```text
http://localhost:3000
```

---

## Variáveis de Ambiente

```env
TMDB_API_KEY=sua_chave_tmdb
GEMINI_API_KEY=sua_chave_gemini
```

---

## Autora

Desenvolvido por **Brenda Tavares** — ShipClaw

Repositório também disponível em: <!-- LINK DO REPO SHIPCLAW -->

---

## Licença

Este repositório é compartilhado exclusivamente para fins de portfólio e demonstração.

Não é permitida a redistribuição comercial, revenda ou reprodução não autorizada do projeto.
