# AutoStand Frontend

React + Vite + TypeScript + React Router + React Hook Form + Zod + Tailwind CSS + Lucide React + Fetch API.

## Teste offline

O projeto vem com `VITE_OFFLINE_MODE=true` no `.env` para permitir testar a autenticação e o Dashboard sem backend.

Credenciais:

| Perfil               | Email                     | Palavra-passe |
| -------------------- | ------------------------- | ------------- |
| Admin Superior       | admin@autostand.local     | Admin@123     |
| Admin da Revendedora | miniadmin@autostand.local | Mini@123      |
| Gestor Operacional   | gestor@autostand.local    | Gestor@123    |
| Cliente Demo         | cliente@autostand.local   | Cliente@123   |

Na página de login podes clicar diretamente no perfil para preencher as credenciais.

## Modo API

Para ligar ao backend:

```env
VITE_OFFLINE_MODE=false
VITE_API_URL=http://localhost:3500/api/v1
VITE_CONTRACT_CREATE_PATH=
```

Depois reinicia o Vite.

## Matriz de acesso

- `ADMIN_GLOBAL`: acesso total; cria e gere stands/substands, utilizadores, veículos, operações, transferências, relatórios e auditoria.
- `MINI_ADMIN`: gere exclusivamente os stands atribuídos, pode registar/gerir veículos e operações dessa substand e pode solicitar transferências; não aprova transferências.
- `GESTOR`: operação comercial (consultar veículos, clientes, processos, vendas, alugueres, contratos, prestações, pagamentos e devoluções); não cria/edita veículos e não tem módulo de transferências.
- `CLIENTE`: não entra no painel operacional; usa o catálogo/portal para consultar veículos disponíveis.

## Catálogo do cliente

Rotas públicas: `/` (landing), `/catalog` (catálogo) e `/catalog/vehicles/:id` (ficha do veículo). A ficha suporta oito posições de fotografia. O frontend aceita `photos`, `images`, `photoUrls` ou campos `photo1`…`photo8` quando esses dados vierem do backend. Em modo offline são usados dados de demonstração locais.

## Estado do veículo

O formulário de veículo não permite alterar manualmente o estado operacional; na criação inicial o estado enviado é `AVAILABLE`. Transições como `PROCESSING`, `SOLD`, `RENTED` ou `TRANSFER_PENDING` permanecem sob responsabilidade da API.
