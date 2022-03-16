import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import vsDark from 'prism-react-renderer/themes/vsDark';
import type { HTMLProps } from 'react';

export type Props = { children: 'string' } & Pick<
  HTMLProps<HTMLDivElement>,
  'className'
>;

export default ({ children, className }: Props) => {
  const language = className?.replace(/language-/, '') ?? 'plaintext';

  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={language as Language}
      theme={vsDark}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style }}>
          {tokens.map((line, index) => {
            const lineProps = getLineProps({ line, key: index });
            return (
              <div key={index} {...lineProps}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};
