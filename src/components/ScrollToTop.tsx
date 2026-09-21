import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * ScrollToTop ensures that whenever the URL path or search parameters change,
 * the window instantly scrolls to the top of the page.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Instant scroll to top on route navigation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [pathname, search]);

  return null;
}
