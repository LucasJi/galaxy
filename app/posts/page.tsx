'use client';

import { useEffect, useState } from 'react';
import httpClient from '@utils/axios';
import { Post } from '@types';
import { AxiosResponse } from 'axios';
import Link from 'next/link';

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    httpClient.get('api/posts').then((res: AxiosResponse<Post[]>) => {
      const posts = res.data;
      if (posts !== null) {
        setPosts([...posts]);
      }
    });
  }, []);

  return (
    <div className="pt-4 pl-4">
      <h1>Posts</h1>
      <div className="flex flex-col">
        {posts.map(({ wikilink, title, href }) => (
          <Link href={href} key={wikilink}>
            {title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Posts;