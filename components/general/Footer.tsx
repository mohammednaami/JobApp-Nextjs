"use client";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import Logo from "@/public/images/logo.png";

export function Footer() {
  return (
    <footer className="rounded-lg mt-4">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link className="flex items-center" href="/">
              <Image
                src={Logo}
                alt="Job Board Logo"
                width={50}
                height={50}
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Resources
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link
                    href="https://monaami.com/about"
                    className="hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://monaami.com/projects"
                    className="hover:underline">
                    Projects
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Follow Me
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link
                    href="https://github.com/mohammednaami"
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://linkedin.com/in/mohammed-naami"
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Legal
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link
                    href="https://monaami.com/privacy"
                    className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://monaami.com/terms"
                    className="hover:underline">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

        {/* Bottom Section */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            &copy; 2025 Mohammed Naami. All Rights Reserved.
          </span>

          {/* Social Media Icons */}
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
            <Link
              href="https://www.facebook.com/naamimohammed/"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              target="_blank"
              rel="noreferrer">
              <Facebook className="w-5 h-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://x.com/N3M1MO"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              target="_blank"
              rel="noreferrer">
              <Twitter className="w-5 h-5" />
              <span className="sr-only">X</span>
            </Link>
            <Link
              href="https://linkedin.com/in/mohammed-naami"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              target="_blank"
              rel="noreferrer">
              <Linkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="https://github.com/mohammednaami"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              target="_blank"
              rel="noreferrer">
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://www.instagram.com/naamimohammed/"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              target="_blank"
              rel="noreferrer">
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
