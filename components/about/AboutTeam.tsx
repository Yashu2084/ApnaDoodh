"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Twitter } from "lucide-react";

export default function AboutTeam() {
  const team = [
    {
      name: "Yash",
      role: "Founder",
      bio: "Pioneered ApnaDoodh to build fair-trade systems in Indian agriculture and ensure families get unadulterated milk.",
      image: "/assets/illustrations/yash.jpg",
      linkedin: "http://www.linkedin.com/in/yash4114",
      twitter: "https://x.com/Yash96159090",
    },
  ];

  return (
    <section className="relative w-full px-6 sm:px-12 lg:px-16 py-20 border-t border-slate-100 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">The Founder</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Meet Our Founder
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-500 font-medium">
            Leading the mission to build fair-trade systems in Indian agriculture and connect verified local dairy farmers directly with Indian families.
          </p>
        </div>

        {/* Centered Single Card */}
        <div className="flex justify-center max-w-sm mx-auto">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group relative w-full rounded-[2.5rem] border border-slate-100 bg-slate-50/45 p-8 hover:bg-white hover:border-blue-200 hover:shadow-2xl transition-all duration-300 text-center flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Circular Profile Image with border ring */}
                <div className="relative h-44 w-44 mx-auto rounded-full overflow-hidden p-1 bg-gradient-to-tr from-blue-600 via-blue-100 to-blue-400 group-hover:scale-105 transition duration-300">
                  <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-white bg-slate-100">
                    {member.image?.startsWith?.("/") ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={176}
                        height={176}
                        className="object-cover h-full w-full"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="176px"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {member.role}
                  </p>
                </div>

                <p className="text-xs leading-5 text-slate-500 font-medium">
                  {member.bio}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-4 pt-5 mt-auto text-slate-400">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition" aria-label={`${member.name} LinkedIn`}>
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition" aria-label={`${member.name} Twitter`}>
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
