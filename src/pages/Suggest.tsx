import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown, Plus } from 'lucide-react';
import { GridBackground } from '@/components/GridBackground';
import { AppSidebar, SidebarTrigger } from '@/components/AppSidebar';
import SpinningText from '@/components/SpinningText';
import { fetchSuggestions, fetchSuggestionVotes, toggleSuggestionVote, createSuggestion } from '@/utils/supabaseHelpers';
import BackButton from '@/components/BackButton';

interface Suggestion {
  id: string;
  name: string;
  suggestion: string;
  additional_info?: string;
  votes?: number;
  userVote?: 'up' | 'down';
}

const Suggest = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    suggestion: '',
    additional_info: '',
    isVerifiedStudent: false
  });

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const suggestionsData = await fetchSuggestions();
      const suggestionsWithVotes = await Promise.all(
        suggestionsData.map(async (suggestion) => {
          const votes = await fetchSuggestionVotes(suggestion.id);
          return { ...suggestion, votes };
        })
      );
      setSuggestions(suggestionsWithVotes);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.suggestion || !formData.isVerifiedStudent) {
      alert('Please fill in all required fields and confirm you are a verified student');
      return;
    }

    try {
      await createSuggestion({
        name: formData.name,
        suggestion: formData.suggestion,
        additional_info: formData.additional_info
      });
      
      setFormData({ name: '', suggestion: '', additional_info: '', isVerifiedStudent: false });
      setShowForm(false);
      await loadSuggestions();
    } catch (error) {
      console.error('Error creating suggestion:', error);
    }
  };

  const handleVote = async (suggestionId: string, voteType: 'up' | 'down') => {
    try {
      await toggleSuggestionVote(suggestionId, voteType);
      await loadSuggestions();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-inter relative flex items-center justify-center">
        <GridBackground />
        <SpinningText />
        <div className="text-[#0088CC]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-inter relative">
      <GridBackground />
      <SpinningText />
      
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
            <MessageSquare className="text-[#0088CC]" size={24} />
            Suggestion Board
          </h1>
          <p className="text-[#979797] font-inter text-sm mb-6">
            Share your ideas to make our platform better! Submit suggestions and vote on others.
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
                      Your Real Name * <span className="text-xs text-[#979797]">(Without real name, suggestions won't be considered)</span>
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full real name"
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
                      placeholder="Share your idea to improve our platform..."
                      required
                      className="border-[#979797] focus:border-[#0088CC] h-24"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-inter text-[#000000]">
                      Additional Information (Optional)
                    </Label>
                    <Textarea
                      value={formData.additional_info}
                      onChange={(e) => setFormData({...formData, additional_info: e.target.value})}
                      placeholder="Any additional details about your suggestion..."
                      className="border-[#979797] focus:border-[#0088CC] h-20"
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="student-verification"
                      checked={formData.isVerifiedStudent}
                      onCheckedChange={(checked) => setFormData({...formData, isVerifiedStudent: checked as boolean})}
                      className="mt-1"
                    />
                    <label htmlFor="student-verification" className="text-sm font-inter text-[#000000] leading-relaxed">
                      I am a student of <strong>2024 Batch AI Section A & B</strong> *
                    </label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={!formData.isVerifiedStudent}
                      className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter disabled:opacity-50"
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
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-jakarta text-[#0088CC]">
                      {suggestion.name}
                    </CardTitle>
                    <Badge variant={suggestion.votes && suggestion.votes >= 0 ? 'default' : 'destructive'} className="bg-[#0088CC]">
                      {suggestion.votes || 0} votes
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-[#000000] font-inter text-sm mb-3">
                    {suggestion.suggestion}
                  </p>
                  
                  {suggestion.additional_info && (
                    <p className="text-[#979797] font-inter text-xs mb-3 italic">
                      Additional info: {suggestion.additional_info}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(suggestion.id, 'up')}
                      className="flex items-center gap-1 text-xs text-green-600 hover:bg-green-50"
                    >
                      <ThumbsUp size={14} />
                      Vote Up
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(suggestion.id, 'down')}
                      className="flex items-center gap-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      <ThumbsDown size={14} />
                      Vote Down
                    </Button>
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

export default Suggest;