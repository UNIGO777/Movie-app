"use client";
import Link from "next/link";


const NavbarNav = ({ pathname }) => {

    return (
        <nav>

            <div className="bg-c-black-06 border-2 border-c-black-12 rounded-lg p-2.5 md:block hidden">
                <ul className="flex items-center text-c-grey-75 xl:text-super-sm text-xs">
                    <li
                        className={`lg:px-4 px-3.5 py-2 ${pathname === "/" && "bg-c-black-10 rounded font-medium"}`}>
                        <Link href="/">Home</Link>
                    </li>
                    <li
                        className={`lg:px-4 px-3.5 py-2 ${pathname === "/movies" && "bg-c-black-10 rounded font-medium"}`}>
                        <Link href="/">Movies</Link>
                    </li>
                    <li
                        className={`lg:px-4 px-3.5 py-2 ${pathname === "/series" && "bg-c-black-10 rounded font-medium"}`}>
                        <Link href="/series">Series</Link>
                    </li>
                    <li
                        className={`lg:px-4 px-3.5 py-2 ${pathname === "/support" && "bg-c-black-10 rounded font-medium"}`}>
                        <Link href="/support">Support</Link>
                    </li>
                    <li
                        className={`lg:px-4 px-3.5 py-2 ${pathname === "/subscriptions" && "bg-c-black-10 rounded font-medium"}`}>
                        <Link href="/subscriptions">Subscriptions</Link>
                    </li>
                </ul >
            </div >

        </nav >
    );
}

export default NavbarNav;