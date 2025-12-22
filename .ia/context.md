# Contexto do Projeto e Diretrizes de Desenvolvimento

**IMPORTANTE:** Antes de iniciar qualquer nova tarefa, leia este arquivo para entender a arquitetura, tecnologias e padrões do projeto.

## Visão Geral
Este é um monorepo gerenciado com **Turborepo**, utilizando **Bun** como runtime e gerenciador de pacotes. O projeto é escrito inteiramente em **TypeScript**.

### Tecnologias Principais
-   **Runtime/Package Manager:** Bun
-   **Monorepo:** Turborepo
-   **Linter/Formatter:** Biome
-   **Backend Framework:** ElysiaJS
-   **Frontend Framework:** React (Vite)
-   **Database ORM:** Drizzle ORM
-   **Auth:** Better Auth
-   **Styling:** Tailwind CSS v4

---

## Backend (`apps/api`)

### Arquitetura
O backend segue princípios de **Domain-Driven Design (DDD)** e **Clean Architecture**. O código deve ser modular e respeitar a separação de responsabilidades.

-   **`src/domain/`**: Contém a lógica de negócios, dividida por domínios (ex: `mod`, `modpack`, `user`).
-   **`src/infra/`**: Implementações de infraestrutura (HTTP, filas, banco de dados).
-   **`src/shared/`**: Código compartilhado entre módulos.
-   **`src/utils/`**: Utilitários gerais.

### Princípios de Desenvolvimento
-   **SOLID:** Aplicar rigorosamente os princípios SOLID.
-   **Clean Code:** Manter o código limpo, legível e testável.
-   **Modularização:** Separar funções e arquivos em suas respectivas pastas de identificação. Evitar arquivos gigantes ("God classes").

### Nomenclatura de Operações
Siga estritamente estas convenções para nomear funções e métodos de serviço/repositório:

-   **`get`**: Para recuperar **apenas um** item. Ex: `getMod`, `getUser`.
-   **`list`**: Para recuperar **vários** items (com ou sem paginação). Ex: `listMods`, `listUsers`.
-   **`archive`**: Para deletar um item (soft delete). **Não usar "delete" ou "remove"** se a intenção for apenas arquivar. Ex: `archiveMod`.
-   **`update`**: Para atualização de items. Ex: `updateModpack`.
-   **`create`** ou **`add`**: Para criar ou adicionar novos items. Ex: `createUser`, `addModToPack`.

---

## Frontend (`apps/web`)

### Arquitetura
O frontend é construído com React e Vite, utilizando o ecossistema TanStack.

-   **Router:** TanStack Router (`routeTree.gen.ts`).
-   **Data Fetching:** TanStack Query.
-   **Forms:** TanStack Form.
-   **Estrutura de Pastas:**
    -   `components/`: Componentes reutilizáveis.
    -   `hooks/`: Custom hooks.
    -   `services/`: Camada de serviço para comunicação com API.
    -   `pages/`: Componentes de página (geralmente vinculados às rotas).

### Diretrizes
-   **Arquitetura Existente:** Siga os padrões já estabelecidos no projeto.
-   **Tratamento de Erro:** Utilize os mecanismos de tratamento de erro existentes (ex: Error Boundaries, Toasts).
-   **Serviços:** Centralize as chamadas de API na pasta `services/`. Não faça fetch diretamente nos componentes.

---

## Pacotes Compartilhados (`packages/`)

-   **`@org/auth`**: Lógica de autenticação (Better Auth).
-   **`@org/database`**: Schemas do Drizzle, migrações e conexão com banco.
-   **`@org/design-system`**: Componentes de UI compartilhados.
-   **`@org/validation`**: Schemas de validação Zod.

## Fluxo de Trabalho
1.  **Leia este arquivo** antes de começar.
2.  Identifique o domínio e a camada que você precisa alterar.
3.  Siga as convenções de nomenclatura.
4.  Mantenha a consistência com o código existente.
