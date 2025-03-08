# Museo Virtual

🔗 **Accede aquí:** [Museo Virtual en Render](https://themuseum.onrender.com)

Un museo interactivo en 3D desarrollado con **Three.js** y **React**, donde puedes explorar una galería digital, interactuar con obras de arte y jugar minijuegos.

## Características

- **Exploración 3D**: Navega libremente por el museo virtual con una experiencia inmersiva.
- **Interacción con obras**: Haz clic en obras de arte para ver detalles y acceder a minijuegos.
- **Minijuegos**: Puzzle, carreras y shooter, cada uno vinculado a una obra específica.
- **Gestión de estado**: Uso de Context API y Reducer para autenticación, progreso de juegos y almacenamiento de datos.
- **Sistema de trofeos**: Desbloquea logros al completar juegos y accede al "Hall of Fame".

## Estructura del Proyecto

- **`Museum.jsx`**: Componente principal que renderiza la escena del museo.
- **`useMuseumNavigation.js`**: Control de navegación y selección de elementos interactivos.
- **`GameLauncher.jsx`**: Lanza los minijuegos según el cuadro seleccionada.
- **`globalReducer.jsx` & `GlobalStateProvider.jsx`**: Manejo del estado global (usuario, juegos, trofeos).
- **`api.js`**: Integración con la API para autenticación y puntajes.

🎨 ¡Explora el museo, desbloquea trofeos y diviértete con los minijuegos!
