import ForceDirectedGraph from '@components/ForceDirectedGraph';
import Toc from '@components/Toc';
import { PostGraph } from '@types';
import { getIds } from '@utils/postUtil';
import { ReactNode } from 'react';

export default async function Layout({
  params: { id },
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const decodedId = decodeURIComponent(id);

  const postGraph: PostGraph = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${decodedId}/graph`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  ).then(resp => resp.json());

  return (
    <div className="flex w-full h-full">
      <div className="w-2/3 p-4 flex-1 overflow-y-auto">{children}</div>
      <div className="w-1/3 p-4 flex flex-col overflow-y-auto">
        <ForceDirectedGraph postGraph={postGraph} currentId={decodedId} />
        <Toc id={id} className="mt-4" />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return getIds();
}
