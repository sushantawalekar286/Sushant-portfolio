import Visitor from '../models/Visitor.js';
import Analytics from '../models/Analytics.js';

const visitorTracker = async (req, res, next) => {
  // Only track GET requests for main entry APIs to avoid overcounting (like fetches on config assets)
  const isTargetEndpoint = req.method === 'GET' && 
    (req.path === '/settings/hero' || req.path === '/hero');
  
  if (isTargetEndpoint) {
    try {
      // Extract IP address (handles proxies)
      const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || 
                 req.socket.remoteAddress || 
                 req.ip;
                 
      // Increment global unique visitors
      await Visitor.trackVisitor(ip);
      
      // Increment daily view analytics for the Home landing page
      await Analytics.logView('Home', ip);
    } catch (error) {
      console.error('Error in visitor tracking middleware:', error);
      // Fail silently to keep application running
    }
  }
  next();
};

export default visitorTracker;
