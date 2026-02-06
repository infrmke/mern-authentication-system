# Full-Stack Auth System

> ⚠️ Este projeto está em transição ativa de React para Angular.

Uma aplicação de autenticação desenvolvida com a **MERN** Stack, focada em segurança, modularidade e padrões de design em camadas.

O app está hospedado na Render e pode ser acessado [aqui](https://mern-auth-app-b5xg.onrender.com). Mas **atenção**: o servidor pode levar 30 ou 50 segundos para "acordar" no primeiro acesso.

## Visão Geral Técnica

O projeto implementa um sistema completo de autenticação e autorização que possui foco em estabelecer fluxos seguros de autenticação e gestão de usuários.

- **Deployment**: Back-end e Front-end hospedados na Render;
- **E-mail Service**: SMTP via Brevo para notificações transacionais;
- **Database**: MongoDB Atlas com indexação TTL para expiração automática de tokens OTP.

## Arquitetura e Padrões de Design

O projeto é **híbrido**, tendo classes (Singleton) para camadas que mantêm responsabilidades fixas (Controllers/Services/Repositories) e também tendo funções modulares para lógica auxiliar.

- **Monólito Modular**: Back-end organizado em módulos desacoplados, facilitando a manutenção e testes;
- **Controller-Service-Repository**:
  - _Controllers_: Responsáveis pelo roteamento e parsing das requisições;
  - _Services_: Camada de lógica de negócio, permitindo interação Service-to-Service (S2S);
  - _Repositories_: Abstração da camada de dados (Mongoose), centralizando as queries ao MongoDB;
- **Global Error Handling**: Middleware centralizado para tratamento de erros, garantindo respostas padronizadas em toda a API;
- **Middleware-Chain**: Uso intensivo de camadas para sanitização de dados, proteção de rotas JWT (jsonwebtoken) e controle de fluxo.

## Tech Stack e Bibliotecas

**Back-end**

- **Core**: Node.js & Express.js;
- **Database**: MongoDB (via mongoose);
- **Security**:
  - _bcrypt_: Hashing e validação de senhas;
  - _jsonwebtoken_: Autenticação Stateless;
  - _express-rate-limit_: Limites para navegação normal e proteção contra ataques brute force;
  - _express-validator_: Validação de inputs.
- **Communication**: `nodemailer` para integração SMTP;
- **Utils**: `cookie-parser` para manipulação de cookies (HttpOnly) e `cors` para a segurança do navegador.

**Front-end**

- **Core**: React.js (Vite);
- **Routing**: React Router;
- **State Management**: Context API e hooks;
- **Styling**: SASS (SCSS) para arquitetura CSS modular;
- **UI/UX**: `lucide-react` para ícones e `react-hot-toast` para feedback visual;
- **Client**: Axios com configuração de interceptors e withCredentials.

## Funcionalidades

- **Segmento de autenticação**: Cadastro, login e exclusão de conta;
- **OTP**: Verificação de e-mail e recuperação de senha por meio de códigos One-Time Password;
- **Security-First**:
  - Tokens JWT armazenados em cookies `HttpOnly` e `secure`;
  - Expiração customizada de tokens e expiração automática no banco de dados (MongoDB TTL).
- **RESTful API**:
  - Paginação via limit e offset;
  - Endpoints semânticos;
  - Sanitização de inputs.
- **Feedback ao Usuário**: Mensagens de erro padronizadas e UI reativa para estados de carregamento e expiração de sessões.

## Como rodar o projeto

Os pré-requisitos são os seguintes:

- Node.js (18 ou superior);
- npm ou yarn;
- Uma conta no MongoDB Atlas (ou MongoDB instalado localmente);
- Uma conta na Brevo (para envio de e-mails).

**Back-end**

1. Clone o repositório:

```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
```

2. Navegue até a pasta do servidor e instale as dependências:

```bash
    npm install
    cd backend
```

3. Crie um arquivo .env na raiz da pasta _backend_ e preencha com as variáveis listadas na seção "Variáveis de Ambiente".

4. Inicie o servidor em modo de desenvolvimento:

```bash
    npm run dev
```

---

**Front-end**

1. Abra um novo terminal, navegue até a pasta do cliente e instale as dependências.

```bash
    cd frontend
    npm install
```

2. Crie um arquivo .env na raiz da pasta _frontend_ e adicione a URL da API como `VITE_API_URL`. Após isso, inicie a aplicação:

```bash
    npm run dev
```

---

**Full-stack**

Para agilizar um pouco, o projeto utiliza a biblioteca `concurrently`, que permite rodar o servidor e o cliente simultaneamente com um único comando a partir da raiz do projeto.

1. Na _raiz_ do projeto, instale as dependências (o concurrently):

```bash
    npm install
```

2. Execute o comando abaixo para subir o backend e o frontend de uma só vez:

```bash
    npm run dev
```

**Atenção**: certifique-se de que os arquivos .env tanto na pasta `/backend` quanto na pasta `/frontend` foram configurados corretamente antes de iniciar.

## Documentação API

Você pode testar todos os endpoints da API diretamente no Postman através da coleção abaixo:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/infrkme/workspace/public/collection/37979308-76d4549e-cb2d-4b6e-be1f-91a07d2ce862?action=share&creator=37979308)

**Atenção**: configure uma Variable `base_url` que aponte para a sua instância local ou de produção antes de testar!

## Variáveis de Ambiente

Para rodar o projeto, você vai precisar adicionar as seguintes variáveis de ambiente nos seus respectivos ".env":

**Back-end**

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

---

**Front-end**

- `VITE_PORT`

## Planos Futuros

No momento, apenas duas coisas:

- Criar uma seção "Perfil" onde o usuário será capaz de:
  - Alterar seu nome;
  - Definir seu avatar;
  - Trocar seu e-mail (que precisará ser verificado de novo); e
  - Trocar sua senha.
- Reestruturar o front-end, migrando da biblioteca React para o framework Angular (na branch `angular-frontend`).

## Créditos

A inspiração inicial para o começo do projeto foi o Youtuber [GreatStack](https://www.youtube.com/@GreatStackDev), por meio do seu próprio projeto de autenticação MERN.

Com essa base, tive a oportunidade de reestruturar o projeto original como um todo e me desafiar a aprimorá-lo.

No final de tudo isso, eu aprendi a...

- Implementar o padrão Controller-Service-Repository;
- Como garantir segurança em um API com autenticação, cors, rate limiting e input validation;
- Construir e-mails XHTML e gerenciar fluxos de e-mail automatizados; e
- Utilizar índices compostos no MongoDB.
