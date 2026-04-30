# Full-Stack Auth System

Uma aplicação de autenticação desenvolvida com a stack **MEAN** (MongoDB, Express.js, Angular e Node.js), focada em segurança, reatividade e arquitetura escalável.

## Visão Geral Técnica

O projeto implementa um sistema completo de autenticação e autorização que possui foco em estabelecer fluxos seguros de autenticação e gestão de usuários.

- **Front-end**: Angular 19+ (Signals, Observables (RxJS) e Standalone Components);
- **Back-end**: Node.js com Express 5+;
- **E-mail Service**: SMTP via Brevo para notificações transacionais;
- **Database**: MongoDB Atlas com indexação TTL e índices compostos.

## Arquitetura e Padrões de Design

O projeto, organizado em módulos desacoplados como um monólito modular, segue uma abordagem **híbrida**, utilizando Classes Singleton para camadas de persistência e orquestração, e funções modulares para utilitários transversais.

- **Padrão Controller-Service-Repository**:
  - _Controllers_: Responsáveis pelo roteamento e parsing das requisições. Orquestração **sem** boilerplate de `try-catch`;
  - _Services_: Camada de lógica de negócio, permitindo interação Service-to-Service (S2S);
  - _Repositories_: Abstração da camada de dados (Mongoose), centralizando as queries ao MongoDB;
- **RFC-Based Error Handling**: Middleware centralizado que implementa o padrão _Problem Details for HTTP APIs (RFC 7807)_, garantindo respostas de erro consistentes e semânticas.
- **Middleware-Chain**: Uso intensivo de camadas para sanitização de dados, proteção de rotas JWT (JSON Web Token) e controle de fluxo.
- **Resilient Caching**: Sistema de cache para usuários com invalidação automática em operações de escrita.

## Tech Stack e Bibliotecas

Para o **back-end**:

- **Core**: Node.js & Express 5.2;
- **Security**:
  - _bcrypt_: Hashing e validação de senhas;
  - _jsonwebtoken_: Autenticação Stateless;
  - _express-rate-limit_: Monitoramento de requisições para evitar bots, sobrecarregamento e brute-force.
- **Validation**: `Zod` para validação de esquemas e contratos de entrada;
- **Logging**: `morgan` para registro detalhado de requisições HTTP no console;
- **Utils**: `cookie-parser` para manipulação de cookies (HttpOnly), `nodemailer` para integração SMTP e `CORS` para a segurança do navegador.

E para o **front-end**:

- **Core**: Angular 21.1;
- **Forms**: Reactive Forms para validações detalhadas;
- **Dependency Injection**: Uso de `inject()` em vez de constructors;
- **Navigation**: Guards de rota para gestão inteligente de navegação;
- **Styling e UI/UX**: SASS (SCSS), `lucide-angular` para ícones e `ngx-toastr` para notificações ao usuário;
- **Client**: `HttpClient` nativo.

## Funcionalidades

- **Segmento de Autenticação**: Cadastro, login seguro e logout;
- **Sistema de OTP**: Verificação de e-mail e recuperação de senha com expiração automática no banco de dados;
- **Segurança**: Cookies HttpOnly, sanitização de dados e proteção contra colisões de chaves (E11000 handling);
- **RESTful API**: Endpoints semânticos, paginação, cache inteligente, sanitização de inputs e redução de carga no banco.

## Como rodar o projeto

O projeto utiliza o `concurrently` em sua raiz para facilitar a inicialização de ambas as camadas simultaneamente. Os **pré-requisitos** para rodá-lo são: Node.js (18+), npm ou yarn, MongoDB Atlas e uma conta no serviço de e-mails Brevo.

1. Clone o repositório:

```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    npm run install-all
```

2. Crie um arquivo ".env" na raiz da pasta `backend` e o preencha com as variáveis listadas na seção "Variáveis de Ambiente". Ainda, configure o ponto de entrada da API em `src/environments/` na pasta `frontend`.

3. Inicie o servidor em modo de desenvolvimento:

```bash
    npm run dev
```

**Atenção**: certifique-se de que todas as variáveis de ambiente foram configuradas corretamente antes de iniciar!

## Variáveis de Ambiente

Para rodar o projeto, você vai precisar adicionar as seguintes variáveis de ambiente no ".env" do seu back-end:

- `NODE_ENV`
- `SERVER_PORT`
- `CLIENT_PORT`
- `MONGODB_URI`
- `DB_NAME`
- `JWT_ACCESS_SECRET`
- `JWT_RESET_SECRET`
- `SMTP_MAILER`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PWD`

## Documentação da API

Em breve.

## Planos Futuros

No momento, apenas um: a criação de uma funcionalidade de "Perfil" onde o usuário será capaz de alterar seu nome, definir um avatar, trocar seu e-mail (que precisará ser verificado de novo) e trocar sua senha.

## Créditos

A inspiração inicial para o começo do projeto foi o Youtuber [GreatStack](https://www.youtube.com/@GreatStackDev), por meio do seu próprio projeto de autenticação MERN.

Com essa base, tive a oportunidade de reestruturar o projeto original como um todo e me desafiar a aprimorá-lo.

No final de tudo isso, eu aprendi a...

- Implementar o padrão Controller-Service-Repository;
- Como garantir segurança em um API com autenticação, CORS, rate limiting e input validation;
- Construir e-mails XHTML e gerenciar fluxos de e-mail automatizados; e
- Utilizar índices compostos no MongoDB;
- Implementar logging de requisições com o Morgan para examinar seu tráfego em desenvolvimento;
- Utilizar o Zod para criar esquemas de validação.
