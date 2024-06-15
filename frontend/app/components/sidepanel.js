import Image from "next/image";
import Link from "next/link";

const SidePanel = () => {
  return (
    <div className="w-[25%] h-screen bg-white fixed border-r-2">
      <div className="p-6 border-b-2">
        <Image src="/images/logo.svg" alt="logo" width={335} height={52} />
      </div>
      <div className="flex flex-col py-4 px-10 gap-6 item-center justify-center">
        <Link href="/">
          <button className=" py-2 rounded-xl bg-blue-700 flex items-center justify-center gap-4 w-[100%]">
            <span>
              <Image
                src="/images/dashboardactive.svg"
                alt="home"
                width={25}
                height={25}
              />
            </span>
            <span className="text-white text-2xl font-medium">Dashboard</span>
          </button>
        </Link>
        <Link href="/projects">
          <button className=" py-2 rounded-xl bg-pink-700 flex items-center justify-center gap-4 w-[100%]">
            <span>
              <Image
                src="/images/projectactive.svg"
                alt="projects"
                width={25}
                height={25}
              />
            </span>
            <span className="text-white text-2xl font-medium">Projects</span>
          </button>
        </Link>
        <Link href="/livechat">
          <button className=" py-2 rounded-xl bg-red-700 flex items-center justify-center gap-4 w-[100%]">
            <span>
              <Image
                src="/images/chatactive.svg"
                alt="Chat"
                width={25}
                height={25}
              />
            </span>
            <span className="text-white text-2xl font-medium">Discussion</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SidePanel;
