const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = '-1003632844994';

// Lista de frases de la Bubaneta enfocadas en apuestas, parlays y mentalidad ganadora
const FRASES = [
  "¡Hoy le vamos con todo a las apuestas! Se viene jornada de mucho estudio y análisis. A ganar hoy. ⚽🔥",
  "Hoy tenemos muy buenos parlays analizados. Confianza a tope y mentalidad ganadora. 📊💸",
  "Dios es grande y seguimos sumando verdes, señores. El esfuerzo y el estudio siempre dan frutos. 🟢🏆",
  "La confianza y estudiar las parlays es importante. Recuerden apostar con cabeza y responsabilidad. 🧠⚽",
  "¡Buen día, familia! La Bubaneta está activa. Hoy vamos por más verdes para la comunidad. 🟢🤑",
  "Hoy se trabaja duro en los análisis. La disciplina vence a la suerte. ¡Mentalidad ganadora hoy! 🚀💪",
  "¡Activos muchachos! Tenemos la mira puesta en las mejores ligas hoy. Vamos a sumar verdes. 💵📈",
  "Estudiar bien cada pick marca la diferencia. Menos suerte, más análisis. ¡Hoy cobramos! 🏆💎"
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

  // Formato HTML premium para Telegram estilo canal de apuestas
  const mensajeHTML = `
🔥 <b>BUBANETA ACTIVA</b> 🔥
📅 <i>${fecha}</i>
━━━━━━━━━━━━━━━━━━━━
👋 ¡Buen día, muchachos!

📢 <b>Mensaje de hoy:</b>
${fraseAleatoria}

📊 <b>Reglas de oro:</b>
• Estudiar bien antes de meterle 🧠
• Controlar el bankroll y stake 📉
• ¡A seguir sumando verdes! 🟢💸
━━━━━━━━━━━━━━━━━━━━
🤖 <i>Mensaje automático de Bubeta_bot</i>
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

