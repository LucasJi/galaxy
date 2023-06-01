import { useEffect, useState } from 'react';
import httpClient from '@utils/axios';
import { Post } from '@utils/typeUtil';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import * as Popover from '@radix-ui/react-popover';
import { AxiosResponse } from 'axios';

export default function Wikilink({
  href = '',
  onClick,
}: {
  href: string | undefined;
  onClick: (post: Post) => void;
}) {
  const [post, setPost] = useState<Post | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [slug, setSlug] = useState<string[]>([]);

  useEffect(() => {
    let postRelativePath = href;
    if (href.startsWith('/')) {
      postRelativePath = href.replace('/', '');
    }
    setSlug([...postRelativePath.split('/')]);
  }, [href]);

  useEffect(() => {
    httpClient.post('api/post', { slug }).then((res: AxiosResponse<Post>) => {
      if (res.data) {
        setPost(res.data);
      }
    });
  }, [slug]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // prevent displaying content by clicking the button
    // only display the content by mouse enter event
    e.preventDefault();
    if (post !== null) {
      onClick(post);
    }
  };

  return (
    <Popover.Root onOpenChange={setOpen} open={open}>
      <Popover.Trigger
        asChild
        onMouseEnter={() => {
          setOpen(true);
        }}
        onMouseLeave={() => {
          setOpen(false);
        }}
      >
        <button onClick={e => handleClick(e)}>{href}</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="bg-green-100 border-black h-60 w-60 text-ellipsis"
          side="right"
          sideOffset={50}
        >
          <ReactMarkdown>{post ? post.content : ''}</ReactMarkdown>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}