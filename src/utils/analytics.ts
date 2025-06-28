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
    console.log('Starting analytics tracking...', data);
    
    // Get current analytics data
    const { data: existing, error: fetchError } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing analytics:', fetchError);
    }

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

    // Update or insert main analytics record
    const { error: upsertError } = await supabase
      .from('user_analytics')
      .upsert(updateData, {
        onConflict: 'session_id'
      });

    if (upsertError) {
      console.error('Error upserting analytics:', upsertError);
      throw upsertError;
    }

    // Track PDF downloads as separate event
    if (data.pdfDownloaded) {
      const { error: pdfError } = await supabase
        .from('analytics_events')
        .insert({
          session_id: sessionId,
          event_type: 'pdf_download',
          event_data: {
            timestamp: new Date().toISOString(),
            gpa: existing?.gpa_calculated || data.gpaCalculated || null,
            subjects_count: data.subjectsCount || null
          },
          user_agent: navigator.userAgent,
          device_type: deviceType,
          ip_address: ipAddress
        });

      if (pdfError) {
        console.error('Error tracking PDF download:', pdfError);
      } else {
        console.log('PDF download tracked successfully');
      }
    }

    // Track WhatsApp shares as separate event with phone number
    if (data.whatsappShared) {
      const { error: whatsappError } = await supabase
        .from('analytics_events')
        .insert({
          session_id: sessionId,
          event_type: 'whatsapp_share',
          event_data: {
            timestamp: new Date().toISOString(),
            gpa: existing?.gpa_calculated || data.gpaCalculated || null,
            subjects_count: data.subjectsCount || null,
            whatsapp_number: data.whatsappNumber || null,
            shared_via: 'whatsapp_web'
          },
          user_agent: navigator.userAgent,
          device_type: deviceType,
          ip_address: ipAddress
        });

      if (whatsappError) {
        console.error('Error tracking WhatsApp share:', whatsappError);
      } else {
        console.log('WhatsApp share tracked successfully with number:', data.whatsappNumber);
      }
    }

    if (!returning) {
      markAsVisited();
    }

    console.log('Analytics tracked successfully:', {
      sessionId,
      deviceType,
      returning,
      calculationCount,
      gpa: data.gpaCalculated,
      subjects: data.subjectsCount,
      pdfDownload: data.pdfDownloaded,
      whatsappShare: data.whatsappShared,
      whatsappNumber: data.whatsappNumber,
      ipAddress
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    
    // Fallback: try to at least store basic session info
    try {
      const { error: fallbackError } = await supabase
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

      if (fallbackError) {
        console.error('Fallback analytics tracking also failed:', fallbackError);
      }
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
    
    const { error } = await supabase
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

    if (error) {
      console.error('Page visit tracking error:', error);
    } else {
      console.log('Page visit tracked successfully:', page);
    }

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

// Get WhatsApp sharing analytics
export const getWhatsAppAnalytics = async () => {
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', 'whatsapp_share')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(event => ({
      id: event.id,
      sessionId: event.session_id,
      timestamp: event.created_at,
      gpa: event.event_data?.gpa,
      whatsappNumber: event.event_data?.whatsapp_number,
      deviceType: event.device_type,
      ipAddress: event.ip_address
    }));
  } catch (error) {
    console.error('Error getting WhatsApp analytics:', error);
    return [];
  }
};