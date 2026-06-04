const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = '-1003632844994';

// Lista de frases dinámicas para "darle vida" al mensaje
const FRASES = [
  "La única manera de hacer un gran trabajo es amar lo que haces. 💻",
  "El éxito no es el final, el fracaso no es la ruina: lo que cuenta es el valor para continuar. 🚀",
  "La persistencia supera al talento cuando el talento no se esfuerza. 💪",
  "No cuentes los días, haz que los días cuenten. 🌟",
  "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora. 🌱",
  "La disciplina tarde o temprano vencerá a la inteligencia. 🥋",
  "Pequeños pasos todos los días te llevan a grandes metas. 🚶‍♂️",
  "¡Haz de hoy un día increíble! La actitud lo es todo. 😎",
  "Sé la mejor versión de ti mismo hoy. 💎",
  "La creatividad es la inteligencia divirtiéndose. 🎨"
];

function obtenerFechaFormateada() {
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Santiago' };
  // Usamos el locale de español para la fecha
  const hoy = new Date().toLocaleDateString('es-ES', opciones);
  // Capitalizar la primera letra
  return hoy.charAt(0).toUpperCase() + hoy.slice(1);
}

async function enviar() {
  if (!TOKEN) {
    console.error('Error: TELEGRAM_TOKEN no está definido en las variables de entorno.');
    process.exit(1);
  }

  const fecha = obtenerFechaFormateada();
  const fraseAleatoria = FRASES[Math.floor(Math.random() * FRASES.length)];

  // Formato HTML premium para Telegram
  const mensajeHTML = `
📅 <b>${fecha}</b>
━━━━━━━━━━━━━━━━━━━━
👋 ¡Hola, grupo! Espero que tengan un excelente día.

💡 <b>Inspiración para hoy:</b>
<i>"${fraseAleatoria}"</i>

🔋 <b>Recordatorios saludables:</b>
• Beber agua suficiente 💧
• Estirar las piernas 🚶‍♂️
• Descansar la vista de la pantalla 👁️
━━━━━━━━━━━━━━━━━━━━
🤖 <i>Mensaje automático enviado por Bubeta_bot</i>
  `.trim();

  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: CHAT_ID, 
        text: mensajeHTML,
        parse_mode: 'HTML' // Permite usar <b>, <i>, etc.
      })
    });
    const data = await res.json();
    console.log(data.ok ? 'Mensaje dinámico enviado con éxito!' : 'Error de Telegram: ' + data.description);
  } catch (err) {
    console.error('Error de red:', err);
  }
}

enviar();

