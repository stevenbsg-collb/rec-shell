🏗️ Arquitectura de la Refactorización
Vista General
┌─────────────────────────────────────────────────────────────┐
│                      ListarAdmin.tsx                        │
│                   (Componente Principal)                    │
│                      ~70 líneas                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ usa
                              ▼
        ┌─────────────────────────────────────────┐
        │            HOOKS PERSONALIZADOS          │
        ├─────────────────────────────────────────┤
        │  • usePlanTratamientoGenerator()        │
        │    - Generación de planes con IA        │
        │    - Integración con Gemini             │
        │    - Guardar planes en backend          │
        │                                          │
        │  • useAnalisisImagen()                  │
        │    - Cargar lista de análisis           │
        │    - Actualizar datos                   │
        │                                          │
        │  • usePagination()                      │
        │    - Paginación de datos                │
        │    - Búsqueda                           │
        └─────────────────────────────────────────┘
                              │
                              │ renderiza
                              ▼
        ┌─────────────────────────────────────────┐
        │         COMPONENTES DE UI                │
        ├─────────────────────────────────────────┤
        │  • PageHeader                           │
        │  • StateComponents                      │
        │    - LoadingState                       │
        │    - ErrorState                         │
        │    - EmptyState                         │
        │  • AnalisisAdminTableHeader             │
        │  • AnalisisAdminTableRow                │
        │  • PaginationControls                   │
        └─────────────────────────────────────────┘
                              │
                              │ utiliza
                              ▼
        ┌─────────────────────────────────────────┐
        │              UTILIDADES                  │
        ├─────────────────────────────────────────┤
        │  • analisisUtils.ts                     │
        │    - getTipoAlertaColor()               │
        │    - formatDeficiencia()                │
        │    - getConfianzaColor()                │
        │                                          │
        │  • generarPromptPlanTratamiento()       │
        │  • fallbackPlan                         │
        └─────────────────────────────────────────┘
Flujo de Datos
Usuario interactúa
        │
        ▼
┌───────────────────┐
│  ListarAdmin      │ ◄─── useAnalisisImagen()
│  (Componente)     │      (carga datos)
└───────────────────┘
        │
        ├─── muestra datos ───► PageHeader
        │                       StateComponents
        │                       Table + Rows
        │
        ▼
Usuario hace clic en "Generar Plan"
        │
        ▼
┌───────────────────────────────┐
│ usePlanTratamientoGenerator() │
├───────────────────────────────┤
│ 1. Genera prompt              │
│ 2. Llama a Gemini API         │
│ 3. Parsea respuesta           │
│ 4. Guarda en backend          │
└───────────────────────────────┘
        │
        ▼
Plan guardado ► UI actualizada
Responsabilidades por Capa
🎯 Componente Principal (ListarAdmin)

Orquesta la página completa
Maneja el ciclo de vida
Coordina hooks y componentes
NO contiene lógica de negocio

🔧 Hooks Personalizados

usePlanTratamientoGenerator

Lógica compleja de generación
Estado del proceso
Integración con APIs
Manejo de errores



🎨 Componentes de Presentación

PageHeader: Título y acciones
StateComponents: Estados de la UI
Table Components: Estructura de datos
Rows: Presentación individual
Todos son "dumb components"

🛠️ Utilidades

Funciones puras
Sin efectos secundarios
Reutilizables
Fáciles de testear

Comparación de Complejidad
ANTES (Monolítico)
ListarAdmin.tsx (180 líneas)
├── Estado local (5 variables)
├── Refs
├── 3 custom hooks diferentes
├── Callbacks complejos
├── Lógica de renderizado
├── Manejo de errores
├── Generación de prompts
└── Guardado de datos
DESPUÉS (Modular)
ListarAdmin.tsx (70 líneas)
├── 2 custom hooks
└── Renderiza componentes

usePlanTratamientoGenerator.ts (80 líneas)
├── Toda la lógica de generación
└── Estado encapsulado

Componentes (15-40 líneas cada uno)
├── PageHeader (25 líneas)
├── StateComponents (45 líneas)
├── AnalisisAdminTableRow (80 líneas)
└── AnalisisAdminTableHeader (15 líneas)

Utils (compartidas)
└── analisisUtils.ts
🎯 Principios Aplicados

Single Responsibility Principle

Cada archivo tiene un propósito único


Don't Repeat Yourself (DRY)

Utilidades compartidas
Componentes reutilizables


Separation of Concerns

Presentación vs. Lógica
Estado vs. UI


Composition over Inheritance

Componentes componibles
Hooks componibles


Open/Closed Principle

Fácil extender sin modificar