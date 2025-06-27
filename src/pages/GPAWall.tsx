
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Trophy, Plus, Heart, Flame, Laugh, Frown } from 'lucide-react';
import { GridBackground } from '@/components/GridBackground';
import { StickyBanner } from '@/components/ui/sticky-banner';
import { AppSidebar, SidebarTrigger } from '@/components/AppSidebar';
import PublishGPAModal from '@/components/PublishGPAModal';

interface GPAPost {
  id: string;
  name?: string;
  class: string;
  section: string;
  semester: string;
  message?: string;
  gpa: number;
  type: 'GPA' | 'CGPA';
  reactions: {
    clap: number;
    fire: number;
    laugh: number;
    cry: number;
  };
  userReaction?: 'clap' | 'fire' | 'laugh' | 'cry';
}

const GPAWall = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [posts, setPosts] = useState<GPAPost[]>([
    {
      id: '1',
      name: 'Ahmed Ali',
      class: 'AI',
      section: 'A',
      semester: '3rd',
      message: 'Finally achieved my target GPA! Hard work pays off 🎉',
      gpa: 3.8,
      type: 'GPA',
      reactions: { clap: 15, fire: 8, laugh: 2, cry: 0 }
    },
    {
      id: '2',
      class: 'AI',
      section: 'B',
      semester: '5th',
      message: 'Struggled this semester but managed to maintain my CGPA',
      gpa: 3.2,
      type: 'CGPA',
      reactions: { clap: 5, fire: 3, laugh: 0, cry: 1 }
    },
    {
      id: '3',
      name: 'Sara Khan',
      class: 'AI',
      section: 'A',
      semester: '1st',
      gpa: 3.9,
      type: 'GPA',
      reactions: { clap: 22, fire: 12, laugh: 1, cry: 0 }
    }
  ]);

  const handleReaction = (postId: string, reaction: 'clap' | 'fire' | 'laugh' | 'cry') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newReactions = { ...post.reactions };
        
        // Remove previous reaction if exists
        if (post.userReaction) {
          newReactions[post.userReaction]--;
        }
        
        // Add new reaction if different from previous
        if (post.userReaction !== reaction) {
          newReactions[reaction]++;
          return { ...post, reactions: newReactions, userReaction: reaction };
        } else {
          return { ...post, reactions: newReactions, userReaction: undefined };
        }
      }
      return post;
    }));
  };

  const handlePublish = (newPost: Omit<GPAPost, 'id' | 'reactions' | 'userReaction'>) => {
    const post: GPAPost = {
      ...newPost,
      id: Date.now().toString(),
      reactions: { clap: 0, fire: 0, laugh: 0, cry: 0 }
    };
    setPosts([post, ...posts]);
    setPublishModalOpen(false);
  };

  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'clap': return '👏';
      case 'fire': return '🔥';
      case 'laugh': return '😂';
      case 'cry': return '😢';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter relative">
      <GridBackground />
      
      <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <SidebarTrigger onClick={() => setSidebarOpen(true)} />
      
      <StickyBanner className="bg-gradient-to-r from-[#0088CC] to-[#0077BB]">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md font-inter text-xs sm:text-sm">
          Share your GPA achievements with your classmates! 🎓
        </p>
      </StickyBanner>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-[#000000] font-jakarta mb-2 flex items-center justify-center gap-2">
            <Trophy className="text-[#0088CC]" size={24} />
            GPA Wall
          </h1>
          <p className="text-[#979797] font-inter text-sm">
            Celebrate academic achievements with your peers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => setPublishModalOpen(true)}
            className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter w-full sm:w-auto"
          >
            <Plus size={16} className="mr-2" />
            Publish Your GPA
          </Button>
        </motion.div>

        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 border-[#EEEEEE] hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-jakarta flex items-center gap-2">
                        {post.name || 'Anonymous'}
                        <Badge variant="secondary" className="text-xs">
                          {post.class} - {post.section}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-[#979797] font-inter">
                        {post.semester} Semester
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#0088CC] font-jakarta">
                        {post.gpa.toFixed(2)}
                      </div>
                      <div className="text-xs text-[#979797]">{post.type}</div>
                    </div>
                  </div>
                </CardHeader>
                {post.message && (
                  <CardContent className="pt-0 pb-3">
                    <p className="text-[#000000] font-inter text-sm">
                      {post.message}
                    </p>
                  </CardContent>
                )}
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(['clap', 'fire', 'laugh', 'cry'] as const).map((reaction) => (
                      <Button
                        key={reaction}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction(post.id, reaction)}
                        className={`flex items-center gap-1 text-xs ${
                          post.userReaction === reaction ? 'bg-[#EEEEEE]' : ''
                        }`}
                      >
                        <span>{getReactionIcon(reaction)}</span>
                        <span>{post.reactions[reaction]}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <PublishGPAModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onPublish={handlePublish}
      />
    </div>
  );
};

export default GPAWall;
