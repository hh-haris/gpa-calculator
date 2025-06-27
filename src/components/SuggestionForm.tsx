
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown, Plus, ArrowLeft } from 'lucide-react';
import { GridBackground } from '@/components/GridBackground';
import { StickyBanner } from '@/components/ui/sticky-banner';
import { AppSidebar, SidebarTrigger } from '@/components/AppSidebar';
import { useNavigate } from 'react-router-dom';

interface Suggestion {
  id: string;
  suggestion: string;
  votes: number;
  userVote?: 'up' | 'down';
}

const SuggestionForm = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    suggestion: ''
  });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      suggestion: 'Add a feature to compare GPAs between different semesters',
      votes: 12
    },
    {
      id: '2',
      suggestion: 'Include a grade predictor tool for upcoming exams',
      votes: 8
    },
    {
      id: '3',
      suggestion: 'Create a study group finder based on courses',
      votes: 15
    },
    {
      id: '4',
      suggestion: 'Add notification system for important academic dates',
      votes: 6
    }
  ]);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.suggestion) {
      return;
    }

    const newSuggestion: Suggestion = {
      id: Date.now().toString(),
      suggestion: formData.suggestion,
      votes: 0
    };

    setSuggestions([newSuggestion, ...suggestions]);
    setFormData({ name: '', suggestion: '' });
    setShowForm(false);
  };

  const handleVote = (suggestionId: string, voteType: 'up' | 'down') => {
    setSuggestions(suggestions.map(suggestion => {
      if (suggestion.id === suggestionId) {
        let newVotes = suggestion.votes;
        
        // Remove previous vote if exists
        if (suggestion.userVote === 'up') {
          newVotes--;
        } else if (suggestion.userVote === 'down') {
          newVotes++;
        }
        
        // Apply new vote if different from previous
        if (suggestion.userVote !== voteType) {
          if (voteType === 'up') {
            newVotes++;
          } else {
            newVotes--;
          }
          return { ...suggestion, votes: newVotes, userVote: voteType };
        } else {
          return { ...suggestion, votes: newVotes, userVote: undefined };
        }
      }
      return suggestion;
    }));
  };

  return (
    <div className="min-h-screen bg-white font-inter relative">
      <GridBackground />
      
      <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <SidebarTrigger onClick={() => setSidebarOpen(true)} />
      
      <StickyBanner className="bg-gradient-to-r from-[#0088CC] to-[#0077BB]">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md font-inter text-xs sm:text-sm">
          Share your ideas and vote on suggestions from your classmates! 🗳️
        </p>
      </StickyBanner>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Button
            onClick={() => navigate('/suggest')}
            variant="ghost"
            className="mb-4 text-[#0088CC] hover:bg-[#EEEEEE]"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Verification
          </Button>
          
          <h1 className="text-2xl font-bold text-[#000000] font-jakarta mb-2 flex items-center justify-center gap-2">
            <MessageSquare className="text-[#0088CC]" size={24} />
            Suggestion Board
          </h1>
          <p className="text-[#979797] font-inter text-sm mb-6">
            Classmates, submit your suggestions to make next semester fun! Share ideas about what we can create for all of you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter w-full sm:w-auto"
          >
            <Plus size={16} className="mr-2" />
            Submit New Suggestion
          </Button>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="border-2 border-[#0088CC]">
              <CardHeader>
                <CardTitle className="text-lg font-jakarta text-[#0088CC]">
                  Submit Your Suggestion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="text-sm font-inter text-[#000000]">
                      Your Name *
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your name"
                      required
                      className="border-[#979797] focus:border-[#0088CC]"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-inter text-[#000000]">
                      Your Suggestion *
                    </Label>
                    <Textarea
                      value={formData.suggestion}
                      onChange={(e) => setFormData({...formData, suggestion: e.target.value})}
                      placeholder="Share your idea for making next semester more fun and engaging..."
                      required
                      className="border-[#979797] focus:border-[#0088CC] h-24"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter"
                    >
                      Submit Suggestion
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="border-[#979797] text-[#979797] hover:bg-[#EEEEEE]"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#000000] font-jakarta">
            Community Suggestions
          </h2>
          
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 border-[#EEEEEE] hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <p className="text-[#000000] font-inter text-sm mb-3">
                    {suggestion.suggestion}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(suggestion.id, 'up')}
                        className={`flex items-center gap-1 text-xs ${
                          suggestion.userVote === 'up' ? 'bg-green-100 text-green-600' : 'text-[#979797]'
                        }`}
                      >
                        <ThumbsUp size={14} />
                        Vote Up
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(suggestion.id, 'down')}
                        className={`flex items-center gap-1 text-xs ${
                          suggestion.userVote === 'down' ? 'bg-red-100 text-red-600' : 'text-[#979797]'
                        }`}
                      >
                        <ThumbsDown size={14} />
                        Vote Down
                      </Button>
                    </div>
                    
                    <Badge variant={suggestion.votes >= 0 ? 'default' : 'destructive'}>
                      {suggestion.votes} votes
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestionForm;
