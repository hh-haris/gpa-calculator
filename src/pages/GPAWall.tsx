
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Trophy, Plus } from 'lucide-react';
import { GridBackground } from '@/components/GridBackground';
import { AppSidebar, SidebarTrigger } from '@/components/AppSidebar';
import { fetchGPAPosts, fetchGPAReactions, toggleGPAReaction, createGPAPost } from '@/utils/supabaseHelpers';
import { getSessionId } from '@/utils/analytics';
import PublishGPAModal from '@/components/PublishGPAModal';
import BackButton from '@/components/BackButton';

interface GPAPost {
  id: string;
  name?: string;
  class: string;
  section: string;
  semester: string;
  message?: string;
  gpa: number;
  type: 'GPA' | 'CGPA';
  reactions?: {
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
  const [posts, setPosts] = useState<GPAPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const postsData = await fetchGPAPosts();
      const postsWithReactions = await Promise.all(
        postsData.map(async (post) => {
          const reactions = await fetchGPAReactions(post.id);
          return { ...post, reactions };
        })
      );
      setPosts(postsWithReactions);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (postId: string, reaction: 'clap' | 'fire' | 'laugh' | 'cry') => {
    try {
      await toggleGPAReaction(postId, reaction);
      await loadPosts(); // Reload to get updated reactions
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const handlePublish = async (newPost: Omit<GPAPost, 'id' | 'reactions' | 'userReaction'>) => {
    try {
      await createGPAPost(newPost);
      await loadPosts(); // Reload posts
      setPublishModalOpen(false);
    } catch (error) {
      console.error('Error publishing post:', error);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-inter relative flex items-center justify-center">
        <GridBackground />
        <div className="text-[#0088CC]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-inter relative">
      <GridBackground />
      
      <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <SidebarTrigger onClick={() => setSidebarOpen(true)} />

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <BackButton />
        
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
                        className="flex items-center gap-1 text-xs hover:bg-[#EEEEEE]"
                      >
                        <span>{getReactionIcon(reaction)}</span>
                        <span>{post.reactions?.[reaction] || 0}</span>
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
