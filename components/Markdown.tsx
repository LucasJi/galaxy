'use client';

import Wikilink from '@components/Wikilink';
import wikilinkPlugin from '@utils/remark-wikilink';
import classNames from 'classnames';
import Link from 'next/link';
import ReactMarkdown, { Components } from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import remarkGfm from 'remark-gfm';
import { Element, Text } from 'hast';

const Markdown = ({
  markdown,
  className,
  titleLink,
}: {
  markdown: string;
  className?: string;
  titleLink?: string;
}) => {
  const components: Components = {
    a: props => {
      const { className, href, children } = props;
      return className?.includes('wikilink') && href ? (
        <Wikilink wikilink={href}>{children}</Wikilink>
      ) : (
        <a href={href} {...props} rel="noopener noreferrer" target="_blank" />
      );
    },
    h1: props => {
      if (titleLink) {
        return (
          <h1>
            <Link className="underline-l-r" href={titleLink}>
              {props.children}
            </Link>
          </h1>
        );
      }

      return <h1 {...props} />;
    },
    pre: props => {
      const { children, className, node } = props;

      const code = node.children.find(
        child => (child as Element).tagName === 'code',
      ) as Element | undefined;

      if (!code) {
        return <pre className={className}>{children}</pre>;
      }

      const codeClassName = code.properties?.className as string[];
      const language = codeClassName.flatMap(cls => {
        const match = /language-(\w+)/.exec(cls);
        return match ? [match[1]] : [];
      })[0];

      return language ? (
        <SyntaxHighlighter style={atomOneDark} language={language}>
          {(code.children[0] as Text).value.replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <pre className={className}>{children}</pre>
      );
    },
  };

  return (
    <article className={classNames('prose', 'prose-slate', className)}>
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm, wikilinkPlugin]}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
};

export default Markdown;
