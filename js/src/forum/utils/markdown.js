/**
 * Minimal Markdown to HTML parser for sidebar content.
 * Supports: headings, bold, italic, links, unordered lists, paragraphs.
 */
export function parseMarkdown(text) {
    if (!text) return '';

    // Escape HTML to prevent XSS (except we'll re-allow safe tags)
    const escapeHtml = (str) =>
        str.replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;');

    const lines = text.split('\n');
    const output = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Heading
        const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
        if (headingMatch) {
            if (inList) { output.push('</ul>'); inList = false; }
            const level = headingMatch[1].length;
            output.push(`<h${level}>${escapeHtml(headingMatch[2])}</h${level}>`);
            continue;
        }

        // Unordered list
        const listMatch = line.match(/^[-*+]\s+(.+)$/);
        if (listMatch) {
            if (!inList) { output.push('<ul>'); inList = true; }
            output.push(`<li>${inlineMarkdown(listMatch[1], escapeHtml)}</li>`);
            continue;
        }

        if (inList) { output.push('</ul>'); inList = false; }

        // Blank line
        if (line.trim() === '') {
            output.push('');
            continue;
        }

        // Paragraph
        output.push(`<p>${inlineMarkdown(line, escapeHtml)}</p>`);
    }

    if (inList) output.push('</ul>');

    return output.join('\n');
}

function inlineMarkdown(text, escapeHtml) {
    // Process links FIRST before escaping, then escape everything else
    // Links: [text](url)
    let result = '';
    let remaining = text;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
        result += escapeHtml(text.slice(lastIndex, match.index));
        const linkText = escapeHtml(match[1]);
        // Only allow http/https URLs
        const url = match[2].match(/^https?:\/\//) ? match[2] : '#';
        result += `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
        lastIndex = match.index + match[0].length;
    }
    result += escapeHtml(text.slice(lastIndex));

    // Bold: **text**
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');

    return result;
}
