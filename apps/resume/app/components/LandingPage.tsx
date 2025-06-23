'use client'

import Image from "next/image";
import { Button } from "@resume/ui/button";
import { useSession } from "next-auth/react";
import ShimmerButton from "@resume/ui/shimmer-button";
import { ArrowBigRight, ArrowRight, Linkedin, Mail, Star } from 'lucide-react';
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@resume/ui/card"
import { Badge } from "@resume/ui/badge";
import { Textarea } from "@resume/ui/textarea";
import { Input } from "@resume/ui/input";
import { Label } from "@resume/ui/label";
import { Separator } from "@resume/ui/separator";
import { useToast } from "@resume/ui/hooks/use-toast";
import WallOfLove from "./WallOfLove";

interface LandingPageProps {
  initialReviews: any[];
}

export default function LandingPage({ initialReviews }: LandingPageProps) {
  const [messageBody, setMessageBody] = useState({
    message: '',
    email: ''
  });

  const { toast } = useToast();
  const { data } = useSession();

  const buildResumeUrl = data?.user ? `${process.env.DOMAIN}/editor` : `${process.env.DOMAIN}/api/auth/signin`;
  const uploadResumeUrl = data?.user ? `${process.env.DOMAIN}/upload` : `${process.env.DOMAIN}/api/auth/signin`;

  return (
    <main className="relative px-2 lg:px-8 min-h-screen overflow-hidden text-white">
      <div className="relative z-10 py-8 md:py-12">
        <div className="max-w-[1300px] mx-auto items-center">
          <div className="space-y-8">
            <h1 className="text-[3.75rem] leading-[1.2] font-semibold text-black dark:text-white">
              Build your professional
              <br />
              resume in minutes.
            </h1>

            <p className="text-gray-500 text-lg md:text-xl max-w-xl">
              If a sheet of paper represents your entire work life, personality,
              and skills, it better be a pretty amazing piece of paper — Let
              us do the heavy lifting.
            </p>

            <div className="flex gap-2">
              <Link href={buildResumeUrl} className="z-10 w-48">
                <Button className="border px-6 py-6 text-md">
                  Build your resume
                </Button>
                <p className="text-gray-500 text-xs pt-2 text-center">Choose from 7 templates</p>
              </Link>
              <Link href={uploadResumeUrl} className="z-10 w-48">
                <Button variant="secondary" className="border px-6 py-6 text-md">
                  Upload existing
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wall of Love section */}
        <div className="max-w-[1300px] mx-auto mt-32">
          <WallOfLove initialReviews={initialReviews} />
        </div>

        {/* Public Roadmap section */}
        <div className="max-w-[1300px] mx-auto flex flex-col gap-5 mt-40">
          <div>
            <h1 className="text-[2rem] text-black dark:text-white">Public Roadmap</h1>
            <p className="text-gray-500">Upcoming content or features to be launched. Not all features will be publicized on the roadmap.</p>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Live ATS recommendations</CardTitle>
                <CardDescription>Get live recommendations for ats-friendly resume.</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Badge className="text-white">#ats</Badge>
                <Badge className="text-white">#resume</Badge>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">AI generated resume</CardTitle>
                <CardDescription>Generate and improve your resume with AI in secodns.</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Badge className="text-white">#ai</Badge>
                <Badge className="text-white">#resume</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact section */}
        <div className="max-w-[1300px] mx-auto flex justify-between mt-20">
          <div>
            {/* Top Section */}
            <div className="mb-10">
              <h1 className="text-[2rem] leading-[1.2] font-semibold text-black dark:text-white">
                What features do you need?
                <br />
                Don't hesitate to reach out.
              </h1>
              <p className="text-gray-500 mt-4">
                Have questions, feedback, or anything to say? Tell me.
                <br />
                I usually get back within 1-2 days.
              </p>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
              {/* Left Section */}
              <div className="lg:w-full flex flex-col gap-6">
                <div className="flex justify-between items-center group">
                  <div className="flex gap-4 items-center">
                    <Mail className="text-gray-400 group-hover:text-primary" />
                    <p className="text-gray-400">Email me.</p>
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-primary" />
                </div>
                <div className="flex justify-between items-center group">
                  <div className="flex gap-4 items-center">
                    <Linkedin className="text-gray-400 group-hover:text-primary" />
                    <p className="text-gray-400">Follow me on LinkedIn.</p>
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:w-1/2 w-full">
            <Card className="shadow-lg w-full p-3 pb-0">
              <CardContent className="flex flex-col justify-center gap-3">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm">Message</Label>
                  <Textarea 
                    placeholder="Your message" 
                    className="w-full bg-white dark:bg-black" 
                    rows={5}
                    required
                    value={messageBody.message}
                    onChange={(e) => {
                      setMessageBody({ ...messageBody, message: e.target.value })
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <Label className="text-sm">Email</Label>
                    <p className="text-xs text-gray-400">If you'd like a reply, please provide the email</p>
                  </div>
                  <Input 
                    placeholder="johndoe@gmail.com" 
                    className="w-full bg-white dark:bg-black" 
                    value={messageBody.email}
                    onChange={(e) => {
                      setMessageBody({ ...messageBody, email: e.target.value })
                    }}
                  />
                </div>
                <Button 
                  onClick={async () => {
                    const response = await fetch("/api/slack", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(messageBody),
                    });
                    if(response?.status === 200) {
                      toast({
                        variant: 'success',
                        description: 'Thanks for your message!'
                      })
                    }
                    setMessageBody({
                      message: "",
                      email: ""
                    })
                  }} 
                  className="self-end mt-2 text-white"
                >
                  Send message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA Section */}
        <Card className="max-w-[1300px] mx-auto">
          <CardContent className="flex p-0 flex-col flex-wrap md:flex-row md:flex-nowrap relative pb-0 w-full mt-40 mx-auto">
            <div className="flex flex-col justify-between pl-6 pb-6 pt-6 pr-6 sm:pr-0 md:w-1/2">
              <div className="flex gap-1">
                <div className="bg-red-600 w-3 h-3 rounded-full"></div>
                <div className="bg-yellow-600 w-3 h-3 rounded-full"></div>
                <div className="bg-green-600 w-3 h-3 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-[3rem] leading-[1.2] font-semibold text-black dark:text-white pt-6 md:pt-0">
                  Ready to start making your resume?
                </h1>
                <p className="text-gray-500 mt-4 mr-6">
                  Don't let your resume hold you back from getting the job you want. Our builder software helps you create a resume that highlights your qualifications and lands you more interviews.
                </p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Link href={buildResumeUrl} className="z-10 w-48">
                  <Button className="border px-6 py-6 text-md">
                    Build your resume
                  </Button>
                  <p className="text-gray-500 text-xs pt-2 text-center">Choose from 7 templares</p>
                </Link>
                <Link href={uploadResumeUrl} className="z-10 w-48">
                  <Button variant="secondary" className="border px-6 py-6 text-md">
                    Upload existing
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 md:h-[480px] rounded-lg overflow-hidden">
              <div className="top-0 left-0 grid grid-cols-3 grid-rows-2 gap-4 p-4">
                <div className="relative">
                  <img
                    src="/assets/images/vibes.png"
                    alt="Step 1"
                    className="md:w-[min(200px,20vw)] aspect-[3/4] object-cover rounded-xl shadow-lg border-2 p-1 bg-purple-400 transform md:translate-y-32"
                  />
                </div>
                <div className="relative">
                  <img
                    src="/assets/images/frank.png"
                    alt="Step 2"
                    className="md:w-[min(200px,20vw)] aspect-[3/4] object-cover rounded-lg shadow-lg border-2 p-1 bg-purple-400 transform md:translate-y-16"
                  />
                </div>
                <div className="relative">
                  <img
                    src="/assets/images/chikorita.jpg"
                    alt="Step 3"
                    className="md:w-[min(200px,20vw)] aspect-[3/4] object-cover rounded-lg shadow-lg border-2 p-1 bg-purple-400 transform md:translate-y-4"
                  />
                </div>
                <div className="relative">
                  <img
                    src="/assets/images/two-column.png"
                    alt="Step 4"
                    className="md:w-[min(200px,20vw)] aspect-[3/4] object-cover rounded-lg shadow-lg border-2 p-1 bg-purple-400 transform md:translate-y-32"
                  />
                </div>
                <div className="relative">
                  <img
                    src="/assets/images/vibes.png"
                    alt="Step 5"
                    className="md:w-[min(200px,20vw)] aspect-[3/4] object-cover rounded-lg shadow-lg border-2 p-1 bg-purple-400 transform md:translate-y-16"
                  />
                </div>
                <div className="relative">
                  <img
                    src="/assets/images/free.png"
                    alt="Step 6"
                    className="md:w-[min(200px,20vw)] aspect-[3/4] object-cover rounded-lg shadow-lg border-2 p-1 bg-purple-400 transform md:translate-y-4"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />
      <footer className="max-w-7xl mx-auto py-8">
        <div>
          <Link href="/resumes" className="flex items-center gap-2">
            <p className="text-sm text-bold text-black dark:text-white">Resume Builder</p>
          </Link>
          <p className="text-xs text-black dark:text-white">
            A free tool by <span className="text-primary text-bold text-md">
              <a href='https://usmansiddique.dev' target="_blank">Usman</a>
            </span>
          </p>
        </div>
      </footer>
    </main>
  );
} 