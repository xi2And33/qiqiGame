import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <Image
        src="images/0.jpg"
        alt="qiqi logo"
        width={100}
        height={100}
        priority
      />
    </div>
  );
}
