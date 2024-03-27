'use client';
import { ScrollShadow } from '@nextui-org/react';
import { TreeNode, TreeProps } from '@types';
import classNames from 'classnames';
import Link from 'next/link';
import {
  createContext,
  FC,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

const DEFAULT_ICON_SIZE = 16;

const FoldIcon: FC<{ isExpanded: boolean }> = ({ isExpanded }) => (
  <svg
    className={classNames('transition-transform', {
      'rotate-90': isExpanded,
    })}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    width={DEFAULT_ICON_SIZE}
    height={DEFAULT_ICON_SIZE}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    />
  </svg>
);

const TreeNodeComponent: FC<{ node: TreeNode }> = ({ node }) => {
  const expandedNodeNames = useContext(TreeContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useLayoutEffect(() => {
    if (!isExpanded) {
      setIsExpanded(expandedNodeNames.includes(node.name));
    }
  }, [expandedNodeNames]);

  return node.children ? (
    <li className="mt-1">
      <button onClick={toggleExpand} className="flex items-center">
        <FoldIcon isExpanded={isExpanded} />
        <span className="min-h-0 font-semibold max-w-[200px] text-base inline-block truncate">
          {node.name}
        </span>
      </button>
      <div
        className={classNames(
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          'transition-all',
          'grid',
          'overflow-hidden',
        )}
      >
        <ul
          className={classNames(
            'min-h-0',
            'ml-4',
            'transition-all',
            { 'opacity-100 visible': isExpanded },
            { 'opacity-0 invisible': !isExpanded },
          )}
        >
          {node.children.map(child => (
            <TreeNodeComponent key={child.id} node={child} />
          ))}
        </ul>
      </div>
    </li>
  ) : (
    <li className={classNames('mt-1 w-fit max-w-[200px] truncate')}>
      <Link href={`/post/${node.id}`} className="min-h-0 text-sm font-normal">
        {node.name}
      </Link>
    </li>
  );
};

const TreeContext = createContext<string[]>([]);

const Tree: React.FC<TreeProps> = ({ data, currentNodeId }) => {
  const expandedNodeNames: string[] = [];

  const contains = (nodes: TreeNode[] | undefined): boolean => {
    if (!nodes) {
      return false;
    }

    for (const node of nodes) {
      if (node.id === currentNodeId) {
        return true;
      }

      if (contains(node.children)) {
        expandedNodeNames.push(node.name);
        return true;
      }
    }

    return false;
  };

  contains(data);

  return (
    <div className="px-2">
      <span>目录</span>
      <ScrollShadow className="w-full h-full">
        <ul>
          <TreeContext.Provider value={expandedNodeNames}>
            {data.map(node => (
              <TreeNodeComponent key={node.id} node={node} />
            ))}
          </TreeContext.Provider>
        </ul>
      </ScrollShadow>
    </div>
  );
};

export default Tree;
