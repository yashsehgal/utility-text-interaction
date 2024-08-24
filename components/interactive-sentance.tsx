import React from 'react';

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

interface InteractiveSentenceProps {
  parsedResult: ParsedResult;
}

const InteractiveSentence: React.FC<InteractiveSentenceProps> = ({
  parsedResult,
}) => {
  const { text, components } = parsedResult;

  const renderComponent = (component: ParsedOption) => {
    switch (component.type) {
      case 'DROPDOWN':
        return (
          <select key={component.id} defaultValue={component.default}>
            {component.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'INPUT':
        return (
          <input
            key={component.id}
            type="text"
            placeholder={component.placeholder}
            defaultValue={component.defaultValue}
          />
        );
      default:
        return null;
    }
  };

  const parts = text.split(/(\{(?:DROPDOWN|INPUT):[^}]+\})/);

  return (
    <div>
      {parts.map((part, index) => {
        const match = part.match(/\{(DROPDOWN|INPUT):([^}]+)\}/);
        if (match) {
          const [, type, id] = match;
          const component = components.find((c) => c.id === id);
          return component ? renderComponent(component) : part;
        }
        return part;
      })}
    </div>
  );
};

export default InteractiveSentence;
