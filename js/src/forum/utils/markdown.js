/**
 * Minimal Markdown to HTML parser for sidebar content.
 * Supports: headings, bold, italic, links, images, unordered lists, paragraphs.
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
    // Process images and links before escaping (both use [...](...) syntax)
    // Images: ![alt](url)  Links: [text](url)
    const mediaRegex = /(!?)\[([^\]]*)\]\(([^)]+)\)/g;
    let result = '';
    let lastIndex = 0;
    let match;

    while ((match = mediaRegex.exec(text)) !== null) {
        result += escapeHtml(text.slice(lastIndex, match.index));
        const isImage = match[1] === '!';
        const altOrText = escapeHtml(match[2]);
        // Only allow http/https URLs
        const url = match[3].match(/^https?:\/\//) ? match[3] : '#';
        const safeUrl = escapeHtml(url);

        if (isImage) {
            result += `<img src="${safeUrl}" alt="${altOrText}" style="max-width:100%;height:auto;">`;
        } else {
            result += `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${altOrText}</a>`;
        }
        lastIndex = match.index + match[0].length;
    }
    result += escapeHtml(text.slice(lastIndex));

    // Bold: **text**
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');

    return result;
}
