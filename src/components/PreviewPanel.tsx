import React from "react";

interface PreviewPanelProps {
  code: string;
  filename?: string;
}

function extractPureHtml(code: string) {
  if (!code) return '';
  const startIndex = code.indexOf('<!DOCTYPE') !== -1
    ? code.indexOf('<!DOCTYPE')
    : code.indexOf('<html');
  if (startIndex === -1) return ''; // Nie znaleziono HTML!
  const endIndex = code.indexOf('</html>');
  if (endIndex === -1) return code.slice(startIndex).trim();
  return code.slice(startIndex, endIndex + 7).trim();
}

export function PreviewPanel({ code }: PreviewPanelProps) {
  if (!code) {
    return <div>Brak kodu do podglądu.</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%", background: "#222" }}>
      <h3 style={{ color: "#fff", padding: "8px" }}>Live Preview (iframe)</h3>
      <iframe
        srcDoc={extractPureHtml(code)}
        title="Podgląd"
        style={{ width: "100%", height: "80vh", border: "1px solid #444", background: "#fff" }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
}
