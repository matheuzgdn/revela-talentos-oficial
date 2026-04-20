# Base44 Extração Confirmada Por Capturas

Este arquivo registra apenas o que foi confirmado:

- visualmente nas capturas do editor de código do Base44 enviadas na conversa
- em trechos brutos de schema colados pelo usuário diretamente do Base44

Regras deste registro:
- Não inferir campos fora do que aparece nas capturas.
- Não completar schemas com base no frontend.
- Não assumir que a lista visível é a lista completa do projeto.
- Tratar os campos `id`, `created_date`, `updated_date` e `created_by` como `não visíveis` nestes arquivos JSON, mesmo que possam existir como atributos built-in no Base44.
- Quando a captura não estiver nítida o suficiente, registrar apenas a parte legível com essa limitação explícita.

## O que ficou confirmado visualmente

### 1. Existe uma pasta `entities` visível no Base44

Nas capturas, foi possível ver pelo menos estas entities na árvore lateral:

- `AccessWhitelist`
- `ActivityLog`
- `AdminAuditLog`
- `AdminNotification`
- `AnalystProfile`
- `AthleteStory`
- `AthleteTask`
- `AthleteTrophy`
- `AthleteUpload`
- `AthleteVideo`
- `CareerPost`
- `ChatMessage`
- `Comment`
- `Content`
- `ContentIdea`
- `CRMLead`
- `CRMPipeline`
- `CRMService`
- `CustomTask`
- `DailyCheckin`
- `DynamicForm`
- `Event`
- `FeaturedPlayer`
- `GameSchedule`
- `InternationalLead`
- `InternationalPlan`
- `Lead`
- `LeadInteraction`
- `LeadPage`
- `LeadPageBuilder`
- `Marketing`
- `MarketingCampaign`
- `MarketingMaterial`
- `MarketingTask`
- `MessageTemplate`
- `Notification`
- `PerformanceData`
- `Pipeline`
- `PlatformSettings`
- `ProposalTemplate`
- `SalesMaterial`
- `Seletiva`
- `SeletivaApplication`
- `SeletivaEvent`
- `ServiceHighlight`

Observação:
- esta é apenas a lista que ficou visível nas capturas
- ela não deve ser tratada como inventário completo final

### 2. Existe uma pasta `cloud-functions`

Nas capturas, ficou visível:

- `checkHlsUrlHealth.js`

## Schemas confirmados por captura

## `AccessWhitelist`

Arquivo visível:
- `entities/AccessWhitelist`

Schema confirmado:

```json
{
  "name": "AccessWhitelist",
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "description": "Email autorizado a acessar a Zona de Membros"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Se o e-mail está ativo na whitelist"
    },
    "expires_at": {
      "type": "string",
      "format": "date-time",
      "description": "Data de expiração opcional"
    },
    "notes": {
      "type": "string",
      "description": "Observações internas"
    }
  },
  "required": [
    "email"
  ]
}
```

Confirmações importantes:
- `notes` existe de fato
- a resposta resumida anterior do Base44 estava incompleta ao omitir esse campo

## `ActivityLog`

Arquivo visível:
- `entities/ActivityLog`

Schema confirmado:

```json
{
  "name": "ActivityLog",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID do usuário que realizou a ação"
    },
    "user_name": {
      "type": "string",
      "description": "Nome do usuário"
    },
    "action": {
      "type": "string",
      "description": "Descrição da ação realizada"
    },
    "action_type": {
      "type": "string",
      "enum": [
        "account",
        "profile",
        "seletiva",
        "upload",
        "content",
        "performance",
        "other"
      ],
      "default": "other",
      "description": "Tipo da ação"
    },
    "related_id": {
      "type": "string",
      "description": "ID do item relacionado (opcional)"
    },
    "metadata": {
      "type": "object",
      "description": "Dados adicionais sobre a ação"
    }
  },
  "required": [
    "user_id",
    "user_name",
    "action",
    "action_type"
  ]
}
```

## `AdminAuditLog`

Arquivo visível:
- `entities/AdminAuditLog`

Schema confirmado:

```json
{
  "name": "AdminAuditLog",
  "type": "object",
  "properties": {
    "admin_user_id": {
      "type": "string",
      "description": "ID do usuário admin que realizou a ação"
    },
    "admin_user_email": {
      "type": "string",
      "description": "Email do usuário admin"
    },
    "action_type": {
      "type": "string",
      "enum": [
        "create",
        "update",
        "delete",
        "login",
        "config_change",
        "live_created",
        "live_started",
        "live_ended",
        "vod_published"
      ],
      "description": "Tipo da ação realizada"
    },
    "entity_name": {
      "type": "string",
      "description": "Nome da entidade afetada (ex: Lead, Content, LiveEvent)"
    },
    "entity_id": {
      "type": "string",
      "description": "ID do registro afetado"
    },
    "details": {
      "type": "string",
      "description": "Descrição detalhada da ação"
    },
    "before_data": {
      "type": "object",
      "description": "Estado do objeto antes da alteração (opcional)"
    },
    "after_data": {
      "type": "object",
      "description": "Estado do objeto depois da alteração (opcional)"
    }
  },
  "required": [
    "admin_user_id",
    "action_type",
    "details"
  ]
}
```

## `AdminNotification`

Arquivo visível:
- `entities/AdminNotification`

Schema confirmado:

```json
{
  "name": "AdminNotification",
  "type": "object",
  "properties": {
    "notification_type": {
      "type": "string",
      "enum": [
        "performance_pending",
        "upload_pending",
        "new_message",
        "subscription_update",
        "new_tryout"
      ],
      "description": "Tipo da notificação"
    },
    "title": {
      "type": "string",
      "description": "Título da notificação"
    },
    "message": {
      "type": "string",
      "description": "Mensagem da notificação"
    },
    "related_id": {
      "type": "string",
      "description": "ID do item relacionado (performance, upload, etc.)"
    },
    "is_read": {
      "type": "boolean",
      "default": false,
      "description": "Se a notificação foi lida"
    },
    "tab_name": {
      "type": "string",
      "description": "Nome da aba relacionada no painel admin"
    }
  },
  "required": [
    "notification_type",
    "title",
    "message"
  ]
}
```

Observação:
- nas capturas visíveis, o enum mostrado para `notification_type` contém `5` valores
- isso conflita com respostas resumidas anteriores que listavam um conjunto diferente

## `AnalystProfile`

Arquivo visível:
- `entities/AnalystProfile`

Schema confirmado:

```json
{
  "name": "AnalystProfile",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID do usuário analista"
    },
    "specialty": {
      "type": "string",
      "enum": [
        "performance",
        "physical",
        "tactical",
        "psychological",
        "nutrition"
      ],
      "description": "Especialidade do analista"
    },
    "experience_years": {
      "type": "number",
      "description": "Anos de experiência"
    },
    "certifications": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Certificações profissionais"
    },
    "bio": {
      "type": "string",
      "description": "Biografia profissional"
    },
    "avatar_url": {
      "type": "string",
      "description": "URL da foto do analista"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Se o analista está ativo"
    },
    "rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "Avaliação média do analista"
    }
  },
  "required": [
    "user_id",
    "specialty"
  ]
}
```

## `AthleteVideo`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/AthleteVideo`

Schema confirmado:

```json
{
  "name": "AthleteVideo",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Título do vídeo"
    },
    "description": {
      "type": "string",
      "description": "Descrição do vídeo"
    },
    "video_url": {
      "type": "string",
      "description": "URL do vídeo"
    },
    "thumbnail_url": {
      "type": "string",
      "description": "URL da thumbnail"
    },
    "athlete_name": {
      "type": "string",
      "description": "Nome do atleta"
    },
    "athlete_id": {
      "type": "string",
      "description": "ID do usuário atleta"
    },
    "position": {
      "type": "string",
      "enum": [
        "goleiro",
        "zagueiro",
        "lateral",
        "volante",
        "meia",
        "atacante"
      ],
      "description": "Posição do atleta"
    },
    "category": {
      "type": "string",
      "enum": [
        "destaque",
        "treino",
        "jogo",
        "habilidade"
      ],
      "default": "destaque",
      "description": "Categoria do vídeo"
    },
    "duration": {
      "type": "number",
      "description": "Duração em segundos"
    },
    "views_count": {
      "type": "number",
      "default": 0,
      "description": "Número de visualizações"
    },
    "likes_count": {
      "type": "number",
      "default": 0,
      "description": "Número de curtidas"
    },
    "is_featured": {
      "type": "boolean",
      "default": false,
      "description": "Se está em destaque"
    },
    "is_approved": {
      "type": "boolean",
      "default": false,
      "description": "Se foi aprovado pela moderação"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "approved",
        "rejected"
      ],
      "default": "pending"
    },
    "ai_analysis": {
      "type": "object",
      "description": "Análise completa da IA sobre o vídeo",
      "properties": {
        "overall_score": {
          "type": "number",
          "description": "Nota geral de 0 a 100"
        },
        "video_quality": {
          "type": "object",
          "properties": {
            "score": {
              "type": "number"
            },
            "resolution": {
              "type": "string"
            },
            "lighting": {
              "type": "string"
            },
            "angle": {
              "type": "string"
            },
            "stability": {
              "type": "string"
            }
          }
        },
        "performance_analysis": {
          "type": "object",
          "properties": {
            "technical_skills": {
              "type": "number"
            },
            "positioning": {
              "type": "number"
            },
            "decision_making": {
              "type": "number"
            },
            "physical_condition": {
              "type": "number"
            }
          }
        },
        "detected_events": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "gol",
                  "assistencia",
                  "defesa",
                  "passe",
                  "drible",
                  "finalizacao"
                ]
              },
              "timestamp": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "quality": {
                "type": "string",
                "enum": [
                  "excelente",
                  "boa",
                  "regular"
                ]
              }
            }
          }
        },
        "strengths": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "weaknesses": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "recommendations": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "summary": {
          "type": "string",
          "description": "Resumo completo da análise"
        }
      }
    },
    "admin_feedback": {
      "type": "string",
      "description": "Feedback do administrador"
    },
    "admin_notes": {
      "type": "string",
      "description": "Notas privadas do administrador"
    }
  },
  "required": [
    "title",
    "video_url",
    "athlete_name"
  ]
}
```

## `AthleteUpload`

Fonte:
- captura visual de `entities/AthleteUpload`
- captura visual da seção `Endpoints` de `AthleteUpload`
- documentação/schema/endpoints colados pelo usuário a partir do Base44

Schema confirmado:

```json
{
  "name": "AthleteUpload",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID do usuário"
    },
    "file_url": {
      "type": "string",
      "description": "URL do arquivo original"
    },
    "processed_file_url": {
      "type": "string",
      "description": "URL do arquivo processado"
    },
    "file_name": {
      "type": "string",
      "description": "Nome do arquivo"
    },
    "file_type": {
      "type": "string",
      "enum": [
        "video",
        "photo"
      ],
      "description": "Tipo do arquivo"
    },
    "file_size": {
      "type": "number",
      "description": "Tamanho do arquivo em bytes"
    },
    "category": {
      "type": "string",
      "enum": [
        "jogo",
        "treino",
        "marketing",
        "outros"
      ],
      "default": "outros",
      "description": "Categoria do upload"
    },
    "description": {
      "type": "string",
      "description": "Descrição do arquivo"
    },
    "processing_status": {
      "type": "string",
      "enum": [
        "pending",
        "processing",
        "completed",
        "failed"
      ],
      "default": "pending",
      "description": "Status do processamento"
    },
    "metadata": {
      "type": "object",
      "description": "Metadados do arquivo (dimensões, duração, etc.)"
    },
    "is_featured": {
      "type": "boolean",
      "default": false,
      "description": "Se o upload está em destaque no perfil do atleta"
    }
  },
  "required": [
    "user_id",
    "file_url",
    "file_name",
    "file_type"
  ]
}
```

Campos built-in confirmados por documentação:

- `id`: `string`
- `created_date`: `string`
- `updated_date`: `string`
- `created_by`: `string`

Superfície de API confirmada para `AthleteUpload`:

- `GET /entities/AthleteUpload`
- `POST /entities/AthleteUpload`
- `DELETE /entities/AthleteUpload`
- `POST /entities/AthleteUpload/bulk`
- `PUT /entities/AthleteUpload/bulk`
- `PATCH /entities/AthleteUpload/update-many`
- `GET /entities/AthleteUpload/{AthleteUpload_id}`
- `PUT /entities/AthleteUpload/{AthleteUpload_id}`
- `DELETE /entities/AthleteUpload/{AthleteUpload_id}`
- `PUT /entities/AthleteUpload/{AthleteUpload_id}/restore`

Operações de SDK/REST confirmadas por documentação:

- `list()`
- `create()`
- `deleteMany()`
- `bulkCreate()`
- `get(recordId)`
- `update(recordId, data)`
- `delete(recordId)`
- `restore(recordId)`

Observação:
- para `bulk update` e `update-many`, a própria documentação indica uso da REST API, não do SDK
- a captura visual da lista de endpoints bate com esse inventário e reforça que não houve transcrição incorreta nesse bloco

## `AthleteStory`

Fonte:
- captura visual de `entities/AthleteStory`

Schema confirmado:

```json
{
  "name": "AthleteStory",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Título do story (nome do atleta, vaga, novidade)"
    },
    "category": {
      "type": "string",
      "enum": [
        "atleta",
        "vaga",
        "novidade"
      ],
      "default": "atleta",
      "description": "Tipo de story"
    },
    "media_url": {
      "type": "string",
      "description": "URL do vídeo ou foto"
    },
    "media_type": {
      "type": "string",
      "enum": [
        "photo",
        "video"
      ],
      "description": "Tipo de mídia"
    },
    "thumbnail_url": {
      "type": "string",
      "description": "URL da thumbnail (para vídeos)"
    },
    "description": {
      "type": "string",
      "description": "Descrição ou legenda"
    },
    "is_featured": {
      "type": "boolean",
      "default": false,
      "description": "Se está em destaque"
    },
    "display_order": {
      "type": "number",
      "default": 0,
      "description": "Ordem de exibição"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Se está ativo"
    },
    "link_url": {
      "type": "string",
      "description": "Link externo opcional (para vagas/novidades)"
    }
  },
  "required": [
    "title",
    "media_url",
    "media_type",
    "category"
  ]
}
```

## `AthleteTask`

Fonte:
- captura visual de `entities/AthleteTask`

Schema confirmado na parte legível:

```json
{
  "name": "AthleteTask",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID do atleta"
    },
    "task_title": {
      "type": "string",
      "description": "Título da tarefa"
    },
    "task_description": {
      "type": "string",
      "description": "Descrição detalhada"
    },
    "task_type": {
      "type": "string",
      "enum": [
        "treino",
        "video",
        "mentoria",
        "avaliacao",
        "outro"
      ],
      "description": "Tipo de tarefa"
    },
    "due_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data limite"
    },
    "priority": {
      "type": "string",
      "enum": [
        "baixa",
        "media",
        "alta",
        "urgente"
      ],
      "default": "media",
      "description": "Prioridade"
    },
    "status": {
      "type": "string",
      "enum": [
        "pendente",
        "andamento",
        "concluida",
        "cancelada"
      ],
      "default": "pendente",
      "description": "Status da tarefa"
    },
    "points_reward": {
      "type": "number",
      "default": 25,
      "description": "Pontos ao completar"
    },
    "assigned_by_admin": {
      "type": "string",
      "description": "ID do admin que atribuiu"
    },
    "completion_notes": {
      "type": "string",
      "description": "Notas ao completar"
    },
    "completed_at": {
      "type": "string",
      "format": "date-time",
      "description": "Data de conclusão"
    }
  },
  "required_visible": [
    "user_id",
    "task_title",
    "task_type"
  ]
}
```

Observação:
- o bloco de `required` aparece parcialmente na captura
- os itens acima são apenas os que ficaram legíveis

## `AthleteTrophy`

Fonte:
- captura visual de `entities/AthleteTrophy`

Schema confirmado na parte legível:

```json
{
  "name": "AthleteTrophy",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID do atleta"
    },
    "trophy_name": {
      "type": "string",
      "description": "Nome do troféu/conquista"
    },
    "trophy_type": {
      "type": "string",
      "description": "Tipo de troféu"
    },
    "trophy_icon_url": {
      "type": "string",
      "description": "URL do ícone do troféu"
    },
    "year_won": {
      "type": "number",
      "description": "Ano da conquista"
    },
    "quantity": {
      "type": "number",
      "default": 1,
      "description": "Quantidade de vezes conquistado"
    },
    "description": {
      "type": "string",
      "description": "Descrição da conquista"
    }
  },
  "required_visible": [
    "user_id",
    "trophy_name",
    "year_won"
  ]
}
```

Observação:
- o campo `trophy_type` mostra um `enum` na captura, mas os valores não ficaram nítidos o suficiente para transcrição segura
- o bloco de `required` também está apenas parcialmente legível

## `Content`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/Content`

Schema confirmado:

```json
{
  "name": "Content",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Título do conteúdo"
    },
    "description": {
      "type": "string",
      "description": "Descrição do conteúdo"
    },
    "thumbnail_url": {
      "type": "string",
      "description": "URL da imagem de capa"
    },
    "video_url": {
      "type": "string",
      "description": "URL do vídeo (para VOD ou link da live)"
    },
    "preview_video_url": {
      "type": "string",
      "description": "URL para um clipe curto (5-10s) para autoplay no card"
    },
    "live_embed_code": {
      "type": "string",
      "description": "Código de incorporação para lives"
    },
    "external_link": {
      "type": "string",
      "description": "Link externo para planos"
    },
    "card_color": {
      "type": "string",
      "description": "Cor do card para efeito neon (ex: blue, green)"
    },
    "category": {
      "type": "string",
      "enum": [
        "mentoria",
        "treino_tatico",
        "preparacao_fisica",
        "psicologia",
        "nutricao",
        "live",
        "planos",
        "atletas",
        "feed_posts"
      ],
      "description": "Categoria do conteúdo"
    },
    "access_level": {
      "type": "string",
      "enum": [
        "basic",
        "elite"
      ],
      "default": "basic"
    },
    "duration": {
      "type": "number",
      "description": "Duração em minutos"
    },
    "instructor": {
      "type": "string",
      "description": "Nome do instrutor"
    },
    "is_featured": {
      "type": "boolean",
      "default": false
    },
    "is_published": {
      "type": "boolean",
      "default": false
    },
    "is_top_10": {
      "type": "boolean",
      "default": false,
      "description": "Se está no Top 10 mais assistidos"
    },
    "status": {
      "type": "string",
      "enum": [
        "draft",
        "published",
        "live",
        "ended",
        "archived"
      ],
      "default": "draft",
      "description": "Status do conteúdo, especialmente para lives."
    },
    "display_order": {
      "type": "number",
      "default": 0,
      "description": "Ordem de exibição (menor número aparece primeiro)"
    }
  },
  "required": [
    "title",
    "category",
    "access_level"
  ]
}
```

## `ContentIdea`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/ContentIdea`

Schema confirmado:

```json
{
  "name": "ContentIdea",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Título da ideia"
    },
    "description": {
      "type": "string",
      "description": "Descrição detalhada da ideia"
    },
    "content_type": {
      "type": "string",
      "enum": [
        "reel",
        "post",
        "story",
        "carrossel",
        "live",
        "video_longo"
      ],
      "description": "Tipo de conteúdo sugerido"
    },
    "platform": {
      "type": "string",
      "enum": [
        "instagram",
        "tiktok",
        "youtube",
        "facebook",
        "linkedin"
      ],
      "description": "Plataforma sugerida"
    },
    "content_pillar": {
      "type": "string",
      "enum": [
        "dor",
        "autoridade",
        "urgencia",
        "mentalidade",
        "prova_social",
        "educativo",
        "promocional"
      ],
      "description": "Pilar de conteúdo"
    },
    "service_focus": {
      "type": "string",
      "enum": [
        "plano_carreira",
        "revela_talentos",
        "intercambios",
        "campeonatos",
        "eurocamp",
        "geral"
      ],
      "description": "Serviço em foco"
    },
    "suggested_by": {
      "type": "string",
      "description": "ID de quem sugeriu a ideia"
    },
    "status": {
      "type": "string",
      "enum": [
        "suggested",
        "approved",
        "in_production",
        "published",
        "rejected"
      ],
      "default": "suggested",
      "description": "Status da ideia"
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "urgent"
      ],
      "default": "medium",
      "description": "Prioridade da ideia"
    },
    "estimated_production_time": {
      "type": "number",
      "description": "Tempo estimado de produção em horas"
    },
    "target_date": {
      "type": "string",
      "format": "date",
      "description": "Data alvo para publicação"
    },
    "keywords": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Palavras-chave relacionadas"
    },
    "reference_links": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Links de referência ou inspiração"
    }
  },
  "required": [
    "title",
    "description",
    "content_type",
    "content_pillar"
  ]
}
```

## `CareerPost`

Fonte:
- captura visual de `entities/CareerPost`

Schema confirmado:

```json
{
  "name": "CareerPost",
  "type": "object",
  "properties": {
    "post_type": {
      "type": "string",
      "enum": [
        "devotional",
        "player_of_week",
        "challenge"
      ],
      "description": "O tipo do post especial no feed."
    },
    "title": {
      "type": "string",
      "description": "Título do post (ex: Desafio da Semana)."
    },
    "content": {
      "type": "string",
      "description": "Conteúdo principal do post (versículo, descrição do desafio, etc)."
    },
    "image_url": {
      "type": "string",
      "description": "URL de uma imagem de apoio para o post."
    },
    "reference": {
      "type": "string",
      "description": "Referência bíblica para o devocional."
    },
    "reflection": {
      "type": "string",
      "description": "Pequena reflexão para o devocional."
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Controla se o post está visível no feed."
    }
  },
  "required": [
    "post_type",
    "title",
    "content"
  ]
}
```

## `ChatMessage`

Fonte:
- captura visual de `entities/ChatMessage`

Schema confirmado:

```json
{
  "name": "ChatMessage",
  "type": "object",
  "properties": {
    "sender_id": {
      "type": "string",
      "description": "ID do remetente"
    },
    "receiver_id": {
      "type": "string",
      "description": "ID do destinatário"
    },
    "conversation_id": {
      "type": "string",
      "description": "ID da conversa"
    },
    "content": {
      "type": "string",
      "description": "Conteúdo da mensagem"
    },
    "message_type": {
      "type": "string",
      "enum": [
        "text",
        "image",
        "video",
        "file"
      ],
      "default": "text",
      "description": "Tipo da mensagem"
    },
    "file_url": {
      "type": "string",
      "description": "URL do arquivo anexado"
    },
    "read": {
      "type": "boolean",
      "default": false,
      "description": "Se a mensagem foi lida"
    },
    "read_at": {
      "type": "string",
      "format": "date-time",
      "description": "Quando a mensagem foi lida"
    }
  },
  "required": [
    "sender_id",
    "receiver_id",
    "content"
  ]
}
```

## `Comment`

Fonte:
- captura visual de `entities/Comment`

Schema confirmado:

```json
{
  "name": "Comment",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID do usuário que fez o comentário"
    },
    "content_id": {
      "type": "string",
      "description": "ID do conteúdo (vídeo/live) que está sendo comentado"
    },
    "comment_text": {
      "type": "string",
      "description": "O texto do comentário"
    }
  },
  "required": [
    "user_id",
    "content_id",
    "comment_text"
  ]
}
```

## `CRMLead`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/CRMLead`

Schema confirmado:

```json
{
  "name": "CRMLead",
  "type": "object",
  "properties": {
    "full_name": {
      "type": "string",
      "description": "Nome completo do lead"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Email do lead"
    },
    "phone": {
      "type": "string",
      "description": "Telefone/WhatsApp"
    },
    "source": {
      "type": "string",
      "enum": [
        "revela_talentos_form",
        "plano_carreira_form",
        "plano_internacional_form",
        "lead_page",
        "whatsapp",
        "referral",
        "social_media",
        "manual"
      ],
      "description": "Origem do lead"
    },
    "service_interest": {
      "type": "string",
      "description": "Serviço de interesse"
    },
    "pipeline_id": {
      "type": "string",
      "description": "ID do pipeline associado"
    },
    "current_stage": {
      "type": "string",
      "description": "Estágio atual no pipeline"
    },
    "sales_rep_id": {
      "type": "string",
      "description": "ID do vendedor responsável"
    },
    "lead_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Pontuação do lead"
    },
    "value": {
      "type": "number",
      "description": "Valor potencial ou fechado da negociação"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Tags para organização (ex: 'Hot', 'Follow-up Urgente')"
    },
    "contact_history": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "date": {
            "type": "string",
            "format": "date-time"
          },
          "type": {
            "type": "string",
            "enum": [
              "call",
              "whatsapp",
              "email",
              "meeting"
            ]
          },
          "notes": {
            "type": "string"
          },
          "outcome": {
            "type": "string"
          }
        }
      },
      "description": "Histórico de contatos"
    },
    "documents": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "url": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "uploaded_date": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "description": "Documentos anexados"
    },
    "whatsapp_chat_id": {
      "type": "string",
      "description": "ID do chat do WhatsApp"
    },
    "proposal_history": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "date": {
            "type": "string",
            "format": "date-time"
          },
          "value": {
            "type": "number"
          },
          "status": {
            "type": "string"
          },
          "notes": {
            "type": "string"
          }
        }
      },
      "description": "Histórico de propostas"
    },
    "next_followup": {
      "type": "string",
      "format": "date-time",
      "description": "Data do próximo follow-up"
    },
    "lost_reason": {
      "type": "string",
      "description": "Motivo da perda (se aplicável)"
    },
    "responsible_name": {
      "type": "string",
      "description": "Nome do responsável (pai/mãe/agente)"
    },
    "responsible_phone": {
      "type": "string",
      "description": "Telefone do responsável"
    },
    "responsible_email": {
      "type": "string",
      "description": "Email do responsável"
    },
    "responsible_relation": {
      "type": "string",
      "enum": [
        "pai",
        "mae",
        "empresario",
        "treinador",
        "tutor",
        "outro"
      ],
      "description": "Relação com o atleta"
    },
    "avatar_url": {
      "type": "string",
      "description": "URL da foto/avatar do atleta"
    },
    "internal_id": {
      "type": "string",
      "description": "ID interno ou número de cadastro"
    },
    "city": {
      "type": "string",
      "description": "Cidade"
    },
    "state": {
      "type": "string",
      "description": "Estado"
    },
    "country": {
      "type": "string",
      "description": "País"
    },
    "instagram": {
      "type": "string",
      "description": "Link do Instagram"
    },
    "youtube": {
      "type": "string",
      "description": "Link do YouTube"
    },
    "highlight_reel": {
      "type": "string",
      "description": "Link do highlight reel"
    },
    "birth_date": {
      "type": "string",
      "format": "date",
      "description": "Data de nascimento"
    },
    "height": {
      "type": "number",
      "description": "Altura em cm"
    },
    "weight": {
      "type": "number",
      "description": "Peso em kg"
    },
    "position": {
      "type": "string",
      "enum": [
        "goleiro",
        "zagueiro",
        "lateral",
        "meio-campo",
        "atacante"
      ],
      "description": "Posição em campo"
    },
    "current_club": {
      "type": "string",
      "description": "Clube atual"
    },
    "previous_clubs": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Clubes anteriores"
    },
    "dominant_foot": {
      "type": "string",
      "enum": [
        "direito",
        "esquerdo",
        "ambidestro"
      ],
      "description": "Pé dominante"
    },
    "stats": {
      "type": "object",
      "properties": {
        "goals": {
          "type": "number"
        },
        "assists": {
          "type": "number"
        },
        "games": {
          "type": "number"
        },
        "yellow_cards": {
          "type": "number"
        },
        "red_cards": {
          "type": "number"
        }
      },
      "description": "Estatísticas do atleta"
    },
    "video_url": {
      "type": "string",
      "description": "URL do vídeo do atleta"
    },
    "payment_status": {
      "type": "string",
      "enum": [
        "pending",
        "partial",
        "completed",
        "overdue"
      ],
      "default": "pending",
      "description": "Status do pagamento"
    },
    "payment_receipts": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "URLs dos comprovantes de pagamento"
    },
    "lead_origin_detail": {
      "type": "string",
      "description": "Detalhamento da origem"
    },
    "stage_history": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "stage": {
            "type": "string"
          },
          "moved_by": {
            "type": "string"
          },
          "moved_at": {
            "type": "string",
            "format": "date-time"
          },
          "notes": {
            "type": "string"
          }
        }
      },
      "description": "Histórico de movimentações no funil"
    },
    "next_steps": {
      "type": "string",
      "description": "Próximos passos agendados"
    },
    "vendor_notes": {
      "type": "string",
      "description": "Anotações manuais do vendedor"
    }
  },
  "required": [
    "full_name",
    "email",
    "source",
    "sales_rep_id"
  ]
}
```

## `DynamicForm`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/DynamicForm`

Schema confirmado:

```json
{
  "name": "DynamicForm",
  "type": "object",
  "properties": {
    "form_name": {
      "type": "string",
      "description": "Nome do formulário"
    },
    "form_title": {
      "type": "string",
      "description": "Título exibido no formulário"
    },
    "target_entity": {
      "type": "string",
      "description": "Nome da entidade onde os dados serão salvos"
    },
    "fields": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "type": {
            "type": "string",
            "enum": [
              "text",
              "email",
              "phone",
              "date",
              "select",
              "textarea",
              "checkbox",
              "radio",
              "number"
            ]
          },
          "required": {
            "type": "boolean"
          },
          "options": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "validation": {
            "type": "object"
          },
          "placeholder": {
            "type": "string"
          }
        }
      }
    },
    "success_action": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "redirect",
            "message",
            "email"
          ]
        },
        "value": {
          "type": "string"
        }
      }
    },
    "integrations": {
      "type": "object",
      "properties": {
        "crm_pipeline": {
          "type": "string"
        },
        "email_notifications": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "webhook_url": {
          "type": "string"
        }
      }
    },
    "analytics": {
      "type": "object",
      "properties": {
        "submissions_count": {
          "type": "number",
          "default": 0
        },
        "conversion_rate": {
          "type": "number"
        },
        "last_submission": {
          "type": "string",
          "format": "date-time"
        }
      }
    }
  },
  "required": [
    "form_name",
    "target_entity",
    "fields"
  ]
}
```

## `Event`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/Event`

Schema confirmado:

```json
{
  "name": "Event",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Título do evento"
    },
    "description": {
      "type": "string",
      "description": "Descrição detalhada do evento"
    },
    "event_type": {
      "type": "string",
      "enum": [
        "presencial",
        "online",
        "jogo",
        "treino",
        "mentoria",
        "reuniao"
      ],
      "description": "Tipo do evento"
    },
    "event_category": {
      "type": "string",
      "description": "Categoria customizada do evento"
    },
    "start_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data e hora de início"
    },
    "end_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data e hora de fim"
    },
    "location": {
      "type": "string",
      "description": "Local do evento (endereço ou link)"
    },
    "target_users": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "IDs dos usuários específicos (vazio = todos)"
    },
    "is_mandatory": {
      "type": "boolean",
      "default": false,
      "description": "Se a participação é obrigatória"
    },
    "max_participants": {
      "type": "number",
      "description": "Número máximo de participantes"
    },
    "meeting_link": {
      "type": "string",
      "description": "Link da reunião online"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Se o evento está ativo"
    },
    "reminder_sent": {
      "type": "boolean",
      "default": false,
      "description": "Se o lembrete foi enviado"
    }
  },
  "required": [
    "title",
    "event_type",
    "start_date"
  ]
}
```

## `InternationalLead`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/InternationalLead`

Schema confirmado:

```json
{
  "name": "InternationalLead",
  "type": "object",
  "properties": {
    "full_name": {
      "type": "string",
      "description": "Nome completo do atleta"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Email do atleta"
    },
    "phone": {
      "type": "string",
      "description": "WhatsApp/Telefone"
    },
    "birth_date": {
      "type": "string",
      "format": "date",
      "description": "Data de nascimento"
    },
    "position": {
      "type": "string",
      "enum": [
        "goleiro",
        "zagueiro",
        "lateral",
        "meio-campo",
        "atacante"
      ],
      "description": "Posição em campo"
    },
    "preferred_country": {
      "type": "string",
      "description": "País de interesse"
    },
    "video_links": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Links para vídeos do atleta"
    },
    "experience_level": {
      "type": "string",
      "enum": [
        "amador",
        "semi_profissional",
        "profissional"
      ],
      "description": "Nível de experiência"
    },
    "current_club": {
      "type": "string",
      "description": "Clube atual"
    },
    "source_page": {
      "type": "string",
      "description": "Página de origem do lead"
    },
    "status": {
      "type": "string",
      "enum": [
        "novo",
        "contatado",
        "qualificado",
        "proposta_enviada",
        "fechado",
        "perdido"
      ],
      "default": "novo",
      "description": "Status do lead no funil"
    },
    "notes": {
      "type": "string",
      "description": "Observações do time comercial"
    },
    "lgpd_consent": {
      "type": "boolean",
      "default": false,
      "description": "Consentimento LGPD"
    },
    "height": {
      "type": "number",
      "description": "Altura em cm"
    },
    "weight": {
      "type": "number",
      "description": "Peso em kg"
    },
    "preferred_foot": {
      "type": "string",
      "enum": [
        "direito",
        "esquerdo",
        "ambidestro"
      ],
      "description": "Pé preferido"
    },
    "seller_notes": {
      "type": "string",
      "description": "Observações do vendedor"
    },
    "quit_reason": {
      "type": "string",
      "description": "Motivo da desistência"
    },
    "total_value": {
      "type": "number",
      "description": "Valor total do serviço"
    },
    "paid_value": {
      "type": "number",
      "description": "Valor já pago"
    },
    "payment_status": {
      "type": "string",
      "enum": [
        "pending",
        "partial",
        "completed"
      ],
      "default": "pending",
      "description": "Status do pagamento"
    },
    "last_contact": {
      "type": "string",
      "format": "date-time",
      "description": "Data do último contato"
    },
    "next_followup": {
      "type": "string",
      "format": "date-time",
      "description": "Data do próximo follow-up"
    }
  },
  "required": [
    "full_name",
    "email",
    "phone",
    "position",
    "lgpd_consent"
  ]
}
```

## `Lead`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/Lead`

Schema confirmado:

```json
{
  "name": "Lead",
  "type": "object",
  "properties": {
    "full_name": {
      "type": "string",
      "description": "Nome completo do interessado"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Email do interessado"
    },
    "phone": {
      "type": "string",
      "description": "WhatsApp/Telefone"
    },
    "birth_date": {
      "type": "string",
      "format": "date",
      "description": "Data de nascimento"
    },
    "position": {
      "type": "string",
      "enum": [
        "goleiro",
        "zagueiro",
        "lateral",
        "meio-campo",
        "atacante"
      ],
      "description": "Posição em campo"
    },
    "lead_category": {
      "type": "string",
      "enum": [
        "revela_talentos",
        "plano_carreira",
        "plano_internacional"
      ],
      "description": "Categoria do lead"
    },
    "current_club": {
      "type": "string",
      "description": "Clube atual"
    },
    "experience_level": {
      "type": "string",
      "enum": [
        "iniciante",
        "amador",
        "semi_profissional",
        "profissional"
      ],
      "description": "Nível de experiência"
    },
    "objectives": {
      "type": "string",
      "description": "Objetivos do atleta"
    },
    "source_page": {
      "type": "string",
      "description": "Página de origem do lead"
    },
    "status": {
      "type": "string",
      "enum": [
        "novo",
        "contatado",
        "qualificado",
        "proposta_enviada",
        "fechado",
        "perdido"
      ],
      "default": "novo",
      "description": "Status do lead no funil"
    },
    "priority": {
      "type": "string",
      "enum": [
        "baixa",
        "media",
        "alta",
        "urgente"
      ],
      "default": "media",
      "description": "Prioridade do lead"
    },
    "notes": {
      "type": "string",
      "description": "Observações do time comercial"
    },
    "assigned_to": {
      "type": "string",
      "description": "ID do vendedor responsável"
    },
    "lgpd_consent": {
      "type": "boolean",
      "default": false,
      "description": "Consentimento LGPD"
    },
    "height": {
      "type": "number",
      "description": "Altura em cm"
    },
    "weight": {
      "type": "number",
      "description": "Peso em kg"
    },
    "preferred_foot": {
      "type": "string",
      "enum": [
        "direito",
        "esquerdo",
        "ambidestro"
      ],
      "description": "Pé preferido"
    },
    "video_url": {
      "type": "string",
      "description": "URL do vídeo/DVD do atleta"
    },
    "seller_notes": {
      "type": "string",
      "description": "Observações do vendedor"
    },
    "quit_reason": {
      "type": "string",
      "description": "Motivo da desistência"
    },
    "total_value": {
      "type": "number",
      "description": "Valor total do serviço"
    },
    "paid_value": {
      "type": "number",
      "description": "Valor já pago"
    },
    "payment_status": {
      "type": "string",
      "enum": [
        "pending",
        "partial",
        "completed"
      ],
      "default": "pending",
      "description": "Status do pagamento"
    },
    "last_contact": {
      "type": "string",
      "format": "date-time",
      "description": "Data do último contato"
    },
    "next_followup": {
      "type": "string",
      "format": "date-time",
      "description": "Data do próximo follow-up"
    }
  },
  "required": [
    "full_name",
    "email",
    "phone",
    "lead_category",
    "lgpd_consent"
  ]
}
```

## `CRMPipeline`

Fonte:
- captura visual de `entities/CRMPipeline`

Schema confirmado:

```json
{
  "name": "CRMPipeline",
  "type": "object",
  "properties": {
    "pipeline_name": {
      "type": "string",
      "description": "Nome do pipeline de vendas (ex: Vendas - Plano de Carreira)"
    },
    "service_category": {
      "type": "string",
      "description": "Categoria de serviço associada a este pipeline"
    },
    "stages": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Nomes das etapas do funil (ex: ['Novo', 'Qualificado', 'Proposta'])"
    },
    "sales_rep_id": {
      "type": "string",
      "description": "ID do vendedor dono deste pipeline específico"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Se o pipeline está ativo"
    }
  },
  "required": [
    "pipeline_name",
    "stages",
    "sales_rep_id"
  ]
}
```

## `CRMService`

Fonte:
- captura visual de `entities/CRMService`

Schema confirmado na parte legível:

```json
{
  "name": "CRMService",
  "type": "object",
  "properties": {
    "service_name": {
      "type": "string",
      "description": "Nome do serviço da EC10"
    },
    "service_category": {
      "type": "string",
      "enum": [
        "plano_carreira",
        "revela_talentos",
        "campeonatos",
        "intercambios",
        "gestao_atletas",
        "bolsa_clubes"
      ],
      "description": "Categoria do serviço"
    },
    "description": {
      "type": "string",
      "description": "Descrição detalhada do serviço"
    },
    "price_range": {
      "type": "object",
      "properties": {
        "min": {
          "type": "number"
        },
        "max": {
          "type": "number"
        }
      },
      "description": "Faixa de preço do serviço"
    },
    "sales_materials": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "URLs dos materiais de apoio"
    },
    "target_audience": {
      "type": "string",
      "description": "Público-alvo do serviço"
    },
    "duration_months": {
      "type": "number",
      "description": "Duração típica em meses"
    },
    "features": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Características principais"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Se o serviço está ativo"
    }
  }
}
```

Observação:
- o bloco `required` não ficou visível na captura

## `CustomTask`

Fonte:
- captura visual de `entities/CustomTask`

Schema confirmado:

```json
{
  "name": "CustomTask",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Título da tarefa"
    },
    "description": {
      "type": "string",
      "description": "Descrição da tarefa"
    },
    "assigned_user_id": {
      "type": "string",
      "description": "ID do usuário responsável pela tarefa (opcional)"
    },
    "related_lead_id": {
      "type": "string",
      "description": "ID do lead relacionado"
    },
    "related_lead_type": {
      "type": "string",
      "enum": [
        "Lead",
        "InternationalLead"
      ],
      "description": "Tipo de entidade do lead"
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "urgent"
      ],
      "default": "medium",
      "description": "Prioridade da tarefa"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "in_progress",
        "completed",
        "cancelled"
      ],
      "default": "pending",
      "description": "Status da tarefa"
    },
    "due_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data limite para conclusão"
    },
    "completion_notes": {
      "type": "string",
      "description": "Observações ou resultado da tarefa concluída"
    }
  },
  "required": [
    "title",
    "related_lead_id",
    "related_lead_type"
  ]
}
```

## `DailyCheckin`

Fonte:
- captura visual de `entities/DailyCheckin`

Schema confirmado:

```json
{
  "name": "DailyCheckin",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID do atleta"
    },
    "checkin_date": {
      "type": "string",
      "format": "date",
      "description": "Data do check-in"
    },
    "mood": {
      "type": "string",
      "enum": [
        "excelente",
        "bom",
        "neutro",
        "cansado",
        "desmotivado"
      ],
      "description": "Estado emocional"
    },
    "energy_level": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "Nível de energia (1-5)"
    },
    "sleep_hours": {
      "type": "number",
      "description": "Horas de sono"
    },
    "hydration_liters": {
      "type": "number",
      "description": "Litros de água consumidos"
    },
    "trained_today": {
      "type": "boolean",
      "default": false,
      "description": "Se treinou hoje"
    },
    "injuries": {
      "type": "string",
      "description": "Lesões ou desconfortos"
    },
    "notes": {
      "type": "string",
      "description": "Notas pessoais do dia"
    },
    "points_earned": {
      "type": "number",
      "default": 10,
      "description": "Pontos ganhos por check-in"
    },
    "streak_days": {
      "type": "number",
      "default": 1,
      "description": "Dias consecutivos de check-in"
    }
  },
  "required": [
    "user_id",
    "checkin_date",
    "mood"
  ]
}
```

## `FeaturedPlayer`

Fonte:
- captura visual de `entities/FeaturedPlayer`

Schema confirmado:

```json
{
  "name": "FeaturedPlayer",
  "type": "object",
  "properties": {
    "player_name": {
      "type": "string",
      "description": "Nome do jogador destaque"
    },
    "position": {
      "type": "string",
      "enum": [
        "goleiro",
        "zagueiro",
        "lateral",
        "volante",
        "meia",
        "atacante"
      ],
      "description": "Posição do jogador"
    },
    "photo_url": {
      "type": "string",
      "description": "URL da foto do jogador"
    },
    "club": {
      "type": "string",
      "description": "Clube atual"
    },
    "age": {
      "type": "number",
      "description": "Idade do jogador"
    },
    "nationality": {
      "type": "string",
      "description": "Nacionalidade"
    },
    "achievement": {
      "type": "string",
      "description": "Principal conquista recente"
    },
    "stats": {
      "type": "object",
      "properties": {
        "games": {
          "type": "number"
        },
        "goals": {
          "type": "number"
        },
        "assists": {
          "type": "number"
        }
      },
      "description": "Estatísticas do jogador"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Se o jogador está ativo na lista de destaques"
    },
    "display_order": {
      "type": "number",
      "default": 0,
      "description": "Ordem de exibição (menor aparece primeiro)"
    }
  },
  "required": [
    "player_name",
    "position",
    "photo_url"
  ]
}
```

## `GameSchedule`

Fonte:
- captura visual de `entities/GameSchedule`

Schema confirmado:

```json
{
  "name": "GameSchedule",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID do usuário"
    },
    "opponent": {
      "type": "string",
      "description": "Nome do adversário"
    },
    "game_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data e hora do jogo"
    },
    "venue": {
      "type": "string",
      "description": "Local do jogo"
    },
    "competition": {
      "type": "string",
      "description": "Competição"
    },
    "status": {
      "type": "string",
      "enum": [
        "scheduled",
        "completed",
        "cancelled"
      ],
      "default": "scheduled",
      "description": "Status do jogo"
    },
    "home_away": {
      "type": "string",
      "enum": [
        "home",
        "away"
      ],
      "description": "Casa ou fora"
    },
    "importance": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high"
      ],
      "default": "medium",
      "description": "Importância do jogo"
    },
    "preparation_notes": {
      "type": "string",
      "description": "Notas de preparação"
    }
  },
  "required": [
    "user_id",
    "opponent",
    "game_date",
    "venue"
  ]
}
```

## `LeadPageBuilder`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/LeadPageBuilder`

Schema confirmado:

```json
{
  "name": "LeadPageBuilder",
  "type": "object",
  "properties": {
    "page_name": {
      "type": "string",
      "description": "Nome da página (ex: revela-talentos-v2)"
    },
    "page_title": {
      "type": "string",
      "description": "Título da página para SEO"
    },
    "page_url": {
      "type": "string",
      "description": "URL da página (auto-gerada)"
    },
    "meta_description": {
      "type": "string",
      "description": "Meta descrição para SEO"
    },
    "components": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "type": {
            "type": "string",
            "enum": [
              "hero",
              "text",
              "image",
              "video",
              "card_grid",
              "testimonials",
              "pricing",
              "form",
              "cta",
              "faq"
            ]
          },
          "order": {
            "type": "number"
          },
          "settings": {
            "type": "object"
          },
          "content": {
            "type": "object"
          }
        }
      },
      "description": "Lista de componentes da página"
    },
    "form_config": {
      "type": "object",
      "properties": {
        "entity_name": {
          "type": "string"
        },
        "fields": {
          "type": "array"
        },
        "redirect_url": {
          "type": "string"
        },
        "thank_you_message": {
          "type": "string"
        }
      },
      "description": "Configuração do formulário se houver"
    },
    "is_published": {
      "type": "boolean",
      "default": false,
      "description": "Se a página está publicada"
    },
    "theme": {
      "type": "string",
      "enum": [
        "dark",
        "light",
        "ec10_branded"
      ],
      "default": "ec10_branded",
      "description": "Tema da página"
    },
    "tracking_config": {
      "type": "object",
      "properties": {
        "google_analytics": {
          "type": "string"
        },
        "facebook_pixel": {
          "type": "string"
        },
        "utm_source": {
          "type": "string"
        }
      },
      "description": "Configurações de tracking"
    }
  },
  "required": [
    "page_name",
    "page_title",
    "components"
  ]
}
```

## `LeadInteraction`

Fonte:
- captura visual de `entities/LeadInteraction`

Schema confirmado:

```json
{
  "name": "LeadInteraction",
  "type": "object",
  "properties": {
    "lead_id": {
      "type": "string",
      "description": "ID do lead"
    },
    "lead_type": {
      "type": "string",
      "enum": [
        "general",
        "international"
      ],
      "description": "Tipo do lead"
    },
    "interaction_type": {
      "type": "string",
      "enum": [
        "call",
        "whatsapp",
        "email",
        "meeting",
        "material_sent",
        "follow_up"
      ],
      "description": "Tipo de interação"
    },
    "notes": {
      "type": "string",
      "description": "Observações da interação"
    },
    "outcome": {
      "type": "string",
      "enum": [
        "positive",
        "negative",
        "neutral",
        "no_response"
      ],
      "description": "Resultado da interação"
    },
    "next_action": {
      "type": "string",
      "description": "Próxima ação planejada"
    },
    "scheduled_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data agendada para próxima ação"
    },
    "sales_rep": {
      "type": "string",
      "description": "Vendedor responsável"
    },
    "material_sent": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "IDs dos materiais enviados"
    }
  },
  "required": [
    "lead_id",
    "lead_type",
    "interaction_type",
    "sales_rep"
  ]
}
```

## `LeadPage`

Fonte:
- captura visual de `entities/LeadPage`

Schema confirmado:

```json
{
  "name": "LeadPage",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome da página para identificação interna"
    },
    "url_slug": {
      "type": "string",
      "description": "Slug da URL para acessar a página (ex: /lp/revela-talentos-2024)"
    },
    "html_content": {
      "type": "string",
      "description": "Conteúdo HTML completo da página"
    },
    "visibility": {
      "type": "string",
      "enum": [
        "hub_icon",
        "sidebar_link",
        "hidden"
      ],
      "default": "hidden",
      "description": "Como a página será exibida na plataforma"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Se a página está ativa e acessível"
    },
    "icon": {
      "type": "string",
      "description": "Nome do ícone do lucide-react (se visibilidade for hub_icon)"
    },
    "crm_connection_info": {
      "type": "object",
      "properties": {
        "target_entity": {
          "type": "string",
          "enum": [
            "Lead",
            "InternationalLead"
          ],
          "description": "Qual entidade CRM este formulário preenche"
        },
        "field_mapping": {
          "type": "object",
          "description": "Mapeamento dos 'name' dos inputs do formulário para os campos da entidade. Ex: {'nome-completo': 'full_name'}"
        }
      },
      "description": "Informações para conectar um formulário HTML ao CRM"
    }
  },
  "required": [
    "name",
    "url_slug",
    "html_content"
  ]
}
```

## `MarketingCampaign`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/MarketingCampaign`

Schema confirmado:

```json
{
  "name": "MarketingCampaign",
  "type": "object",
  "properties": {
    "campaign_name": { "type": "string", "description": "Nome da campanha" },
    "platform": {
      "type": "string",
      "enum": ["meta_ads", "google_ads", "tiktok_ads", "youtube_ads", "organic"],
      "description": "Plataforma da campanha"
    },
    "campaign_type": {
      "type": "string",
      "enum": ["lead_generation", "brand_awareness", "conversion", "retargeting", "engagement"],
      "description": "Tipo da campanha"
    },
    "service_target": {
      "type": "string",
      "enum": ["plano_carreira", "revela_talentos", "intercambios", "campeonatos", "eurocamp", "geral"],
      "description": "Serviço alvo da campanha"
    },
    "budget_daily": { "type": "number", "description": "Orçamento diário" },
    "budget_total": { "type": "number", "description": "Orçamento total" },
    "start_date": { "type": "string", "format": "date", "description": "Data de início" },
    "end_date": { "type": "string", "format": "date", "description": "Data de término" },
    "status": {
      "type": "string",
      "enum": ["draft", "active", "paused", "completed", "cancelled"],
      "default": "draft",
      "description": "Status da campanha"
    },
    "target_audience": {
      "type": "object",
      "properties": {
        "age_min": { "type": "number" },
        "age_max": { "type": "number" },
        "interests": { "type": "array", "items": { "type": "string" } },
        "locations": { "type": "array", "items": { "type": "string" } },
        "gender": { "type": "string" }
      },
      "description": "Público-alvo"
    },
    "creative_assets": {
      "type": "array",
      "items": { "type": "string" },
      "description": "URLs dos materiais criativos"
    },
    "landing_page_url": { "type": "string", "description": "URL da landing page" },
    "metrics": {
      "type": "object",
      "properties": {
        "impressions": { "type": "number" },
        "clicks": { "type": "number" },
        "ctr": { "type": "number" },
        "cpc": { "type": "number" },
        "leads_generated": { "type": "number" },
        "cost_per_lead": { "type": "number" },
        "conversions": { "type": "number" },
        "spend": { "type": "number" },
        "reach": { "type": "number" }
      },
      "description": "Métricas da campanha"
    },
    "notes": { "type": "string", "description": "Observações da campanha" }
  },
  "required": ["campaign_name", "platform", "campaign_type", "service_target"]
}
```

## `MarketingMaterial`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/MarketingMaterial`

Schema confirmado:

```json
{
  "name": "MarketingMaterial",
  "type": "object",
  "properties": {
    "title": { "type": "string", "description": "Título do material" },
    "description": { "type": "string", "description": "Descrição do material" },
    "file_url": { "type": "string", "description": "URL do arquivo" },
    "file_type": {
      "type": "string",
      "enum": ["image", "video", "pdf", "template", "copy"],
      "description": "Tipo do arquivo"
    },
    "category": {
      "type": "string",
      "enum": ["arte", "video", "copy", "template", "apresentacao", "ebook"],
      "description": "Categoria do material"
    },
    "service_related": {
      "type": "string",
      "enum": ["plano_carreira", "revela_talentos", "intercambios", "campeonatos", "eurocamp", "geral"],
      "description": "Serviço relacionado"
    },
    "platform_optimized": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["instagram", "facebook", "tiktok", "youtube", "email", "whatsapp"]
      },
      "description": "Plataformas otimizadas"
    },
    "tags": { "type": "array", "items": { "type": "string" }, "description": "Tags para busca" },
    "usage_count": { "type": "number", "default": 0, "description": "Quantas vezes foi usado" },
    "is_active": { "type": "boolean", "default": true, "description": "Se está ativo" },
    "created_by": { "type": "string", "description": "ID do criador" }
  },
  "required": ["title", "file_url", "file_type", "category"]
}
```

## `PerformanceData`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/PerformanceData`

Schema confirmado:

```json
{
  "name": "PerformanceData",
  "type": "object",
  "properties": {
    "user_id": { "type": "string", "description": "ID do usuário" },
    "game_date": { "type": "string", "format": "date", "description": "Data do jogo" },
    "opponent": { "type": "string", "description": "Adversário" },
    "competition": { "type": "string", "description": "Competição (ex: Campeonato Paulista)" },
    "venue": { "type": "string", "description": "Local do jogo" },
    "home_away": { "type": "string", "enum": ["home", "away"], "description": "Casa ou fora" },
    "minutes_played": { "type": "number", "description": "Minutos jogados" },
    "goals": { "type": "number", "default": 0, "description": "Gols marcados" },
    "assists": { "type": "number", "default": 0, "description": "Assistências" },
    "passes_completed": { "type": "number", "description": "Passes completos" },
    "passes_attempted": { "type": "number", "description": "Passes tentados" },
    "shots": { "type": "number", "default": 0, "description": "Finalizações" },
    "shots_on_target": { "type": "number", "default": 0, "description": "Finalizações no alvo" },
    "rating": { "type": "number", "minimum": 1, "maximum": 10, "description": "Nota da partida" },
    "associated_video_url": { "type": "string", "description": "URL do vídeo de upload associado" },
    "athlete_feeling": { "type": "string", "description": "Como o atleta se sentiu na partida" },
    "athlete_weekly_summary": { "type": "string", "description": "Resumo da semana pelo atleta" },
    "analyst_notes": { "type": "string", "description": "Observações do analista" },
    "status": {
      "type": "string",
      "enum": ["pending_analysis", "completed"],
      "default": "pending_analysis",
      "description": "Status da análise"
    }
  },
  "required": ["user_id", "game_date", "opponent", "minutes_played"]
}
```

## `Seletiva`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/Seletiva`

Schema confirmado:

```json
{
  "name": "Seletiva",
  "type": "object",
  "properties": {
    "user_id": { "type": "string", "description": "ID do usuário/atleta" },
    "full_name": { "type": "string", "description": "Nome completo do atleta" },
    "birth_date": { "type": "string", "format": "date", "description": "Data de nascimento" },
    "position": { "type": "string", "description": "Posição principal" },
    "height": { "type": "number", "description": "Altura em cm" },
    "weight": { "type": "number", "description": "Peso em kg" },
    "preferred_foot": {
      "type": "string",
      "enum": ["direito", "esquerdo", "ambidestro"],
      "description": "Pé preferido"
    },
    "video_url_game": {
      "type": "string",
      "description": "URL do vídeo de um jogo completo ou melhores momentos"
    },
    "video_url_drills": {
      "type": "string",
      "description": "URL de um vídeo com treinos específicos ou habilidades"
    },
    "self_assessment": {
      "type": "string",
      "description": "Breve autoavaliação do atleta sobre seu estilo de jogo"
    },
    "status": {
      "type": "string",
      "enum": ["pending_review", "under_review", "approved", "rejected", "contacted"],
      "default": "pending_review",
      "description": "Status da avaliação da seletiva"
    },
    "analyst_feedback": {
      "type": "string",
      "description": "Feedback interno do analista da EC10"
    },
    "lgpd_consent": { "type": "boolean", "default": false }
  },
  "required": ["user_id", "full_name", "birth_date", "position", "video_url_game", "lgpd_consent"]
}
```

## `SeletivaApplication`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/SeletivaApplication`

Schema confirmado:

```json
{
  "name": "SeletivaApplication",
  "type": "object",
  "properties": {
    "user_id": { "type": "string", "description": "ID do atleta candidato" },
    "event_id": { "type": "string", "description": "ID do evento de seletiva" },
    "full_name": { "type": "string", "description": "Nome completo do atleta" },
    "birth_date": { "type": "string", "format": "date", "description": "Data de nascimento" },
    "position": { "type": "string", "description": "Posição em campo" },
    "city": { "type": "string", "description": "Cidade" },
    "state": { "type": "string", "description": "Estado" },
    "phone": { "type": "string", "description": "Telefone/WhatsApp" },
    "video_url": { "type": "string", "description": "URL do vídeo de apresentação" },
    "additional_videos": {
      "type": "array",
      "items": { "type": "string" },
      "description": "URLs de vídeos adicionais"
    },
    "height": { "type": "number", "description": "Altura em cm" },
    "weight": { "type": "number", "description": "Peso em kg" },
    "preferred_foot": {
      "type": "string",
      "enum": ["direito", "esquerdo", "ambidestro"]
    },
    "current_club": { "type": "string", "description": "Clube atual" },
    "why_participate": {
      "type": "string",
      "description": "Por que quer participar desta seletiva"
    },
    "status": {
      "type": "string",
      "enum": ["pending", "under_review", "approved", "rejected", "waitlist"],
      "default": "pending",
      "description": "Status da candidatura"
    },
    "analyst_notes": { "type": "string", "description": "Observações do analista" },
    "rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 10,
      "description": "Nota dada pelo analista"
    },
    "feedback": { "type": "string", "description": "Feedback enviado ao atleta" },
    "reviewed_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data da avaliação"
    },
    "reviewed_by": { "type": "string", "description": "ID do analista que avaliou" }
  },
  "required": ["user_id", "event_id", "full_name", "birth_date", "position", "video_url"]
}
```

## `SeletivaEvent`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/SeletivaEvent`

Schema confirmado:

```json
{
  "name": "SeletivaEvent",
  "type": "object",
  "properties": {
    "title": { "type": "string", "description": "Título da seletiva (ex: Peneira Flamengo Sub-17)" },
    "description": { "type": "string", "description": "Descrição detalhada da oportunidade" },
    "event_type": {
      "type": "string",
      "enum": ["clube", "evento", "eurocamp", "showcase", "geral"],
      "description": "Tipo da seletiva"
    },
    "club_name": { "type": "string", "description": "Nome do clube (se for seletiva de clube)" },
    "thumbnail_url": { "type": "string", "description": "Imagem de capa da seletiva" },
    "start_date": { "type": "string", "format": "date", "description": "Data de início das inscrições" },
    "end_date": { "type": "string", "format": "date", "description": "Data de encerramento das inscrições" },
    "event_date": { "type": "string", "format": "date", "description": "Data do evento da seletiva" },
    "location": { "type": "string", "description": "Local da seletiva (cidade/estado)" },
    "is_virtual": { "type": "boolean", "default": true, "description": "Se é seletiva virtual (análise de vídeos)" },
    "criteria": {
      "type": "object",
      "properties": {
        "min_age": { "type": "number" },
        "max_age": { "type": "number" },
        "positions": { "type": "array", "items": { "type": "string" } },
        "required_level": {
          "type": "string",
          "enum": ["iniciante", "intermediario", "avancado"]
        },
        "states": { "type": "array", "items": { "type": "string" } },
        "gender": {
          "type": "string",
          "enum": ["masculino", "feminino", "ambos"]
        }
      },
      "description": "Critérios de elegibilidade"
    },
    "max_participants": { "type": "number", "description": "Número máximo de participantes" },
    "current_participants": { "type": "number", "default": 0, "description": "Número atual de inscritos" },
    "status": {
      "type": "string",
      "enum": ["draft", "open", "closed", "in_progress", "completed"],
      "default": "draft",
      "description": "Status da seletiva"
    },
    "benefits": { "type": "array", "items": { "type": "string" }, "description": "Benefícios e oportunidades oferecidas" },
    "requirements": { "type": "array", "items": { "type": "string" }, "description": "Requisitos obrigatórios" },
    "is_featured": { "type": "boolean", "default": false, "description": "Se está em destaque" },
    "is_published": { "type": "boolean", "default": false, "description": "Se está publicada e visível" },
    "registration_fee": { "type": "number", "default": 0, "description": "Taxa de inscrição (0 para gratuito)" },
    "contact_info": {
      "type": "object",
      "properties": {
        "email": { "type": "string" },
        "phone": { "type": "string" },
        "whatsapp": { "type": "string" }
      },
      "description": "Informações de contato"
    }
  },
  "required": ["title", "description", "event_type", "start_date", "end_date", "status"]
}
```

## `SocialMediaPost`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/SocialMediaPost`

Schema confirmado:

```json
{
  "name": "SocialMediaPost",
  "type": "object",
  "properties": {
    "platform": {
      "type": "string",
      "enum": ["instagram", "facebook", "tiktok", "youtube", "linkedin"],
      "description": "Plataforma da postagem"
    },
    "content_type": {
      "type": "string",
      "enum": ["image", "video", "carousel", "story", "reel", "live"],
      "description": "Tipo de conteúdo"
    },
    "caption": { "type": "string", "description": "Legenda da postagem" },
    "hashtags": { "type": "array", "items": { "type": "string" }, "description": "Hashtags utilizadas" },
    "media_urls": { "type": "array", "items": { "type": "string" }, "description": "URLs das imagens/vídeos" },
    "scheduled_date": { "type": "string", "format": "date-time", "description": "Data e hora agendadas para postagem" },
    "post_status": {
      "type": "string",
      "enum": ["idea", "draft", "review", "approved", "scheduled", "published", "cancelled"],
      "default": "draft",
      "description": "Status da postagem"
    },
    "content_pillar": {
      "type": "string",
      "enum": ["dor", "autoridade", "urgencia", "mentalidade", "prova_social", "educativo", "promocional"],
      "description": "Pilar de conteúdo"
    },
    "service_related": {
      "type": "string",
      "enum": ["plano_carreira", "revela_talentos", "intercambios", "campeonatos", "eurocamp", "geral"],
      "description": "Serviço relacionado"
    },
    "assigned_to": { "type": "string", "description": "ID do responsável pela criação" },
    "campaign_id": { "type": "string", "description": "ID da campanha relacionada (se houver)" },
    "engagement_metrics": {
      "type": "object",
      "properties": {
        "likes": { "type": "number" },
        "comments": { "type": "number" },
        "shares": { "type": "number" },
        "saves": { "type": "number" },
        "reach": { "type": "number" },
        "impressions": { "type": "number" }
      },
      "description": "Métricas de engajamento"
    },
    "cta_link": { "type": "string", "description": "Link de call-to-action" },
    "target_audience": { "type": "string", "description": "Público-alvo específico" },
    "approval_notes": { "type": "string", "description": "Observações da aprovação" }
  },
  "required": ["platform", "content_type", "caption"]
}
```

## `Marketing`

Fonte:
- captura visual de `entities/Marketing`

Schema confirmado:

```json
{
  "name": "Marketing",
  "type": "object",
  "properties": {
    "user_id": { "type": "string", "description": "ID do atleta que fez a solicitação" },
    "request_type": {
      "type": "string",
      "enum": ["flyer", "video_highlight"],
      "description": "Tipo de solicitação de marketing"
    },
    "status": {
      "type": "string",
      "enum": ["pending", "in_progress", "completed", "rejected"],
      "default": "pending",
      "description": "Status da solicitação"
    },
    "photo_urls": { "type": "array", "items": { "type": "string" }, "description": "URLs das fotos para o flyer" },
    "video_urls": { "type": "array", "items": { "type": "string" }, "description": "URLs dos vídeos para edição" },
    "flyer_title": { "type": "string", "description": "Título principal para o flyer" },
    "flyer_subtitle": { "type": "string", "description": "Subtítulo ou informação secundária para o flyer" },
    "additional_info": { "type": "string", "description": "Instruções ou informações adicionais do atleta" },
    "feedback_from_team": { "type": "string", "description": "Feedback do time de marketing para o atleta" },
    "result_url": { "type": "string", "description": "URL do flyer ou vídeo finalizado" }
  },
  "required": ["user_id", "request_type"]
}
```

## `MarketingTask`

Fonte:
- captura visual de `entities/MarketingTask`

Schema confirmado:

```json
{
  "name": "MarketingTask",
  "type": "object",
  "properties": {
    "title": { "type": "string", "description": "Título da tarefa de marketing" },
    "description": { "type": "string", "description": "Descrição detalhada da tarefa" },
    "task_type": {
      "type": "string",
      "enum": ["social_media", "content_creation", "traffic", "athlete_material", "strategy"],
      "description": "Tipo da tarefa de marketing"
    },
    "assigned_to": { "type": "string", "description": "ID do usuário responsável" },
    "athlete_id": { "type": "string", "description": "ID do atleta relacionado (se aplicável)" },
    "priority": {
      "type": "string",
      "enum": ["low", "medium", "high"],
      "default": "medium",
      "description": "Prioridade da tarefa"
    },
    "status": {
      "type": "string",
      "enum": ["todo", "in_progress", "review", "completed", "cancelled"],
      "default": "todo",
      "description": "Status atual da tarefa"
    },
    "due_date": { "type": "string", "format": "date-time", "description": "Data limite para conclusão" },
    "materials": { "type": "array", "items": { "type": "string" }, "description": "URLs dos materiais anexados" },
    "completion_notes": { "type": "string", "description": "Observações na conclusão" }
  },
  "required": ["title", "task_type", "assigned_to"]
}
```

## `MessageTemplate`

Fonte:
- captura visual de `entities/MessageTemplate`

Schema confirmado:

```json
{
  "name": "MessageTemplate",
  "type": "object",
  "properties": {
    "title": { "type": "string", "description": "Título do modelo" },
    "content": { "type": "string", "description": "Conteúdo da mensagem" },
    "template_type": {
      "type": "string",
      "enum": ["whatsapp", "email", "sms"],
      "description": "Tipo do template"
    },
    "category": {
      "type": "string",
      "enum": ["prospeccao", "followup", "proposta", "fechamento", "pos_venda", "objecoes"],
      "description": "Categoria do template"
    },
    "service_related": {
      "type": "string",
      "enum": ["plano_carreira", "revela_talentos", "intercambios", "campeonatos", "geral"],
      "description": "Serviço relacionado"
    },
    "variables": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Variáveis disponíveis no template (ex: {nome_atleta})"
    },
    "is_active": { "type": "boolean", "default": true, "description": "Se está ativo" },
    "usage_count": { "type": "number", "default": 0, "description": "Quantas vezes foi usado" }
  },
  "required": ["title", "content", "template_type", "category"]
}
```

## `Notification`

Fonte:
- captura visual de `entities/Notification`

Schema confirmado:

```json
{
  "name": "Notification",
  "type": "object",
  "properties": {
    "user_id": { "type": "string", "description": "ID do usuário que receberá a notificação" },
    "title": { "type": "string", "description": "Título da notificação" },
    "message": { "type": "string", "description": "Mensagem da notificação" },
    "type": {
      "type": "string",
      "enum": ["performance", "message", "upload", "event", "general", "achievement"],
      "description": "Tipo da notificação"
    },
    "related_id": { "type": "string", "description": "ID do item relacionado" },
    "is_read": { "type": "boolean", "default": false, "description": "Se foi lida" },
    "priority": {
      "type": "string",
      "enum": ["low", "medium", "high", "urgent"],
      "default": "medium",
      "description": "Prioridade da notificação"
    },
    "action_url": { "type": "string", "description": "URL para a ação da notificação" }
  },
  "required": ["user_id", "title", "message", "type"]
}
```

## `Pipeline`

Fonte:
- captura visual de `entities/Pipeline`

Schema confirmado:

```json
{
  "name": "Pipeline",
  "type": "object",
  "properties": {
    "name": { "type": "string", "description": "Nome do pipeline" },
    "description": { "type": "string", "description": "Descrição do pipeline" },
    "color": { "type": "string", "description": "Cor do pipeline (ex: blue, green, red, purple)" },
    "stages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" },
          "order": { "type": "number" }
        }
      },
      "description": "Estágios do pipeline"
    },
    "is_active": { "type": "boolean", "default": true, "description": "Se o pipeline está ativo" }
  },
  "required": ["name"]
}
```

## `PlatformSettings`

Fonte:
- captura visual de `entities/PlatformSettings`

Schema confirmado:

```json
{
  "name": "PlatformSettings",
  "type": "object",
  "properties": {
    "setting_key": { "type": "string", "description": "Chave única da configuração" },
    "setting_value": { "type": "string", "description": "Valor da configuração" },
    "setting_type": {
      "type": "string",
      "enum": ["boolean", "string", "number", "json"],
      "default": "boolean",
      "description": "Tipo do valor"
    },
    "description": { "type": "string", "description": "Descrição da configuração" },
    "is_active": { "type": "boolean", "default": true, "description": "Se a configuração está ativa" }
  },
  "required": ["setting_key", "setting_value", "setting_type"]
}
```

## `ProposalTemplate`

Fonte:
- captura visual de `entities/ProposalTemplate`

Schema confirmado:

```json
{
  "name": "ProposalTemplate",
  "type": "object",
  "properties": {
    "template_name": { "type": "string", "description": "Nome do modelo de proposta" },
    "service_type": {
      "type": "string",
      "enum": ["plano_carreira", "revela_talentos", "intercambios", "campeonatos"],
      "description": "Tipo de serviço"
    },
    "base_price": { "type": "number", "description": "Preço base do serviço" },
    "installments": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "percentage": { "type": "number" },
          "description": { "type": "string" }
        }
      },
      "description": "Opções de parcelamento"
    },
    "included_items": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Itens inclusos no serviço"
    },
    "optional_items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "price": { "type": "number" },
          "description": { "type": "string" }
        }
      },
      "description": "Itens opcionais"
    },
    "proposal_template": { "type": "string", "description": "Template HTML da proposta" },
    "is_active": { "type": "boolean", "default": true }
  },
  "required": ["template_name", "service_type", "base_price"]
}
```

## `SalesMaterial`

Fonte:
- captura visual de `entities/SalesMaterial`

Schema confirmado:

```json
{
  "name": "SalesMaterial",
  "type": "object",
  "properties": {
    "title": { "type": "string", "description": "Título do material" },
    "description": { "type": "string", "description": "Descrição do material" },
    "file_url": { "type": "string", "description": "URL do arquivo (PDF, vídeo, etc.)" },
    "file_type": {
      "type": "string",
      "enum": ["pdf", "video", "image", "document", "presentation"],
      "description": "Tipo do arquivo"
    },
    "category": {
      "type": "string",
      "enum": ["contract", "proposal", "presentation", "brochure", "template", "script"],
      "description": "Categoria do material"
    },
    "service_related": {
      "type": "string",
      "enum": ["plano_carreira", "revela_talentos", "intercambios", "campeonatos", "geral"],
      "description": "Serviço relacionado"
    },
    "is_active": { "type": "boolean", "default": true, "description": "Se está ativo para uso" },
    "usage_count": { "type": "number", "default": 0, "description": "Quantas vezes foi usado" },
    "tags": { "type": "array", "items": { "type": "string" }, "description": "Tags para busca" }
  },
  "required": ["title", "file_url", "file_type", "category"]
}
```

## `ServiceHighlight`

Fonte:
- captura visual de `entities/ServiceHighlight`

Schema confirmado:

```json
{
  "name": "ServiceHighlight",
  "type": "object",
  "properties": {
    "title": { "type": "string", "description": "Título do serviço" },
    "title_highlight": { "type": "string", "description": "Parte do título em destaque" },
    "description": { "type": "string", "description": "Descrição do serviço" },
    "icon_name": { "type": "string", "description": "Nome do ícone do Lucide React" },
    "button_text": { "type": "string", "description": "Texto do botão" },
    "button_url": { "type": "string", "description": "URL do botão" },
    "card_color": { "type": "string", "description": "Cor do card" },
    "features": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "icon": { "type": "string" },
          "text": { "type": "string" }
        }
      },
      "description": "Lista de features com ícones"
    },
    "is_active": { "type": "boolean", "default": true },
    "display_order": { "type": "number", "default": 0 }
  },
  "required": ["title", "description"]
}
```

## `ServicePackage`

Fonte:
- captura visual de `entities/ServicePackage`

Schema confirmado na parte legível:

```json
{
  "name": "ServicePackage",
  "type": "object",
  "properties": {
    "service_name": { "type": "string", "description": "Nome do serviço" },
    "service_category": {
      "type": "string",
      "enum": ["revela_talentos", "plano_carreira", "plano_internacional", "eurocamp", "material_individual"],
      "description": "Categoria do serviço"
    },
    "description": { "type": "string", "description": "Descrição completa do serviço" },
    "price": { "type": "number", "description": "Preço do serviço em reais" },
    "currency": { "type": "string", "default": "BRL", "description": "Moeda do preço" },
    "features": { "type": "array", "items": { "type": "string" }, "description": "Lista de funcionalidades incluídas" },
    "duration_months": { "type": "number", "description": "Duração do serviço em meses" },
    "target_audience": { "type": "string", "description": "Público-alvo" },
    "is_active": { "type": "boolean", "default": true, "description": "Se o serviço está ativo para venda" },
    "sales_materials": { "type": "array", "items": { "type": "string" }, "description": "IDs dos materiais de venda associados" },
    "success_metrics": {
      "type": "object",
      "properties": {
        "conversion_rate": { "type": "number" },
        "avg_deal_size": { "type": "number" },
        "customer_satisfaction": { "type": "number" }
      }
    }
  },
  "required_visible": ["service_name", "service_category"]
}
```

Observação:
- o bloco `required` está parcialmente visível na captura
- só registrei os itens legíveis com segurança

## `Story`

Fonte:
- captura visual de `entities/Story`

Schema confirmado:

```json
{
  "name": "Story",
  "type": "object",
  "properties": {
    "title": { "type": "string", "description": "Título do story" },
    "video_url": { "type": "string", "description": "URL do vídeo vertical (9:16)" },
    "thumbnail_url": { "type": "string", "description": "URL da thumbnail" },
    "link_url": { "type": "string", "description": "URL de destino ao clicar" },
    "duration": { "type": "number", "default": 10, "description": "Duração em segundos" },
    "is_active": { "type": "boolean", "default": true, "description": "Se o story está ativo" },
    "order": { "type": "number", "default": 0, "description": "Ordem de exibição" },
    "target_audience": {
      "type": "string",
      "enum": ["all", "athletes", "guests"],
      "default": "all",
      "description": "Público-alvo"
    }
  },
  "required": ["title", "video_url"]
}
```

## `SubscriptionPackage`

Fonte:
- captura visual de `entities/SubscriptionPackage`

Schema confirmado:

```json
{
  "name": "SubscriptionPackage",
  "type": "object",
  "properties": {
    "name": { "type": "string", "description": "Nome do pacote (ex: Básico, Elite)" },
    "description": { "type": "string", "description": "Uma breve descrição do pacote" },
    "price": { "type": "number", "description": "Preço do pacote" },
    "billing_period": {
      "type": "string",
      "enum": ["monthly", "quarterly", "semiannual", "annual"],
      "default": "monthly",
      "description": "Período de cobrança"
    },
    "features": { "type": "array", "items": { "type": "string" }, "description": "Lista de funcionalidades incluídas no pacote" },
    "is_popular": { "type": "boolean", "default": false, "description": "Marcar como o pacote mais popular" },
    "is_active": { "type": "boolean", "default": true, "description": "Se o pacote está ativo e pode ser assinado" },
    "color_gradient": { "type": "string", "description": "Gradiente de cor para o card" },
    "icon": { "type": "string", "description": "Ícone a ser usado" }
  },
  "required": ["name", "price", "billing_period", "features"]
}
```

## `TrafficCampaign`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/TrafficCampaign`

Schema confirmado:

```json
{
  "name": "TrafficCampaign",
  "type": "object",
  "properties": {
    "campaign_name": { "type": "string", "description": "Nome da campanha" },
    "platform": {
      "type": "string",
      "enum": ["google_ads", "facebook_ads", "instagram_ads", "tiktok_ads", "youtube_ads"],
      "description": "Plataforma da campanha"
    },
    "campaign_type": {
      "type": "string",
      "enum": ["lead_generation", "brand_awareness", "conversion", "retargeting"],
      "description": "Tipo da campanha"
    },
    "target_page": { "type": "string", "description": "Página de destino" },
    "budget_daily": { "type": "number", "description": "Orçamento diário em reais" },
    "budget_total": { "type": "number", "description": "Orçamento total da campanha" },
    "start_date": { "type": "string", "format": "date", "description": "Data de início" },
    "end_date": { "type": "string", "format": "date", "description": "Data de término" },
    "status": {
      "type": "string",
      "enum": ["draft", "active", "paused", "completed", "cancelled"],
      "default": "draft",
      "description": "Status da campanha"
    },
    "metrics": {
      "type": "object",
      "properties": {
        "impressions": { "type": "number" },
        "clicks": { "type": "number" },
        "ctr": { "type": "number" },
        "cpc": { "type": "number" },
        "conversions": { "type": "number" },
        "cpa": { "type": "number" },
        "spend": { "type": "number" }
      },
      "description": "Métricas de performance"
    },
    "target_audience": {
      "type": "object",
      "properties": {
        "age_min": { "type": "number" },
        "age_max": { "type": "number" },
        "interests": { "type": "array", "items": { "type": "string" } },
        "locations": { "type": "array", "items": { "type": "string" } }
      },
      "description": "Configurações de público-alvo"
    }
  },
  "required": ["campaign_name", "platform", "campaign_type", "target_page"]
}
```

## `WhatsAppIntegration`

Fonte:
- texto bruto colado pelo usuário a partir de `entities/WhatsAppIntegration`

Schema confirmado:

```json
{
  "name": "WhatsAppIntegration",
  "type": "object",
  "properties": {
    "phone_number": { "type": "string", "description": "Número do WhatsApp" },
    "chat_id": { "type": "string", "description": "ID único do chat" },
    "contact_name": { "type": "string", "description": "Nome do contato" },
    "lead_id": { "type": "string", "description": "ID do lead associado" },
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "message_id": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" },
          "direction": { "type": "string", "enum": ["incoming", "outgoing"] },
          "content": { "type": "string" },
          "message_type": {
            "type": "string",
            "enum": ["text", "image", "video", "audio", "document"]
          },
          "media_url": { "type": "string" },
          "delivered": { "type": "boolean" },
          "read": { "type": "boolean" }
        }
      },
      "description": "Mensagens do chat"
    },
    "is_active": { "type": "boolean", "default": true, "description": "Se o chat está ativo" },
    "assigned_rep": { "type": "string", "description": "Vendedor responsável" },
    "last_activity": { "type": "string", "format": "date-time", "description": "Última atividade" }
  },
  "required": ["phone_number", "chat_id", "contact_name"]
}
```

## `Testimonial`

Fonte:
- captura visual de `entities/Testimonial`

Schema confirmado:

```json
{
  "name": "Testimonial",
  "type": "object",
  "properties": {
    "name": { "type": "string", "description": "Nome do atleta ou pessoa no depoimento" },
    "position": { "type": "string", "description": "Posição/cargo" },
    "video_url": { "type": "string", "description": "URL do vídeo" },
    "thumbnail_url": { "type": "string", "description": "URL da imagem de capa para o vídeo" },
    "is_active": { "type": "boolean", "default": true, "description": "Controla se o depoimento aparece no site" }
  },
  "required": ["name", "video_url", "thumbnail_url"]
}
```

## `UserNotification`

Fonte:
- captura visual de `entities/UserNotification`

Schema confirmado:

```json
{
  "name": "UserNotification",
  "type": "object",
  "properties": {
    "user_id": { "type": "string", "description": "ID do usuário que receberá a notificação" },
    "notification_type": {
      "type": "string",
      "enum": ["new_content", "career_update", "new_message", "system_update", "live_session"],
      "description": "Tipo da notificação"
    },
    "title": { "type": "string", "description": "Título da notificação" },
    "message": { "type": "string", "description": "Conteúdo da notificação" },
    "related_id": { "type": "string", "description": "ID do conteúdo/item relacionado" },
    "is_read": { "type": "boolean", "default": false, "description": "Se a notificação foi lida pelo usuário" },
    "priority": {
      "type": "string",
      "enum": ["low", "medium", "high"],
      "default": "medium",
      "description": "Prioridade da notificação"
    }
  },
  "required": ["user_id", "notification_type", "title", "message"]
}
```

## `UserPipeline`

Fonte:
- captura visual de `entities/UserPipeline`

Schema confirmado:

```json
{
  "name": "UserPipeline",
  "type": "object",
  "properties": {
    "user_id": { "type": "string", "description": "ID do usuário/atleta" },
    "pipeline_id": { "type": "string", "description": "ID do pipeline" },
    "current_stage": { "type": "string", "description": "Estágio atual do usuário no pipeline" },
    "stage_entered_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data que entrou no estágio atual"
    },
    "notes": { "type": "string", "description": "Observações sobre o progresso no pipeline" },
    "assigned_to": { "type": "string", "description": "ID do responsável por acompanhar este usuário" }
  },
  "required": ["user_id", "pipeline_id"]
}
```

## `UserProgress`

Fonte:
- captura visual de `entities/UserProgress`

Schema confirmado:

```json
{
  "name": "UserProgress",
  "type": "object",
  "properties": {
    "user_id": { "type": "string", "description": "ID do usuário" },
    "content_id": { "type": "string", "description": "ID do conteúdo" },
    "progress_percentage": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "default": 0,
      "description": "Porcentagem assistida"
    },
    "last_watched": {
      "type": "string",
      "format": "date-time",
      "description": "Última vez que assistiu"
    },
    "completed": { "type": "boolean", "default": false, "description": "Se o conteúdo foi completado" },
    "watch_time_seconds": {
      "type": "number",
      "default": 0,
      "description": "Tempo total assistido em segundos"
    }
  },
  "required": ["user_id", "content_id"]
}
```

## `UserSubscription`

Fonte:
- captura visual de `entities/UserSubscription`

Schema confirmado:

```json
{
  "name": "UserSubscription",
  "type": "object",
  "properties": {
    "user_id": { "type": "string", "description": "ID do usuário" },
    "package_id": { "type": "string", "description": "ID do SubscriptionPackage que o usuário assinou" },
    "status": {
      "type": "string",
      "enum": ["active", "inactive", "expired", "trial"],
      "default": "trial",
      "description": "Status da assinatura"
    },
    "start_date": { "type": "string", "format": "date", "description": "Data de início" },
    "renewal_date": { "type": "string", "format": "date", "description": "Data de renovação" },
    "payment_status": {
      "type": "string",
      "enum": ["paid", "pending", "failed"],
      "default": "pending",
      "description": "Status do pagamento"
    },
    "payment_method": {
      "type": "string",
      "enum": ["credit_card", "pix", "boleto"],
      "description": "Método de pagamento"
    },
    "price_at_subscription": {
      "type": "number",
      "description": "Preço no momento da assinatura"
    }
  },
  "required": ["user_id", "package_id"]
}
```

## `WeeklyAssessment`

Fonte:
- captura visual de `entities/WeeklyAssessment`

Schema confirmado na parte legível:

```json
{
  "name": "WeeklyAssessment",
  "type": "object",
  "properties": {
    "user_id": { "type": "string", "description": "ID do atleta" },
    "week_start_date": {
      "type": "string",
      "format": "date",
      "description": "Data de início da semana"
    },
    "had_game": { "type": "boolean", "default": false, "description": "Se jogou partida oficial" },
    "goals": { "type": "number", "default": 0, "description": "Gols marcados" },
    "assists": { "type": "number", "default": 0, "description": "Assistências" },
    "training_sessions": { "type": "number", "default": 0, "description": "Número de treinos na semana" },
    "minutes_played": { "type": "number", "default": 0, "description": "Minutos jogados" },
    "self_rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 10,
      "description": "Auto-avaliação (1-10)"
    },
    "physical_condition": {
      "type": "string",
      "enum": ["excelente", "boa", "regular", "ruim"],
      "description": "Condição física"
    },
    "notes": { "type": "string", "description": "Observações sobre a semana" },
    "admin_feedback": { "type": "string", "description": "Feedback do analista/admin" },
    "points_earned": { "type": "number", "default": 50, "description": "Pontos ganhos por completar" }
  },
  "required": ["user_id", "week_start_date"]
}
```

## Impacto na migração

Essas capturas melhoram muito a qualidade do inventário porque:

- confirmam que o Base44 está expondo os arquivos reais de schema
- provam que já não precisamos inferir esses schemas específicos pelo frontend
- mostram que respostas resumidas anteriores do Base44 podem estar incompletas

## Próximas prioridades de captura

Se a coleta continuar, as próximas entities mais importantes para exportar primeiro são:

- `User` em captura bruta ou JSON do editor, para comparar com a documentação já consolidada em `BASE44_SUPERFICIE_API_CONFIRMADA.md`
- `ActivityLog` em texto bruto, se possível
- `AdminAuditLog` em texto bruto, se possível
- `AdminNotification` em texto bruto, se possível
- qualquer entity restante que apareça na árvore e ainda não foi capturada por texto ou print

## Status

Com estas capturas, o projeto agora tem:
- evidência local do consumo das entities no frontend
- evidência visual do schema real de algumas entities no Base44

Ainda faltam:
- captura bruta do `User` no editor, para validar diferenças entre captura e docs
- rules/RLS
- automations
- lista completa de cloud-functions
- export real do storage
