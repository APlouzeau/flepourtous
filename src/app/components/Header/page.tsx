import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col items-center  bg-gradient-to-r from-cyan-500 to-blue-500">
      <h1>
        <Link
          href="/"
          className="w-full text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black"
        >
          Ludi Haru
        </Link>
      </h1>
      <nav className="w-full">
        <ul className="flex justify-around">
          <li>
            <Link href="/present" className="hover:text-gray-700">
              Présentation
            </Link>
          </li>
          <li>
            <Link href="/lessons" className="hover:text-gray-700">
              Offre des cours
            </Link>
          </li>
          <li>
            <Link href="/ressources" className="hover:text-gray-700">
              Ressources
            </Link>
          </li>
          <li>
            <Link href="/shop" className="hover:text-gray-700">
              Achats en ligne
            </Link>
          </li>
          <li>
            <Link href="/review" className="hover:text-gray-700">
              Avis
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
