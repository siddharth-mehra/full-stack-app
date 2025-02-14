'use client';
import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,

} from '@/components/ui/carousel';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen dark">
      {/* Main content */}
      <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col dark-mode gap-4 items-center justify-center px-4"
      >
        <div className="w-full flex flex-col max-w-[1280px] mx-auto items-center justify-center">

      
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
        Dive into the World of Anonymous Feedback
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
        True Feedback - Where your identity remains a secret..
        </div>
        
        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <footer className="text-center p-4 md:p-6 text-white">
        © 2023 True Feedback. All rights reserved.
        </footer>
        </div>
        </motion.div>
        </AuroraBackground>

      {/* Footer */}
      
    </div>
  );
}

     