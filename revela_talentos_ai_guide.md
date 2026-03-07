# Guia Completo — Como uma IA Deve Trabalhar com o App Revela Talentos

## 1. Visão Geral do Projeto
**Nome:** Revela Talentos
**Tipo:** Plataforma de gestão de atletas / membros
**Repositório:** matheuzgdn/revela-talentos
**Caminho local:** c:\Users\Admin\revela\revela-talentos
**Backend:** Base44 (BaaS — Backend as a Service), cliente em `src/api/base44Client.js`
**Frontend:** React + Vite + Tailwind CSS
**Objetivo da plataforma:** Gerenciar atletas, intercâmbios, conteúdos, lives, zona de membros e CRM administrativo.

## 2. Stack Tecnológica Detalhada
| Camada | Tecnologia |
| -- | -- |
| Framework | React 18 |
| Bundler | Vite |
| Estilização | Tailwind CSS (classes utilitárias) |
| Ícones | Lucide React (lucide-react) |
| Componentes UI | shadcn/ui (src/components/ui/) |
| Backend/Auth | Base44 (base44.auth, base44.entities) |
| Deploy | Commit no GitHub → deploy via Base44 |

> **IMPORTANT**
> Sempre verificar se o ícone usado existe em lucide-react. Nunca inventar nomes de ícone — usar o site lucide.dev para confirmar.

## 3. Estrutura de Pastas
```
src/
├── api/              # base44Client.js — conexão com backend
├── components/
│   ├── admin/        # Componentes exclusivos do painel admin
│   │   ├── crm/      # AdvancedCRM, ToolsTab, etc.
│   ├── athlete/      # Perfil, setup do atleta
│   ├── auth/         # Login, PendingApproval, etc.
│   ├── content/      # Player de vídeo, lives
│   ├── i18n/         # LanguageContext (PT/ES)
│   ├── live/         # LiveViewer, LiveBroadcaster
│   └── ui/           # Componentes shadcn (Button, Input, etc.)
├── pages/
│   ├── Admin.jsx         # Painel administrativo completo
│   ├── ZonaMembros.jsx   # Área de membros (principal)
│   ├── Lives.jsx
│   └── Eventos.jsx
├── Layout.jsx         # Layout geral com sidebar/nav
└── App.jsx            # Rotas principais
```

## 4. Design System — Regras Visuais
### Paleta de Cores Principal
| Uso | Cor / Classe Tailwind |
| -- | -- |
| Fundo principal | `bg-black` ou `bg-[#05080a]` |
| Fundo de cards | `bg-[#0a0f14]` ou `bg-[#0a0f14]/80` |
| Accent primário (azul ciano) | `#00a8e1` → `text-[#00a8e1]`, `border-[#00a8e1]` |
| Gradiente accent | `from-[#00a8e1] to-emerald-400` |
| Bordas sutis | `border-[#00a8e1]/20` a `/50` |
| Texto secundário | `text-gray-400`, `text-white/80` |
| Destaque sucesso | `text-emerald-400`, `bg-emerald-500/10` |
| Alerta | `text-amber-500` |
| WhatsApp | `bg-green-600` |

### Bordas e Cards
- Cards premium: `rounded-2xl` ou `rounded-[2rem]`
- Sombra: `shadow-[0_20px_40px_rgba(0,0,0,0.9)]`
- Bordas com opacidade: `border border-[#00a8e1]/30`
- Efeito blur/vidraria: `backdrop-blur-md bg-[#0a0f14]/80`

### Tipografia
- Títulos grandes: `font-black uppercase tracking-tighter`
- Badges/labels: `uppercase tracking-widest text-xs font-bold`
- Corpo: `text-gray-400`, tamanhos text-sm a text-base

### Dark Theme
- **Nunca** usar fundos brancos ou claros nos componentes da plataforma
- Tudo segue o padrão dark premium

## 5. Componentes Base Reutilizáveis
Dentro de ZonaMembros.jsx e outras páginas existem mini-componentes locais:

- **Bdg** — Badge/tag de seção com ícone e tipo
- **PBtn** — Botão primário (v="bl" = filled, v="ou" = outlined)
- **IntercambioView** — Seção do mapa interativo EC10 Talentos
- **ConsejosView** — Sessão de dicas/conselhos
> Antes de criar um novo componente, verificar se já existe um reutilizável no arquivo.

## 6. Sistema de Autenticação
- Gerenciado pelo Base44: `base44.auth.logout()`, `base44.auth.login()`, etc.
- Usuário disponível via props ou contexto com `user.full_name`, `user.email`, `user.role`
Roles importantes:
- **admin** → acesso ao painel Admin.jsx
- **member** (aprovado) → acesso à ZonaMembros.jsx
- **pending** → redireciona para PendingApproval.jsx

### Fluxo de Aprovação
1. Usuário cria conta → vai para PendingApproval
2. Admin aprova em AdminUsersTab.jsx ou AdminAthleteDetailsModal.jsx
3. Campo `liberado_zona_membros` ou equivalente controla o acesso

## 7. ZonaMembros.jsx — Análise Detalhada
É o arquivo mais complexo do projeto. Contém múltiplas seções (views internas):

```
ZonaMembros
├── IntercambioView    → mapa interativo com zoom e pan
├── ConsejosView       → dicas para atletas
├── Seção de vídeos    → conteúdos liberados
└── Outras seções
```

**Mapa EC10 Talentos (IntercambioView)**
- SVG do mapa: carregado via `<image href="...wikipedia...">` dentro de um `<svg viewBox="0 0 1000 500">`
- Pinos no mapa: Array EVENTS com pos.top e pos.left em %
- Zoom: estado zoom com Math.min/max + transform: scale(zoom)
- Pan/Arraste: estados pan {x,y}, isDragging, dragStart + eventos mouse e touch
- Transform aplicado: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
- Pinos DEVEM estar dentro do mesmo div que recebe o transform para se moverem junto com o mapa

> **WARNING**
> Os pinos do mapa PRECISAM estar dentro do container div que tem o `style={{ transform }}`. Se estiverem fora, ficam fixos na tela durante o zoom.

## 8. Painel Administrativo (Admin.jsx)
Composto por abas: AdminUsersTab, AdminContentTab, AdvancedCRM, etc.
- AdminContentTab.jsx — gerencia liberação de conteúdos para a zona de membros
- AdminAthleteDetailsModal.jsx — modal de detalhes do atleta com toggles de acesso
- AdvancedCRM.jsx — CRM com funil, leads, ações de marketing

## 9. Sistema de Idiomas
Arquivo base: `src/components/i18n/LanguageContext.jsx`
A plataforma serve falantes de Português (Brasil) e Espanhol.
- Toggles de idioma: botões 🇧🇷 PT / 🇪🇸 ES
- Padrão de implementação: objeto `TEXTS = { pt: {...}, es: {...} }` + `useState('pt')`
- Traduzir sempre: título, corpo do texto, labels de botões, mensagem do WhatsApp

## 10. Base44 — Como Funciona
```javascript
import { base44 } from '@/api/base44Client';
// Autenticação
base44.auth.logout();
// Entidades (CRUD)
base44.entities.NomeDaEntidade.list({ filters: [...] });
base44.entities.NomeDaEntidade.create({ campo: valor });
base44.entities.NomeDaEntidade.update(id, { campo: valor });
```
> **IMPORTANT**
> O Base44 é o banco de dados + autenticação. Não existe outro banco. Todos os dados persistidos passam por base44.entities.

## 11. Critérios e Processo de Análise da IA
**Antes de qualquer alteração, verificar:**
- Qual arquivo exatamente contém o que precisa mudar? → `grep_search` para localizar texto/componente
- Qual é o contexto completo do trecho? → `view_file` com ±30 linhas de contexto
- O componente já existe ou precisa ser criado? → `find_by_name` para buscar padrões similares
- Quais imports são necessários? → verificar se ícones, componentes e hooks estão importados no topo do arquivo
- Existe algum padrão já usado no projeto para isso? → procurar implementações anteriores similares

**Durante a alteração:**
- Preservar o design system → manter paleta de cores, bordas, dark theme
- JSX válido → cada tag aberta deve fechar; múltiplos elementos raiz precisam de `<>...</>` (Fragment)
- Não quebrar outros componentes → alterações isoladas; evitar mexer em partes não relacionadas
- Manter o estado mínimo necessário → usar `useState` de forma enxuta
- Eventos touch e mouse → quando implementar interatividade, sempre cobrir os dois

**Após a alteração:**
- Rodar `npm run build` sempre para confirmar que não há erros de compilação
- Verificar a saída do build → Exit code 0 = sucesso; qualquer erro = identificar linha exata e corrigir
- Nunca assumir que funcionou sem ver Exit code: 0 no output

## 12. Erros Comuns e Como Evitar
| Erro | Causa | Solução |
| -- | -- | -- |
| Expected ")" but found "className" | Tags JSX adjacentes sem wrapper | Envolver em `<>...</>` |
| Unexpected closing "div" tag | Fechar mais divs do que abriu | Contar abertura/fechamento |
| Transform failed | Erro de sintaxe JSX ou JS | Verificar template literals, chaves {} |
| Pinos do mapa não seguem o zoom | Pinos fora do container escalado | Mover EVENTS.map para dentro do div com transform |
| Ícone não encontrado | Nome de ícone inexistente no Lucide | Verificar em lucide.dev |
| Build OK mas comportamento errado | Lógica de estado errada | Debugar com console.log temporário |

## 13. Fluxo de Deploy
O usuário realiza o deploy manualmente via git:
```bash
git checkout main
git pull origin main
git add .
git commit -m "update: descrição"
git push origin main
```
O Base44 detecta o push e faz deploy automaticamente.

> **NOTE**
> A IA não faz o push. Apenas prepara o código. O usuário executa o git.

## 14. Comunicação com o Usuário
- O usuário fala Português do Brasil
- O app tem conteúdo em Português e Espanhol (para atletas latinos)
- Respostas devem ser diretas e técnicas, mas em tom amigável
- Confirmar sempre quando o build passou com sucesso antes de declarar tarefa concluída

## 15. Regras de Ouro — Resumo
- ✅ Sempre rodar npm run build após qualquer alteração
- ✅ Manter o dark theme e a paleta #00a8e1
- ✅ Pinos do mapa dentro do container de transform
- ✅ JSX precisa de um único elemento raiz — usar Fragment se necessário
- ✅ Ícones do Lucide devem existir — verificar antes de usar
- ✅ Base44 é o único backend — não criar fetch para outras APIs de dados
- ✅ Traduzir para ES quando adicionar textos visíveis ao usuário
- ✅ Não alterar arquivos não relacionados ao pedido do usuário
- ✅ Confirmar os imports no topo do arquivo antes de usar componentes/hooks novos
- ✅ View o arquivo antes de editar — nunca editar às cegas
