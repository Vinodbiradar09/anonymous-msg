'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Shield, MessageSquare, Users, Star } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
    
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center px-4 md:px-24 py-12 lg:py-20">
        
          <section className="text-center mb-12 md:mb-16 max-w-6xl mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 text-sm font-medium text-gray-300 mb-6">
                <Shield className="w-4 h-4 mr-2" />
                100% Anonymous & Secure
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Dive into the World of
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Anonymous Feedback
              </span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              True Feedback - Where your identity remains a secret and honest conversations flourish.
            </p>

          
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/sign-up">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Get Started Free
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300"
              >
                <Link href="/sign-in">
                  <Users className="w-5 h-5 mr-2" />
                  Sign In
                </Link>
              </Button>
            </div>
          </section>

        
          <section className="mb-16 w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 text-center">
                <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">100% Anonymous</h3>
                <p className="text-gray-400">Complete privacy and anonymity guaranteed for all users.</p>
              </div>
              
              <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 text-center">
                <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real Feedback</h3>
                <p className="text-gray-400">Get honest, unfiltered feedback from your audience.</p>
              </div>
              
              <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 text-center">
                <div className="bg-pink-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
                <p className="text-gray-400">Simple interface that anyone can use in seconds.</p>
              </div>
            </div>
          </section>

         
          <section className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Real Messages, Real Impact
                </span>
              </h2>
              <p className="text-gray-400 text-lg">
                See how people are using True Feedback to connect and grow
              </p>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8">
              <Carousel
                plugins={[Autoplay({ delay: 3000 })]}
                className="w-full max-w-4xl mx-auto"
              >
                <CarouselContent>
                  {messages.map((message, index) => (
                    <CarouselItem key={index} className="p-2 md:basis-1/2 lg:basis-1/3">
                      <Card className="bg-black/40 border-gray-700/50 hover:bg-black/60 transition-all duration-300 hover:scale-105 hover:border-gray-600/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg font-semibold">
                            {message.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500/20 p-2 rounded-lg">
                              <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                {message.content}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500 font-medium">
                                  {message.received}
                                </p>
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-current" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-gray-800/50 border-gray-700/50 text-white hover:bg-gray-700/50 -left-6" />
                <CarouselNext className="bg-gray-800/50 border-gray-700/50 text-white hover:bg-gray-700/50 -right-6" />
              </Carousel>
            </div>
          </section>

       
          <section className="mt-20 text-center max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Ready to Start Your Journey?
                </span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already experiencing the power of anonymous feedback.
              </p>
              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-10 py-4 rounded-xl shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/sign-up">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Create Your Account Now
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

    
      <footer className="bg-black border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                True Feedback
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              © 2023 True Feedback. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
