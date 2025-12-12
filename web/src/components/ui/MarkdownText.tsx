import React from 'react';

interface MarkdownTextProps {
  text: string;
  className?: string;
}

const MarkdownText: React.FC<MarkdownTextProps> = ({ text, className = '' }) => {
  const renderMarkdown = (content: string) => {
    // Bold: **text** or __text__
    content = content.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
    content = content.replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>');
    
    // Italic: *text* or _text_
    content = content.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    content = content.replace(/_(.+?)_/g, '<em class="italic">$1</em>');
    
    // Code: `text`
    content = content.replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-sm font-mono">$1</code>');
    
    // Line breaks
    content = content.replace(/\n/g, '<br />');
    
    return content;
  };

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
    />
  );
};

export default MarkdownText;
