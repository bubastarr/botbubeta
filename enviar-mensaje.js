const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = '-1003632844994';
const MENSAJE = '¡Hola! Este es el mensaje automático de hoy. 🤖';

async function enviar() {
  if (!TOKEN) {
    console.error('Error: TELEGRAM_TOKEN no está definido en las variables de entorno.');
    process.exit(1);
  }

  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: MENSAJE })
    });
    const data = await res.json();
    console.log(data.ok ? 'Mensaje enviado con éxito!' : 'Error de Telegram: ' + data.description);
  } catch (err) {
    console.error('Error de red:', err);
  }
}

enviar();
