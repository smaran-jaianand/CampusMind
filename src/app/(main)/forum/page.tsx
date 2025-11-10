
'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, PlusCircle } from 'lucide-react';

const forumPosts = [
  {
    id: 1,
    author: 'StudentStruggler',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    title: 'Feeling overwhelmed with exam prep',
    content: "Exams are just around the corner and I feel like I can't keep up. Any tips for managing stress and staying focused?",
    likes: 12,
    comments: 5,
    time: '2 hours ago',
  },
  {
    id: 2,
    author: 'CampusExplorer',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    title: 'Tips for making new friends on campus?',
    content: "I'm a new student and finding it hard to connect with people. What are some good ways to make friends here?",
    likes: 25,
    comments: 10,
    time: '1 day ago',
  },
  {
    id: 3,
    author: 'ZenMaster',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    title: 'My favorite quiet spots on campus for de-stressing',
    content: 'Just wanted to share a few places I go to when I need a break from the noise. The campus garden and the top floor of the library are my go-tos. Where do you all go?',
    likes: 30,
    comments: 8,
    time: '3 days ago',
  },
];

export default function ForumPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Community Forum</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        {forumPosts.map((post) => (
          <Card key={post.id} className="w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.avatar} alt={post.author} />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="mb-2 text-lg font-bold">{post.title}</h2>
              <p className="text-sm text-muted-foreground">{post.content}</p>
            </CardContent>
            <CardFooter className="flex items-center gap-4 border-t px-6 py-3">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments} Comments</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
