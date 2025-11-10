
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceHolderImages, ImagePlaceholder } from '@/lib/placeholder-images';
import { PlayCircle, Mic, BookOpen } from 'lucide-react';

const ResourceCard = ({ item }: { item: ImagePlaceholder }) => (
  <Card className="overflow-hidden transition-all hover:shadow-lg">
    <CardHeader className="p-0">
      <div className="relative h-48 w-full">
        <Image
          src={item.imageUrl}
          alt={item.description}
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint={item.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          {item.id.startsWith('video') && <PlayCircle className="h-8 w-8 text-white" />}
          {item.id.startsWith('audio') && <Mic className="h-8 w-8 text-white" />}
          {item.id.startsWith('guide') && <BookOpen className="h-8 w-8 text-white" />}
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <CardTitle className="text-base font-semibold">{item.description}</CardTitle>
    </CardContent>
  </Card>
);

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filterResources = (category: string) =>
    PlaceHolderImages.filter(
      (item) =>
        item.id.startsWith(category) &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const videos = filterResources('video');
  const audios = filterResources('audio');
  const guides = filterResources('guide');

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold md:text-2xl">Resources</h1>
        <p className="text-muted-foreground">
          Explore guided meditations, informative podcasts, and helpful articles.
        </p>
      </div>

      <div className="relative">
        <Input
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="audios">Audios</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="all">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filterResources('').map((item) => (
                <ResourceCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="videos">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((item) => (
                <ResourceCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="audios">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {audios.map((item) => (
                <ResourceCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="guides">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((item) => (
                <ResourceCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
