import * as React from "react";

/**
 * Minimal markdown renderer for AI responses (FR-CHT-05): headings, lists,
 * tables, fenced code, inline code, bold and links. Deliberately dependency
 * free — swap in react-markdown if the buyer needs full CommonMark.
 */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    const key = `${keyPrefix}-i${index++}`;
    if (token.startsWith("`")) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      const [, label, href] = /\[([^\]]+)\]\(([^)]+)\)/.exec(token) ?? [];
      nodes.push(
        <a key={key} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>,
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderTable(rows: string[], key: string) {
  const cells = rows.map((row) =>
    row
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim()),
  );
  const [head, , ...body] = cells;
  return (
    <div key={key} className="my-3 overflow-x-auto scrollbar-thin">
      <table>
        <thead>
          <tr>
            {head.map((cell, i) => (
              <th key={i}>{renderInline(cell, `${key}-h${i}`)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{renderInline(cell, `${key}-c${rowIndex}-${cellIndex}`)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const key = `b${index}`;

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      index++;
      while (index < lines.length && !lines[index].startsWith("```")) code.push(lines[index++]);
      index++;
      blocks.push(
        <pre
          key={key}
          className="my-3 overflow-x-auto scrollbar-thin rounded-md border border-border bg-secondary/70 p-3.5 font-mono text-xs leading-relaxed"
        >
          {language && (
            <span className="mb-2 block text-[10px] uppercase tracking-wide text-muted-foreground">
              {language}
            </span>
          )}
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (line.trim().startsWith("|") && lines[index + 1]?.includes("---")) {
      const rows: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) rows.push(lines[index++]);
      blocks.push(renderTable(rows, key));
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const Tag = (["h1", "h2", "h3"] as const)[level - 1];
      blocks.push(<Tag key={key}>{renderInline(heading[2], key)}</Tag>);
      index++;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index++].replace(/^\s*[-*]\s+/, ""));
      }
      blocks.push(
        <ul key={key}>
          {items.map((item, i) => (
            <li key={i}>{renderInline(item, `${key}-${i}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(lines[index++].replace(/^\s*\d+\.\s+/, ""));
      }
      blocks.push(
        <ol key={key}>
          {items.map((item, i) => (
            <li key={i}>{renderInline(item, `${key}-${i}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    if (line.trim() === "") {
      index++;
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !lines[index].startsWith("```") &&
      !/^\s*[-*]\s+/.test(lines[index]) &&
      !/^\s*\d+\.\s+/.test(lines[index]) &&
      !/^#{1,3}\s/.test(lines[index]) &&
      !lines[index].trim().startsWith("|")
    ) {
      paragraph.push(lines[index++]);
    }
    blocks.push(<p key={key}>{renderInline(paragraph.join(" "), key)}</p>);
  }

  return <div className="prose-chat text-sm leading-relaxed">{blocks}</div>;
}
