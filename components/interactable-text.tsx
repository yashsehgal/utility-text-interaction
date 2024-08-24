'use client';
import { ApplicationContext } from '@/contexts/application-context';
import { useContext, useEffect, useState } from 'react';

const DROPDOWN_SYNTAX_CHECK: string = '{DROPDOWN:' as string;
const INPUT_SYNTAX_CHECK: string = '{INPUT:' as string;

const InteractableText = () => {
  const { UIState } = useContext(ApplicationContext);
  const [renderableList, setRenderableList] = useState<ParsedResult>(
    undefined as unknown as ParsedResult,
  );

  const getRenderableItem = (type: 'DROPDOWN' | 'INPUT', targetID: string) => {
    if (!targetID || !renderableList) {
      console.log(
        'Error: Please provide an element ID or renderableList is undefined',
        `getting id=${targetID}`,
      );
      return undefined;
    }
    return renderableList.components.find(
      (component) => component.type === type && component.id === targetID,
    );
  };

  const getComponentID = (type: 'DROPDOWN' | 'INPUT', text: string) => {
    switch (type) {
      case 'DROPDOWN':
        return text.replace(DROPDOWN_SYNTAX_CHECK, '').slice(0, -1); // removing dropdown syntax highlighter along with the last closing bracket '}'
      case 'INPUT':
        return text.replace(INPUT_SYNTAX_CHECK, '').slice(0, -1);
      default:
        return undefined;
    }
  };

  useEffect(() => {
    console.log('Interactable content', UIState.interactableResponseString);
    console.log(
      'Interactable content JSON',
      parseComponentLevelJSON(UIState.interactableResponseString),
    );
    setRenderableList(
      parseComponentLevelJSON(UIState.interactableResponseString),
    );
  }, [UIState]);

  const InteractableSentence = () => {
    if (!renderableList) return null;

    return (
      <>
        {renderableList.renderableText
          .split(' ')
          .map((text: string, index: number) => {
            if (text.includes(DROPDOWN_SYNTAX_CHECK)) {
              const componentId = getComponentID('DROPDOWN', text) || '';
              const dropdownComponent = getRenderableItem(
                'DROPDOWN',
                componentId,
              ) as DropdownOption | undefined;

              return (
                <select
                  className="px-2 py-1 bg-blue-500 text-white border-b-4 border-t-2 border-x-2 border-blue-800 rounded-lg focus:outline-none transition-all mb-2 appearance-none"
                  defaultValue={dropdownComponent?.default}
                  key={index}>
                  {dropdownComponent?.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );
            } else if (text.includes(INPUT_SYNTAX_CHECK)) {
              const componentId = getComponentID('INPUT', text) || '';
              const inputComponent = getRenderableItem('INPUT', componentId) as
                | InputOption
                | undefined;
              return (
                <input
                  type="text"
                  className="px-2 py-1 rounded-lg border-b-4 border-t border-x focus:outline-none focus:border-neutral-400 "
                  placeholder={inputComponent?.placeholder}
                  defaultValue={inputComponent?.defaultValue}
                  key={index}
                />
              );
            } else {
              return (
                <span key={index} className="font-semibold">
                  {text}{' '}
                </span>
              );
            }
          })}
      </>
    );
  };

  return (
    <div className="interactable-text-wrapper flex flex-wrap gap-1.5 items-center w-[40%]">
      {renderableList ? <InteractableSentence /> : <></>}
    </div>
  );
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
  renderableText: string;
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

  console.log('result', result);

  text += interactableContent.slice(lastIndex);

  return { text, components, renderableText: result };
};

function isAttributeKey(key: string): key is AttributeKey {
  return ['default', 'options', 'placeholder', 'defaultValue'].includes(key);
}

function generateUniqueId(prefix: string): string {
  return `${prefix.toLowerCase()}_${Math.random().toString(36).substr(2, 9)}`;
}

export { InteractableText };
