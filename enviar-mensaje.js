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

function obtenerMomentoDia() {
  const opciones = { hour: 'numeric', hour12: false, timeZone: 'America/Santiago' };
  const hora = parseInt(new Date().toLocaleTimeString('es-ES', opciones));
  console.log(`Hora actual en Chile para depuración: ${hora}:00`);
  return (hora < 15) ? 'MAÑANA' : 'TARDE_NOCHE';
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
  const momento = obtenerMomentoDia();
  const esManana = momento === 'MAÑANA';

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  // Prompt dinámico adaptado a la edición de la mañana o tarde/noche
  const prompt = `
    Busca en Google cuáles son las últimas noticias y novedades del Mundial de Fútbol de 2026, así como los partidos de fútbol, baloncesto u otros deportes destacados de hoy, ${fecha}.
    Luego, basándote en lo que encontraste, redacta un mensaje enérgico, informativo y motivador para el canal de apuestas de Telegram 'La Bubaneta'.

    Estás redactando la ${esManana ? 'EDICIÓN DE LA MAÑANA (10:00 AM hora chilena)' : 'EDICIÓN DE LA TARDE-NOCHE (7:00 PM hora chilena)'}.
    Adapta el contenido de la siguiente manera:
    - Si es de mañana: Enfócate en la previa de los partidos del día y las noticias del Mundial de esta mañana.
    - Si es de tarde/noche: Destaca noticias del cierre del día del Mundial, algunos resultados clave que ya se hayan dado y un vistazo a los partidos destacados de mañana.

    Escribe el mensaje directamente con la siguiente estructura y formato HTML compatible con Telegram (usa únicamente <b>, <i>, <code>):

    🔥 <b>BUBANETA ACTIVA: MUNDIAL & PICKS (${esManana ? 'Edición Mañana ☀️' : 'Edición Tarde-Noche 🌙'})</b> 🔥
    📅 <i>${fecha}</i>
    ━━━━━━━━━━━━━━━━━━━━
    👋 ¡${esManana ? 'Buen día' : 'Buenas tardes/noches'}, muchachos!

    📰 <b>Novedades del Mundial 2026:</b>
    [Menciona brevemente 1 o 2 noticias reales e interesantes de hoy sobre el Mundial de 2026 basadas en lo que encontraste en Google Search]

    📢 <b>${esManana ? 'Picks y análisis de hoy' : 'Análisis y partidos para mañana'}:</b>
    [Escribe aquí tu análisis motivador del día en español.
     - Si es mañana: Menciona por su nombre 2 o 3 de los partidos que se jueguen hoy para que el grupo los estudie.
     - Si es tarde/noche: Menciona de forma enérgica 2 o 3 partidos atractivos que se jueguen mañana para ir analizando la jugada previa.
     Usa jerga de apuestas como "parlays", "sumar verdes" y "estudiar los picks". Sé creativo]

    📊 <b>Reglas de oro:</b>
    • Estudiar bien antes de meterle 🧠
    • Controlar el bankroll y stake 📉
    • ¡A seguir sumando verdes! 🟢💸
    ━━━━━━━━━━━━━━━━━━━━
    🤖 <i>Mensaje automático generado con IA de la Bubaneta</i>

    Instrucciones críticas de formato:
    1. NO inventes partidos ni noticias. Usa eventos y noticias reales de hoy.
    2. NO utilices etiquetas HTML como <ul>, <li>, <p>, <div>, ni <br>.
    3. Si quieres hacer viñetas, usa texto plano con puntos tradicionales (•) o guiones (-).
    4. Si necesitas saltos de línea, usa saltos de línea normales de teclado, NUNCA la etiqueta <br>.
    5. No incluyas introducciones de IA ni bloques de código de markdown (\`\`\`). Empieza el texto directamente con "🔥 <b>BUBANETA ACTIVA: MUNDIAL & PICKS".
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
      
      // Filtro de seguridad: limpiar cualquier HTML no soportado por Telegram que Gemini pueda haber generado
      texto = texto
        .replace(/<br\s*\/?>/gi, '\n') // Reemplazar saltos de línea HTML por reales
        .replace(/<p>/gi, '') // Eliminar tags de párrafo
        .replace(/<\/p>/gi, '\n')
        .replace(/<ul>/gi, '') // Eliminar listas HTML y reemplazarlas por texto plano
        .replace(/<\/ul>/gi, '')
        .replace(/<li>/gi, '• ')
        .replace(/<\/li>/gi, '\n')
        .replace(/```html/g, '')
        .replace(/```/g, '')
        .trim();
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
    if (!data.ok) {
      throw new Error('Error al enviar a Telegram: ' + data.description);
    }
    console.log('Mensaje enviado con éxito!');
  } catch (err) {
    console.error('Error de red o de API al enviar a Telegram:', err);
    process.exit(1); // Fuerza a que la GitHub Action falle visiblemente
  }
}

enviar();
