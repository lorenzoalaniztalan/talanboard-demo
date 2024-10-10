"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Palette, Type, Smile } from 'lucide-react';

interface StickyNoteProps {
  note: {
    id: string;
    content: string;
    x: number;
    y: number;
    color: string;
    width: number;
    height: number;
    userName: string;
  };
  onRemove: (id: string) => void;
  onColorChange: (id: string) => void;
  onContentChange: (id: string, content: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDragStart: (e: React.MouseEvent, id: string) => void;
}

const emojis = ['😀', '😂', '🤔', '👍', '👎', '❤️', '🎉', '🔥', '🌟', '💡', '📌', '🚀', '💪', '🙌', '👀'];

type FontSize = 'small' | 'normal' | 'large';

const StickyNote: React.FC<StickyNoteProps> = ({
  note,
  onRemove,
  onColorChange,
  onContentChange,
  onResize,
  onDragStart,
}) => {
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [showEmojis, setShowEmojis] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fontSizes: { [key in FontSize]: string } = {
    small: '0.875rem',
    normal: '1rem',
    large: '1.25rem',
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.max(200, textareaRef.current.scrollHeight + 40);
      const contentLength = note.content.length;
      const newWidth = Math.min(Math.max(200, contentLength * 8), 400);
      onResize(note.id, newWidth, newHeight);
      textareaRef.current.style.height = `${newHeight - 40}px`;
    }
  }, [note.content, note.id, onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === textareaRef.current) {
      e.stopPropagation();
    } else {
      setIsDragging(true);
      onDragStart(e, note.id);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const insertEmoji = (emoji: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newContent = note.content.slice(0, start) + emoji + note.content.slice(end);
      onContentChange(note.id, newContent);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + emoji.length;
          textareaRef.current.focus();
        }
      }, 0);
    }
    setShowEmojis(false);
  };

  return (
    <Card 
      className="p-4 shadow-lg flex flex-col w-full h-full transition-all duration-300 ease-in-out sticky-note relative"
      style={{ 
        backgroundColor: note.color,
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onColorChange(note.id);
          }}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <Palette className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setFontSize(prev => prev === 'small' ? 'normal' : prev === 'normal' ? 'large' : 'small');
          }}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setShowEmojis(!showEmojis);
          }}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <Smile className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(note.id);
          }}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {showEmojis && (
        <div className="absolute top-10 right-0 bg-white p-2 rounded shadow-md z-10">
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  insertEmoji(emoji);
                }}
                className="text-2xl hover:bg-gray-100 rounded p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={note.content}
        onChange={(e) => onContentChange(note.id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        style={{ 
          fontSize: fontSizes[fontSize], 
          backgroundColor: 'transparent',
          border: 'none',
          resize: 'none',
          outline: 'none',
          overflow: 'hidden',
          color: 'black',
        }}
        className="w-full p-2 cursor-text flex-grow"
      />
      <div 
        className="absolute bottom-1 right-2 text-xs opacity-50"
        style={{
          background: `linear-gradient(to right, transparent, ${note.color})`,
          padding: '2px 4px',
          borderRadius: '4px',
        }}
      >
        {note.userName}
      </div>
    </Card>
  );
};

export default StickyNote;