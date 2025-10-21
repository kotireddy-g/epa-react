interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 mb-4 ml-4">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-700" dangerouslySetInnerHTML={{ __html: item }}></li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-gray-900 mb-4 mt-6">
            {line.replace(/^#\s+/, '').replace(/^🎯\s*/, '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-semibold text-gray-900 mb-3 mt-5">
            {line.replace(/^##\s+/, '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-gray-800 mb-2 mt-4">
            {line.replace(/^###\s+/, '')}
          </h3>
        );
      }
      // Bullet points
      else if (line.match(/^[-*]\s+/)) {
        const content = line.replace(/^[-*]\s+/, '');
        // Handle bold within list items
        const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        listItems.push(formattedContent);
      }
      // Empty line
      else if (line.trim() === '') {
        flushList();
        if (elements.length > 0 && elements[elements.length - 1].type !== 'br') {
          elements.push(<br key={`br-${index}`} />);
        }
      }
      // Regular paragraph
      else if (line.trim() !== '') {
        flushList();
        // Handle bold text
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formattedLine = parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        
        elements.push(
          <p key={index} className="text-gray-700 mb-3 leading-relaxed">
            {formattedLine}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="prose prose-lg max-w-none">
      {parseMarkdown(content)}
    </div>
  );
}
