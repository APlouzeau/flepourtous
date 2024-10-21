import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" flex justify-center content-center w-100 bg-gradient-to-r from-blue-500 to-cyan-500 min-h-24">
      <p className="">Copyright</p>
      <Link href="/contactme" className="">
        Me contacter
      </Link>
    </footer>
  );
}
