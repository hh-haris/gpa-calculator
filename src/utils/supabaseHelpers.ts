
import { supabase } from "@/integrations/supabase/client";
import { getSessionId, getDeviceType } from "./analytics";

// GPA Posts
export const fetchGPAPosts = async () => {
  const { data, error } = await supabase
    .from('gpa_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createGPAPost = async (postData: {
  name?: string;
  class: string;
  section: string;
  semester: string;
  message?: string;
  gpa: number;
  type: 'GPA' | 'CGPA';
}) => {
  const { data, error } = await supabase
    .from('gpa_posts')
    .insert({
      ...postData,
      session_id: getSessionId(),
      device_info: {
        device_type: getDeviceType(),
        user_agent: navigator.userAgent
      }
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const fetchGPAReactions = async (postId: string) => {
  const { data, error } = await supabase
    .from('gpa_reactions')
    .select('reaction_type')
    .eq('post_id', postId);
  
  if (error) throw error;
  
  const reactions = { clap: 0, fire: 0, laugh: 0, cry: 0 };
  data.forEach(reaction => {
    reactions[reaction.reaction_type as keyof typeof reactions]++;
  });
  
  return reactions;
};

export const toggleGPAReaction = async (postId: string, reactionType: string) => {
  const sessionId = getSessionId();
  
  // Check if user already reacted
  const { data: existing } = await supabase
    .from('gpa_reactions')
    .select('*')
    .eq('post_id', postId)
    .eq('session_id', sessionId)
    .single();
  
  if (existing) {
    if (existing.reaction_type === reactionType) {
      // Remove reaction
      await supabase
        .from('gpa_reactions')
        .delete()
        .eq('id', existing.id);
    } else {
      // Update reaction
      await supabase
        .from('gpa_reactions')
        .update({ reaction_type: reactionType })
        .eq('id', existing.id);
    }
  } else {
    // Add new reaction
    await supabase
      .from('gpa_reactions')
      .insert({
        post_id: postId,
        session_id: sessionId,
        reaction_type: reactionType
      });
  }
};

// Suggestions
export const fetchSuggestions = async () => {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createSuggestion = async (suggestionData: {
  name: string;
  suggestion: string;
  additional_info?: string;
}) => {
  const { data, error } = await supabase
    .from('suggestions')
    .insert({
      ...suggestionData,
      session_id: getSessionId(),
      device_info: {
        device_type: getDeviceType(),
        user_agent: navigator.userAgent
      }
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const fetchSuggestionVotes = async (suggestionId: string) => {
  const { data, error } = await supabase
    .from('suggestion_votes')
    .select('vote_type')
    .eq('suggestion_id', suggestionId);
  
  if (error) throw error;
  
  let upVotes = 0;
  let downVotes = 0;
  data.forEach(vote => {
    if (vote.vote_type === 'up') upVotes++;
    else downVotes++;
  });
  
  return upVotes - downVotes;
};

export const toggleSuggestionVote = async (suggestionId: string, voteType: 'up' | 'down') => {
  const sessionId = getSessionId();
  
  // Check if user already voted
  const { data: existing } = await supabase
    .from('suggestion_votes')
    .select('*')
    .eq('suggestion_id', suggestionId)
    .eq('session_id', sessionId)
    .single();
  
  if (existing) {
    if (existing.vote_type === voteType) {
      // Remove vote
      await supabase
        .from('suggestion_votes')
        .delete()
        .eq('id', existing.id);
    } else {
      // Update vote
      await supabase
        .from('suggestion_votes')
        .update({ vote_type: voteType })
        .eq('id', existing.id);
    }
  } else {
    // Add new vote
    await supabase
      .from('suggestion_votes')
      .insert({
        suggestion_id: suggestionId,
        session_id: sessionId,
        vote_type: voteType
      });
  }
};
