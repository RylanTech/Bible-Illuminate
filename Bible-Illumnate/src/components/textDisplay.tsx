import React from 'react';

const TextDisplay = ({ text }: any) => {
  const processedText = processText(text);

  function processText(text: string) {
    // Split text by newlines for proper formatting
    const lines = text.split('\n');
  
    // Process each line to replace **text** with <strong> and *text* with <em>
    return lines.map((line, index) => {
      const processedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
  
      return (
        <span key={index} dangerouslySetInnerHTML={{ __html: processedLine }} />
      );
    });
  }
  

  return (
    <div>
      {processedText.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};

export default TextDisplay;
