import { Divider, Link } from '@nextui-org/react';
import { RxGithubLogo } from 'react-icons/rx';

const Footer = () => {
  return (
    <footer className="w-1/2 mx-auto flex flex-col items-center h-[100px] mb-8">
      <Divider className="my-4" />
      <div className="w-full flex h-16 justify-between">
        <div className="flex flex-col">
          <span>Galaxy Blog</span>
          <span className="font-extralight text-sm">
            ©2024 Created by Lucas Ji
          </span>
          <a
            className="font-extralight text-sm hover:underline "
            href="https://beian.miit.gov.cn/"
            target="_blank"
          >
            苏ICP备2023055488号
          </a>
        </div>
        <div>
          <Link href="https://github.com/LucasJi" isExternal color="foreground">
            <RxGithubLogo size={22} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
