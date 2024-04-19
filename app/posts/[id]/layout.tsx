import GraphView from '@components/GraphView';
import Toc from '@components/Toc';
import Tree from '@components/Tree';
import { PostGraph } from '@types';
import { getIds } from '@utils/postUtil';
import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export default async function Layout({
  params: { id },
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const decodedId = decodeURIComponent(id);

  const postGraph: PostGraph = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${decodedId}/graph`,
    {
      method: 'GET',
    },
  ).then(resp => resp.json());

  const postTree = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/tree`,
    {
      method: 'GET',
    },
  ).then(resp => resp.json());

  return (
    <div className="flex w-full h-full">
      <div className="w-1/4 p-4 flex justify-end">
        <Tree data={postTree} className="w-[300px]" />
      </div>
      <div className="w-1/2 p-4 flex-1 overflow-y-auto">{children}</div>
      <div className="w-1/4 p-4 flex flex-col overflow-y-auto">
        <GraphView postGraph={postGraph} postId={decodedId} />
        <Toc id={id} className="mt-4" />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return getIds();
}
