# Juego de Geografía - Empareja Países con sus Capitales

Un juego interactivo de arrastrar y soltar donde los jugadores deben emparejar países europeos con sus capitales correspondientes. El juego incluye un sistema de puntuación, temporizador y tabla de clasificación global.

## Características

- **Jugabilidad Drag & Drop**: Arrastra 8 países seleccionados aleatoriamente a sus capitales correspondientes
- **Sistema de Puntuación**:
  - +10 puntos por cada coincidencia correcta
  - -2 puntos por coincidencias incorrectas
- **Temporizador de 60 segundos**: Completa todos los emparejamientos antes de que se acabe el tiempo
- **Retroalimentación Visual**:
  - Animación verde para coincidencias correctas
  - Efecto de sacudida rojo para coincidencias incorrectas
  - Transiciones suaves y efectos hover
- **Tabla de Posiciones**: Guarda tu puntuación con tu nombre y compite con otros jugadores (Top 10)
- **Base de Datos en Tiempo Real**: Persistencia de datos con Supabase
- **Diseño Responsivo**: Funciona perfectamente en escritorio, tablet y móvil
- **Interfaz en Español**: Completamente localizada al español

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite
- **Base de Datos**: Supabase (PostgreSQL)
- **Arquitectura**: Modular con separación de responsabilidades

## Estructura del Proyecto

```
project/
├── index.html              # Estructura HTML principal
├── style.css               # Estilos y animaciones
├── main.js                 # Lógica principal del juego
├── gameData.js             # Datos de países y capitales
├── gameState.js            # Gestión del estado del juego
├── dragDropHandler.js      # Manejador de drag & drop
├── leaderboardManager.js   # Gestión de la tabla de posiciones
├── package.json            # Dependencias del proyecto
└── supabase/
    └── migrations/         # Migraciones de base de datos
```

## Base de Datos

### Tabla: `leaderboard`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | Identificador único (PK) |
| player_name | text | Nombre del jugador |
| score | integer | Puntuación obtenida |
| time_remaining | integer | Segundos restantes al finalizar |
| created_at | timestamptz | Fecha y hora del registro |

### Políticas de Seguridad (RLS)

- Lectura pública: Cualquiera puede ver la tabla de posiciones
- Inserción pública: Cualquiera puede enviar sus puntuaciones
- Sin permisos de actualización o eliminación para mantener la integridad de los datos

## Instalación y Uso

### Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn

### Configuración

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd project
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Asegúrate de que el archivo `.env` contenga:
```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

5. Construir para producción:
```bash
npm run build
```

## Cómo Jugar

1. **Inicio del Juego**: Al cargar, se presentan 8 países y sus capitales en orden aleatorio
2. **Emparejar**: Arrastra cada país a su capital correspondiente
3. **Puntuación**: Recibe puntos por aciertos y penalizaciones por errores
4. **Completar**: Empareja todos los países antes de que expire el tiempo
5. **Guardar Resultado**: Ingresa tu nombre y guarda tu puntuación
6. **Competir**: Consulta la tabla de posiciones para ver cómo te comparas con otros jugadores

## Características Técnicas

### Modularidad
El código está organizado en módulos independientes para facilitar el mantenimiento:
- **GameState**: Gestiona el estado del juego (puntuación, tiempo, respuestas)
- **DragDropHandler**: Maneja toda la lógica de arrastrar y soltar
- **LeaderboardManager**: Gestiona la comunicación con Supabase para la tabla de posiciones

### Animaciones
- Transiciones CSS suaves en todos los elementos
- Animaciones de pulso para aciertos
- Animaciones de sacudida para errores
- Efectos hover y estados activos
- Desvanecimiento de elementos completados

### Responsive Design
- Breakpoints optimizados para móvil, tablet y escritorio
- Grid adaptable que cambia de 2 columnas a 1 columna en móviles
- Fuentes y espaciados escalables
- Elementos táctiles de tamaño apropiado para dispositivos móviles

## Datos del Juego

El juego incluye 20 pares de países y capitales europeas:
- Francia - París
- Alemania - Berlín
- Italia - Roma
- España - Madrid
- Y 16 más...

Cada partida selecciona aleatoriamente 8 pares para mantener el juego fresco y desafiante.

## Desarrollador

**Profesional**: César Eduardo González
**Título**: Analista en Sistemas
**Email**: gonzalezeduardo_31@hotmail.com
**Teléfono**: (+54) 3884 858-907

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para sugerencias o mejoras.

---

Desarrollado con pasión por la educación y la geografía.
