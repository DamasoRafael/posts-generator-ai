import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
    // Configuração de CORS (para seu site poder chamar a API)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Responde rápido se for só o navegador testando a conexão (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Verifica se é POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { texto, tom } = req.body;

        const prompt = `
      Você é um especialista em Marketing Técnico.
      O usuário quer 3 posts sobre: "${texto}"
      
      CONTEXTO IMPORTANTE:
      O tom de voz deve ser EXATAMENTE: ${tom || 'neutro'}
      (Adapte as gírias, emojis e a agressividade do texto para esse tom).

      REGRAS RÍGIDAS DE RESPOSTA:
      1. Retorne APENAS um JSON válido.
      2. NÃO use blocos de código markdown (sem \`\`\`json).
      3. A estrutura deve ser EXATAMENTE esta:
      {
        "linkedin": "Texto...",
        "twitter": "Texto...",
        "youtube": "Texto..."
      }
    `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
        });

        const respostaIA = completion.choices[0]?.message?.content || "";

        // Limpeza do JSON (igual fazíamos no Code Node do n8n)
        const jsonLimpo = respostaIA.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonFinal = JSON.parse(jsonLimpo);

        return res.status(200).json(jsonFinal);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao processar IA', details: error.message });
    }
}