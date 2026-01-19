// importa o useState para criar variaveis reativas
import { useState } from 'react';
import './App.css'; // importa css que usarei

function App() {
  // 1. definicao dos estados
  const [texto, setTexto] = useState(''); // estado para armazenar o texto digitado
  const [resultado, setResultado] = useState(null); // estado para armazenar o resultado da conversao
  const [loading, setLoading] = useState(false); // estado para indicar se a conversao esta em andamento
  const [tom, setTom] = useState('neutro'); // estado para o tom do texto, usa-se neutro pois caso o usario n mexa em nada, a IA saiba oq fazer

  // 2. funcao que chama o n8n
  const gerarPosts = async (e) => {
    e.preventDefault(); // evita que a pagina recarregue ao enviar o formulario
    setLoading(true); // inicia o loading
    setResultado(null); // reseta o resultado anterior

    try {
      // IMPORTANTE: usarei URL de teste do n8n (aquela que muda)
      // Quando for pra produção, usarei a URL de Production do n8n
      const response = await fetch('/api/gerar-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, tom })
      });

      if (!response.ok) throw new Error('Erro na requisicao ao n8n');

      const data = await response.json(); // pega a resposta em JSON

      // O n8n geralmente devolve um array. Vamos pegar o primeiro item.
      // Ajuste aqui conforme o retorno exato do seu fluxo (console.log ajuda)
      //setResultado(data);
      setResultado(data[0] || data)

    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao gerar o post, verifique se o n8n esta rodando.');
    } finally {
      setLoading(false); // desativa o loading independete do resultado
    }
  }

  // Versão corrigida e robusta
  const copiarParaClipboard = async (texto) => {
    try {
      if (!texto) return; // Não faz nada se o texto estiver vazio

      await navigator.clipboard.writeText(texto);
      alert("Copiado com sucesso! ✅");

    } catch (err) {
      console.error("Falha ao copiar:", err);
      // Fallback para navegadores antigos ou restritos (opcional, mas bom ter)
      alert("Erro ao copiar. O navegador bloqueou a permissão.");
    }
  }

  // 3. O HTML (JSX) retornado
  return (
    <div className="container">
      <h1>Gerador de Posts com IA 🤖</h1>

      <form onSubmit={gerarPosts}>
        <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Tom de Voz:</label>
          <select
            value={tom}
            onChange={(e) => setTom(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px' }}
          >
            <option value="neutro">Neutro / Informativo</option>
            <option value="engraçado">Engraçado / Memeiro 🤣</option>
            <option value="polêmico">Polêmico / Opinião Forte 🔥</option>
            <option value="corporativo">Corporativo / LinkedIn Top Voice 💼</option>
          </select>
        </div>

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cole aqui o link ou o assunto (ex: Novidades do React 19)..."
          rows="4"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Gerando Mágica...' : 'Gerar Posts'}
        </button>
      </form>

      {/* Renderização Condicional: Só mostra se tiver resultado */}
      {resultado && (
        <div className="resultados">

          {/* Card LinkedIn */}
          <div className="card linkedin">
            <div className="header-card">
              <h3>LinkedIn 💼</h3>
              <button
                className="btn-copy"
                onClick={() => copiarParaClipboard(resultado.linkedin)}
              >
                Copiar
              </button>
            </div>
            <p>{resultado.linkedin}</p>
          </div>

          {/* Card Twitter */}
          <div className="card twitter">
            <div className="header-card">
              <h3>Twitter / X 🐦</h3>
              <button
                className="btn-copy"
                onClick={() => copiarParaClipboard(resultado.twitter)}
              >
                Copiar
              </button>
            </div>
            <p>{resultado.twitter}</p>
          </div>

          {/* Card YouTube */}
          <div className="card youtube">
            <div className="header-card">
              <h3>YouTube 🎥</h3>
              <button
                className="btn-copy"
                onClick={() => copiarParaClipboard(resultado.youtube)}
              >
                Copiar
              </button>
            </div>
            <p>{resultado.youtube}</p>
          </div>
        </div>
      )}

      {/* RODAPÉ - Adicione este bloco antes do fechamento da div principal */}
      <footer className="footer">
        <p>
          Desenvolvido por <strong>Rafael Damaso</strong>
        </p>
        <div className="social-links">
          <a href="https://github.com/DamasoRafael" target="_blank" rel="noreferrer">GitHub</a>
          <span>|</span>
          <a href="https://www.linkedin.com/in/rafael-damaso-26b678284/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>

    </div> // <--- Fechamento da div App ou container
  )
}
export default App
