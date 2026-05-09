import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const analyzeSentiment = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      });

      const data = await response.json();
      setResult(data);
      setHistory(prev => [data, ...prev.slice(0, 4)]); // Keep last 5
    } catch (err) {
      setError("Failed to connect to API");
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    return sentiment === "positive" ? "#10b981" : sentiment === "negative" ? "#ef4444" : "#f59e0b";
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Sentiment Analysis Dashboard</h1>
          <p style={styles.headerSubtitle}>Powered by Machine Learning</p>
        </div>
      </header>

      {/* Main Dashboard */}
      <main style={styles.main}>
        <div style={styles.grid}>
          {/* Input Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Analyze Text</h2>
            <textarea
              rows="6"
              placeholder="Enter your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={styles.textarea}
            />
            <button
              onClick={analyzeSentiment}
              style={styles.button}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Sentiment"}
            </button>
            {error && <p style={styles.error}>{error}</p>}
          </div>

          {/* Results Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Analysis Result</h2>
            {result ? (
              <div style={styles.result}>
                <div style={{...styles.sentimentBadge, backgroundColor: getSentimentColor(result.sentiment)}}>
                  {result.sentiment.toUpperCase()}
                </div>
                <p style={styles.confidence}>
                  Confidence: {(result.confidence * 100).toFixed(2)}%
                </p>
                <div style={styles.confidenceBar}>
                  <div
                    style={{
                      ...styles.confidenceFill,
                      width: `${result.confidence * 100}%`,
                      backgroundColor: getSentimentColor(result.sentiment)
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <p style={styles.noResult}>No analysis yet. Enter text and click analyze.</p>
            )}
          </div>

          {/* History Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Recent Analyses</h2>
            {history.length > 0 ? (
              <ul style={styles.historyList}>
                {history.map((item, index) => (
                  <li key={index} style={styles.historyItem}>
                    <span style={{color: getSentimentColor(item.sentiment)}}>
                      {item.sentiment}
                    </span> - {item.text.substring(0, 50)}...
                  </li>
                ))}
              </ul>
            ) : (
              <p style={styles.noResult}>No recent analyses.</p>
            )}
          </div>

          {/* Stats Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Statistics</h2>
            <div style={styles.stats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{history.length}</span>
                <span style={styles.statLabel}>Total Analyses</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>
                  {history.filter(h => h.sentiment === 'positive').length}
                </span>
                <span style={styles.statLabel}>Positive</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>
                  {history.filter(h => h.sentiment === 'negative').length}
                </span>
                <span style={styles.statLabel}>Negative</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2024 Sentiment Analysis Dashboard. Built with React & FastAPI.</p>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#1e293b",
    color: "white",
    padding: "20px",
    textAlign: "center",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  headerTitle: {
    margin: "0",
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  headerSubtitle: {
    margin: "10px 0 0",
    fontSize: "1.2rem",
    opacity: 0.8,
  },
  main: {
    flex: 1,
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
  },
  cardTitle: {
    margin: "0 0 15px",
    fontSize: "1.5rem",
    color: "#1e293b",
    borderBottom: "2px solid #3b82f6",
    paddingBottom: "10px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
    resize: "vertical",
    fontSize: "16px",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  error: {
    color: "#ef4444",
    marginTop: "10px",
  },
  result: {
    textAlign: "center",
  },
  sentimentBadge: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  confidence: {
    fontSize: "1.1rem",
    marginBottom: "10px",
  },
  confidenceBar: {
    width: "100%",
    height: "10px",
    backgroundColor: "#e2e8f0",
    borderRadius: "5px",
    overflow: "hidden",
  },
  confidenceFill: {
    height: "100%",
    transition: "width 0.3s",
  },
  noResult: {
    color: "#64748b",
    fontStyle: "italic",
  },
  historyList: {
    listStyle: "none",
    padding: 0,
  },
  historyItem: {
    padding: "8px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
    textAlign: "center",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
  },
  statNumber: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "#64748b",
  },
  footer: {
    backgroundColor: "#1e293b",
    color: "white",
    textAlign: "center",
    padding: "15px",
    marginTop: "auto",
  },
};

export default App;