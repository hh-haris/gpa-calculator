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

// Get IP address (simplified - in production you'd use a service)
export const getIPAddress = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP address:', error);
    return null;
  }
};

// Enhanced analytics tracking with comprehensive data collection
export const trackAnalytics = async (data: {
  gpaCalculated?: number;
  subjectsCount?: number;
  pdfDownloaded?: boolean;
  whatsappShared?: boolean;
  whatsappNumber?: string;
}) => {
  const sessionId = getSessionId();
  const deviceType = getDeviceType();
  const returning = isReturningUser();
  
  try {
    // Get current analytics data
    const { data: existing } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    // Calculate updated counts
    const calculationCount = (existing?.calculation_count || 0) + (data.gpaCalculated ? 1 : 0);
    
    // Get IP address
    const ipAddress = await getIPAddress();

    // Prepare comprehensive update data
    const updateData: any = {
      session_id: sessionId,
      device_type: deviceType,
      user_agent: navigator.userAgent,
      is_returning_user: returning,
      calculation_count: calculationCount,
      ip_address: ipAddress,
      updated_at: new Date().toISOString()
    };

    // Add GPA calculation data
    if (data.gpaCalculated !== undefined) {
      updateData.gpa_calculated = data.gpaCalculated;
      updateData.subjects_count = data.subjectsCount;
    }

    // Track PDF downloads
    if (data.pdfDownloaded) {
      // Store PDF download event separately for detailed tracking
      await supabase
        .from('user_analytics')
        .insert({
          session_id: sessionId,
          device_type: deviceType,
          user_agent: navigator.userAgent,
          event_type: 'pdf_download',
          event_data: {
            timestamp: new Date().toISOString(),
            gpa: existing?.gpa_calculated || null
          }
        });
    }

    // Track WhatsApp shares
    if (data.whatsappShared) {
      // Store WhatsApp share event separately for detailed tracking
      await supabase
        .from('user_analytics')
        .insert({
          session_id: sessionId,
          device_type: deviceType,
          user_agent: navigator.userAgent,
          event_type: 'whatsapp_share',
          event_data: {
            timestamp: new Date().toISOString(),
            gpa: existing?.gpa_calculated || null,
            whatsapp_number: data.whatsappNumber || null
          }
        });
    }

    // Update or insert main analytics record
    await supabase
      .from('user_analytics')
      .upsert(updateData, {
        onConflict: 'session_id'
      });

    if (!returning) {
      markAsVisited();
    }

    console.log('Enhanced analytics tracked:', {
      sessionId,
      deviceType,
      returning,
      calculationCount,
      gpa: data.gpaCalculated,
      subjects: data.subjectsCount,
      pdfDownload: data.pdfDownloaded,
      whatsappShare: data.whatsappShared,
      ipAddress
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    
    // Fallback: try to at least store basic session info
    try {
      await supabase
        .from('user_analytics')
        .upsert({
          session_id: sessionId,
          device_type: deviceType,
          user_agent: navigator.userAgent,
          is_returning_user: returning,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'session_id'
        });
    } catch (fallbackError) {
      console.error('Fallback analytics tracking also failed:', fallbackError);
    }
  }
};

// Track page visit with enhanced data collection
export const trackPageVisit = async (page: string) => {
  const sessionId = getSessionId();
  const deviceType = getDeviceType();
  const returning = isReturningUser();
  
  try {
    const ipAddress = await getIPAddress();
    
    await supabase
      .from('user_analytics')
      .upsert({
        session_id: sessionId,
        device_type: deviceType,
        user_agent: navigator.userAgent,
        is_returning_user: returning,
        ip_address: ipAddress,
        page_visited: page,
        visit_timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'session_id'
      });

    if (!returning) {
      markAsVisited();
    }
  } catch (error) {
    console.error('Page visit tracking error:', error);
  }
};

// Get user analytics summary (for admin purposes)
export const getUserAnalyticsSummary = async () => {
  try {
    const { data, error } = await supabase
      .from('user_analytics')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      totalUsers: data.length,
      totalCalculations: data.reduce((sum, user) => sum + (user.calculation_count || 0), 0),
      deviceBreakdown: data.reduce((acc, user) => {
        acc[user.device_type || 'unknown'] = (acc[user.device_type || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      returningUsers: data.filter(user => user.is_returning_user).length,
      averageGPA: data.filter(user => user.gpa_calculated).reduce((sum, user, _, arr) => 
        sum + (user.gpa_calculated || 0) / arr.length, 0
      )
    };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return null;
  }
};