
import { supabase } from "@/integrations/supabase/client";

// Generate or get session ID from localStorage
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('gpa_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('gpa_session_id', sessionId);
  }
  return sessionId;
};

// Get device type
export const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
};

// Check if returning user
export const isReturningUser = (): boolean => {
  return localStorage.getItem('gpa_visited') === 'true';
};

// Mark as visited
export const markAsVisited = (): void => {
  localStorage.setItem('gpa_visited', 'true');
};

// Track analytics
export const trackAnalytics = async (data: {
  gpaCalculated?: number;
  subjectsCount?: number;
}) => {
  const sessionId = getSessionId();
  const deviceType = getDeviceType();
  const returning = isReturningUser();
  
  try {
    // Get current calculation count
    const { data: existing } = await supabase
      .from('user_analytics')
      .select('calculation_count')
      .eq('session_id', sessionId)
      .single();

    const calculationCount = (existing?.calculation_count || 0) + (data.gpaCalculated ? 1 : 0);

    await supabase
      .from('user_analytics')
      .upsert({
        session_id: sessionId,
        device_type: deviceType,
        user_agent: navigator.userAgent,
        is_returning_user: returning,
        calculation_count: calculationCount,
        gpa_calculated: data.gpaCalculated,
        subjects_count: data.subjectsCount,
      }, {
        onConflict: 'session_id'
      });

    if (!returning) {
      markAsVisited();
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};
