'use client';

import React, { useEffect, useState, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';

import 'highlight.js/styles/monokai-sublime.css';

const Highlight = ({ children, testId }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const codeNode = useRef();
  const language = 'json';

  useEffect(() => {
    try {
      hljs.registerLanguage(language, json);
      setIsLoaded(true);
    } catch (error) {
      console.error(error);
      throw Error(`Cannot register the language ${language}`);
    }
  }, []);

  useEffect(() => {
    codeNode && codeNode.current && hljs.highlightElement(codeNode.current);
  });

  if (!isLoaded) return null;

  return (
    <div className="rounded-xl overflow-hidden bg-gray-900/50 border-2 border-gray-800">
      <div className="overflow-x-auto p-4">
        <pre className="rounded" data-testid={testId}>
          <code ref={codeNode} className={language}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default Highlight;