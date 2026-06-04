const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CHAT_ID = '-1003632844994';

// Frases de respaldo en caso de que falle la API de Gemini
const FRASES_RESPALDO = [
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
  const hoy = new Date().toLocaleDateString('es-ES', opciones);
  return hoy.charAt(0).toUpperCase() + hoy.slice(1);
}

function obtenerMensajeRespaldo() {
  const fecha = obtenerFechaFormateada();
  const fraseAleatoria = FRASES_RESPALDO[Math.floor(Math.random() * FRASES_RESPALDO.length)];
  return `
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
🤖 <i>Mensaje automático de Bubeta_bot (Respaldo)</i>
  `.trim();
}

async function generarMensajeConIA() {
  console.log("--- INICIO DEPURACIÓN ---");
  console.log("¿TELEGRAM_TOKEN está definido?", !!TELEGRAM_TOKEN);
  console.log("¿GEMINI_API_KEY está definido?", !!GEMINI_API_KEY);
  if (GEMINI_API_KEY) {
    console.log("Longitud de GEMINI_API_KEY:", GEMINI_API_KEY.length);
  }
  console.log("--- FIN DEPURACIÓN ---");

  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY no configurado en las variables de entorno. Usando mensaje de respaldo.');
    return obtenerMensajeRespaldo();
  }

  const fecha = obtenerFechaFormateada();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  // Este prompt le pide a Gemini buscar partidos reales del día actual y armar el mensaje con esos datos reales.
  const prompt = `
    Busca en Google cuáles son los partidos de fútbol, baloncesto u otros deportes más importantes y destacados para hoy, ${fecha}.
    Luego, basándote en esos partidos reales que encontraste, redacta un mensaje enérgico y motivador para el canal de apuestas de Telegram 'La Bubaneta'.

    Escribe el mensaje directamente con la siguiente estructura y formato HTML compatible con Telegram (usa únicamente <b>, <i>, <code> y listas):

    🔥 <b>BUBANETA ACTIVA</b> 🔥
    📅 <i>${fecha}</i>
    ━━━━━━━━━━━━━━━━━━━━
    👋 ¡Buen día, muchachos!

    📢 <b>Mensaje y análisis de hoy:</b>
    [Escribe aquí tu análisis motivador del día en español. Menciona por su nombre 2 o 3 de los partidos reales que encontraste para hoy y aconseja al grupo que los estudie. Mantén un tono de tipster motivado. Usa jergas como "parlays", "sumar verdes" y "estudiar los picks". Sé creativo y cambia la redacción cada día]

    📊 <b>Reglas de oro:</b>
    • Estudiar bien antes de meterle 🧠
    • Controlar el bankroll y stake 📉
    • ¡A seguir sumando verdes! 🟢💸
    ━━━━━━━━━━━━━━━━━━━━
    🤖 <i>Mensaje automático generado con IA de la Bubaneta</i>

    Instrucciones críticas:
    1. NO inventes partidos. Usa los partidos que existan en la realidad para hoy. Si no hay partidos destacados, menciona ligas activas hoy.
    2. No incluyas introducciones como "Aquí tienes el mensaje de hoy" ni bloques de código de markdown (\`\`\`). Empieza el texto directamente con "🔥 <b>BUBANETA ACTIVA</b> 🔥".
  `.trim();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en API de Gemini: ${response.statusText} (${response.status}) - Detalles: ${errorText}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      let texto = data.candidates[0].content.parts[0].text;
      
      // Limpiar posibles bloques de código markdown que Gemini a veces añade por error
      texto = texto.replace(/```html/g, '').replace(/```/g, '').trim();
      return texto;
    }
    throw new Error('Respuesta de Gemini estructurada incorrectamente');
  } catch (err) {
    console.error('Error al generar mensaje con Gemini:', err);
    return obtenerMensajeRespaldo();
  }
}

async function enviar() {
  if (!TELEGRAM_TOKEN) {
    console.error('Error: TELEGRAM_TOKEN no está definido en las variables de entorno.');
    process.exit(1);
  }

  const mensaje = await generarMensajeConIA();
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensaje,
        parse_mode: 'HTML'
      })
    });
    const data = await res.json();
    console.log(data.ok ? 'Mensaje enviado con éxito!' : 'Error de Telegram: ' + data.description);
  } catch (err) {
    console.error('Error de red al enviar a Telegram:', err);
  }
}

enviar();
