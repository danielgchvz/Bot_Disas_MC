# Bot_Disas_MC
## Descripción
Este proyecto se enfocó en usar un bot que juegue automáticamente para intentar obtener la misma cantidad de victorias que puede obtener un jugador promedio en una hora, en el minijuego “Disasters” hecho por Hypixel en Minecraft. Este proyecto hace uso de JavaScript y de la librería Mineflayer principalmente.

## Contexto
Disasters es un minijuego de supervivencia en el servidor de Minecraft Hypixel. El objetivo de "Disasters" es simple: ¡Sobrevivir! En cada partida, se producen tres oleadas de desastres diferentes, cada una de las cuales suele consistir en un solo desastre, aunque a veces puede haber más. Los jugadores deben mantener la calma mientras se desata el caos y trabajar solos o con otros jugadores para sobrevivir.

¿Cómo se juega?
- Inicio: Los jugadores comienzan en un mapa compacto con 10 segundos para dispersarse y encontrar lugares seguros.
- Oleadas de desastres: Cada minuto, se activa una nueva oleada con un desastre primario y, ocasionalmente, uno secundario. Estos desastres se acumulan y persisten durante toda la partida, a menos que tengan un final definido.
- Supervivencia: El juego continúa hasta que se complete el tiempo asignado al inicio de cada partida.

Para mayor información puede consultar este link: https://hypixel.net/threads/new-prototype-game-disasters.5799097/

## Funcionalidades principales del bot
- Conexión automática al servidor Hypixel y entrada al modo Disasters.
- Monitorización en tiempo real del chat del juego para identificar victorias.
- Registro de cada victoria obtenida y almacenamiento local.
- Capacidad de moverse automáticamente a otras partidas, si muere o gana.

## Resultados
- Automatización de conexión, detección de victorias y registro de desempeño.
- El bot logró un promedio de 5 victorias por hora, mientras que un jugador promedio gana entre 3 y 5 victorias por hora.
- El bot alcanzó un win rate de 25%, comparado con el promedio base que resulta ser 34% aproximadamente, demostrando un desempeño competitivo frente a jugadores humanos.
  
## Posibles mejoras a futuro
- Detección de desastres por patrones visuales.
- Algoritmo de decisión (heurísticas o IA simple) para buscar la posición más óptima.
- Integración con panel de estadísticas web (usando Node.js + Express + Chart.js).
