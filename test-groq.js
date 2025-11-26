import 'dotenv/config';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

console.log('🔑 API Key:', process.env.GROQ_API_KEY ? 'Configurada' : 'NÃO configurada');

async function test() {
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: "Diga apenas 'OK'" }],
            max_tokens: 10
        });
        console.log('✅ API Groq funcionando!');
        console.log('Resposta:', response.choices[0].message.content);
    } catch (e) {
        console.error('❌ Erro na API Groq:', e.message);
    }
}

test();
