const fs = require('fs');
const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const { GoalBlock } = goals
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let recolectandoGanadores = false;
let ganadores = [];

const frasesDeMuerte = [
  "had their brains eaten in the Zombie Apocalypse.",
  "was lost to the horde in the Zombie Apocalypse.",
  "tried to befriend zombies in the Zombie Apocalypse.",
  "found out the Hot Potato was way too hot.",
  "was too polite to give away the Hot Potato.",
  "couldn't get rid of the Hot Potato.",
  "died bravely in combat with Dragons.",
  "thought the Dragons were friendlier.",
  "got in the way of the Dragons.",
  "died while dancing in the Acid Rain.",
  "mistook Acid Rain for regular rain.",
  'forgot about the "acid" part of Acid Rain.',
  "was killed by ",
  "didn't complete their task as a Werewolf.",
  "has succumbed to the curse of the Werewolf.",
  "ran out of air in the Flood.",
  "drowned in the high-rising Flood.",
  "got lost in the Flood because they forgot how to swim.",
  "was struck by a meteor during the Meteor Shower.",
  "went up in flames.",
  "couldn't find shelter from the Meteor Shower.",
  "mistook The Floor is Lava for water.",
  "was unfamiliar with the rules of The Floor is Lava.",
  "discovered that lava is very hot.",
  "fell into a pool of lava.",
  "took a swim in lava.",
  "burned to death.",
  "fell face first while The Floor is Lava.",
  "stood too close to fire.",
  "moved during a Red Light.",
  "thought that Red Light meant go.",
  "was impatient during Red Light, Green Light.",
  "played for too long in the Lightning.",
  "discovered electricity during the Lightning storm.",
  "was struck by Lightning.",
  "was spun around by a Tornado.",
  "was swept away by a Tornado.",
  "was caught in the eye of a Tornado.",
  "fell into the Sinkhole.",
  "stumbled into the Sinkhole.",
  "was swallowed by the Sinkhole.",
  "wasn't looking where they were going and stumbled into the Sinkhole.",
  "couldn't outrun the Withers.",
  "made friends with Withers.",
  "withered away from the Withers.",
  "forgot an umbrella for the Anvil Rain.",
  "was pancaked by Anvil Rain.",
  "died while exploring the void.",
  "fell infinitely into the void.",
  "tripped and fell from a high place.",
  "hit the ground too hard.",
  "tried to escape the disasters the wrong way.",
  "was killed by unknown circumstances.",
  "was crushed by a block.",
  "suffocated in a wall.",
  "drowned as a result of strong tidal forces.",
  "couldn't hold their breath any longer.",
  "died."
]

const frasesDeWerewolf = [
  "You have become a Werewolf!"  // Frase que se detecta cuando el jugador se convierte en un Werewolf
]

// Coordenadas por mapa
const mapaCoordenadas = {
  "Paradise": { x: 39, y: 91, z: 12 },
  "Gondola": { x: -16, y: 63, z: 34 },
  "Castle": { x: 34, y: 50, z: -37 },
  "Cruise Ship": { x: -54, y: 77, z: -16 },
  "Monorail": { x: 35, y: 81, z: -4 } 
}

var bot = mineflayer.createBot({
    host: 'mc.hypixel.net', 
    username: '123456789@hotmail.com',
    password: 'abcdefgh',
    port: 25565,
    version: '1.8.9',
    auth: 'microsoft',
})

const nombreBot = "LastLab";  // Nombre real o nickname del bot

bot.loadPlugin(pathfinder)

bot.once('spawn', () => {
    console.log("I spawned")
    setTimeout(() => {
      bot.chat("/play prototype_disasters");
  }, 1000)
})

bot.on('message', (jsonMsg) => {
  const text = jsonMsg.toString()
  const cleanText = text.replace(/\n/g, ' ')
  console.log("Mensaje recibido:", cleanText)

  // Detectar inicio de partida
  if (cleanText.includes("Endure an onslaught of natural and unnatural disasters!")) {
    setTimeout(() => {
      bot.chat('/map')
    }, 500)
  }

  if (cleanText.startsWith("You are currently playing on")) {
    const partes = cleanText.split("You are currently playing on ")
    if (partes.length > 1) {
      mapaActual = partes[1].trim()
      console.log("Mapa detectado:", mapaActual)
      bot.pathfinder.setGoal(null)
    }
  }

  if (cleanText.includes("The game starts in 1 second!") && mapaActual) {
    console.log("Inicio en 1 segundo detectado. Esperando 1.5 segundos para moverse...")
    setTimeout(() => {
      const coords = mapaCoordenadas[mapaActual]
      if (coords) {
        console.log("Moviéndose a:", coords)

        const mcData = require('minecraft-data')(bot.version)
        const defaultMove = new Movements(bot, mcData)
        bot.pathfinder.setMovements(defaultMove)
        bot.setControlState('sprint', true)
        bot.setControlState('jump', true)

        bot.pathfinder.setGoal(new GoalBlock(
          Math.round(coords.x),
          Math.round(coords.y),
          Math.round(coords.z)
        ))

        bot.once('goal_reached', async () => {
          bot.setControlState('jump', false)
          console.log("¡Llegué a la posición deseada!")
        
          // Giro suave de 180 grados (400ms total)
          const currentYaw = bot.entity.yaw
          const targetYaw = currentYaw + Math.PI
          const steps = 20
          const stepDelay = 20
          const deltaYaw = (targetYaw - currentYaw) / steps
        
          console.log("Iniciando giro suave de 180° (400ms)...")
        
          for (let i = 1; i <= steps; i++) {
            const yaw = currentYaw + deltaYaw * i
            bot.look(yaw, 0, true)
            await sleep(stepDelay)
          }
        
          console.log("Giro completado. Esperando antes de activar sneak...")
        
          await sleep(500)
        
          bot.setControlState('sneak', true)
          console.log("Sneak activado.")
        })
      } else {
        console.log("Coordenadas no definidas para el mapa:", mapaActual)
      }
    }, 1500)
  }

  if (frasesDeWerewolf.some(frase => cleanText.includes(frase))) {
    console.log("¡El bot se ha convertido en un Werewolf! Saliendo de la partida...")
    bot.chat('/play prototype_disasters')
    bot.pathfinder.setGoal(null)
  }

  // Detectar las frases de muerte, y solo salir si se detecta con tu nick
  const hayMuerte = frasesDeMuerte.some(frase => cleanText.includes(frase))
  if (hayMuerte) {
    if (cleanText.includes(nombreBot)) {
      console.log("Tu muerte ha sido detectada. Saliendo de la partida...")
      bot.chat('/play prototype_disasters')
      bot.pathfinder.setGoal(null)
    }
  }

  if (cleanText.includes("Winner:") || cleanText.includes("Winners (")) {
    recolectandoGanadores = true;
    ganadores = [];
    return;
  }

  if (recolectandoGanadores) {
    if (cleanText === '') {
      recolectandoGanadores = false;
      const nombresConcatenados = ganadores.join(' ').replace(/\s+/g, ' ');
      const listaGanadores = nombresConcatenados.split(',').map(n => n.trim());

      if (listaGanadores.includes(nombreBot)) {
        console.log(`¡Has ganado! 🎉 Estás en la lista de ganadores: ${listaGanadores.join(', ')}`);
        actualizarContadorVictorias()
      }
      bot.chat('/play prototype_disasters')
      bot.pathfinder.setGoal(null)
      return;
    }

    ganadores.push(cleanText);
  }

  if (cleanText.includes("Nobody survived!")) {
    bot.chat('/play prototype_disasters')
    bot.pathfinder.setGoal(null)
  }
})

function actualizarContadorVictorias() {
  const archivoVictorias = 'contador_victorias.txt';

  fs.readFile(archivoVictorias, 'utf8', (err, data) => {
    let victorias = 0;
    if (!err && data.trim().match(/^\d+$/)) {
      victorias = parseInt(data.trim());
    }

    victorias++;

    fs.writeFile(archivoVictorias, `${victorias}`, 'utf8', (err) => {
      if (err) {
        console.error("Error al escribir el archivo:", err);
      } else {
        console.log(`El número de victorias ha sido actualizado a: ${victorias}`);
      }
    });
  });
}