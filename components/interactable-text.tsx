'use client';
import { ApplicationContext } from '@/contexts/application-context';
import { useContext, useEffect, useState } from 'react';
import InteractiveSentence from './interactive-sentance';

const InteractableText = () => {
  const { UIState } = useContext(ApplicationContext);
  const [parsedResult, setParsedResult] = useState<ParsedResult | null>(null);

  useEffect(() => {
    const result = parseComponentLevelJSON(UIState.interactableResponseString);
    console.log('Interactable content', UIState.interactableResponseString);
    console.log('Interactable content JSON', result);
    setParsedResult(result);
  }, [UIState]);

  return parsedResult ? (
    <InteractiveSentence parsedResult={parsedResult} />
  ) : null;
};

type DropdownOption = {
  type: 'DROPDOWN';
  id: string;
  default: string;
  options: string[];
};

type InputOption = {
  type: 'INPUT';
  id: string;
  placeholder: string;
  defaultValue: string;
};

type ParsedOption = DropdownOption | InputOption;

interface ParsedResult {
  text: string;
  components: ParsedOption[];
}

type AttributeKey = 'default' | 'options' | 'placeholder' | 'defaultValue';
type AttributeValue = string;
type AttributePair = `${AttributeKey}=${AttributeValue}`;

const parseComponentLevelJSON = (interactableContent: string): ParsedResult => {
  const regex = /<\[(DROPDOWN|INPUT)\](\([^)]+\))+>/g;
  const components: ParsedOption[] = [];
  let lastIndex = 0;
  let text = '';

  const result = interactableContent.replace(
    regex,
    (match, type, attributes, offset) => {
      text += interactableContent.slice(lastIndex, offset);
      lastIndex = offset + match.length;

      const parsedAttributes = attributes
        .slice(1, -1)
        .split(')(')
        .reduce(
          (acc: Record<AttributeKey, AttributeValue>, attr: string) => {
            const [key, value] = attr.split('=');
            if (isAttributeKey(key) && value !== undefined) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<AttributeKey, AttributeValue>,
        );

      const id = generateUniqueId(type);

      if (type === 'DROPDOWN') {
        components.push({
          type: 'DROPDOWN',
          id,
          default: parsedAttributes.default || '',
          options: parsedAttributes.options
            ? parsedAttributes.options.split(',')
            : [],
        });
      } else if (type === 'INPUT') {
        components.push({
          type: 'INPUT',
          id,
          placeholder: parsedAttributes.placeholder || '',
          defaultValue: parsedAttributes.defaultValue || '',
        });
      }

      return `{${type}:${id}}`;
    },
  );

  text += interactableContent.slice(lastIndex);

  return { text, components };
};

function isAttributeKey(key: string): key is AttributeKey {
  return ['default', 'options', 'placeholder', 'defaultValue'].includes(key);
}

function generateUniqueId(prefix: string): string {
  return `${prefix.toLowerCase()}_${Math.random().toString(36).substr(2, 9)}`;
}

export { InteractableText };

// OUTPUT DEMO
/**
 * <div className="font-medium text-2xl p-24 mt-24">
      Results for{' '}
      <select>
        <option>tony</option>
        <option>bruce</option>
        <option>steve</option>
        <option>peter</option>
      </select>{' '}
      for projects with file name{' '}
      <input
        defaultValue="new yeat 2024 template"
        className="border px-2 py-1"
      />
    </div>
 */
