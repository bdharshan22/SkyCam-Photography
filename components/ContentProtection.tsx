import React, { useEffect, useCallback } from 'react';

/**
 * ContentProtection — Prevents screenshots, right-click, image saving,
 * keyboard shortcuts, and dev tools on both PC and mobile.
 */
const ContentProtection: React.FC = () => {

  // Blank the screen briefly when screenshot attempt is detected
  const flashScreen = useCallback(() => {
    const overlay = document.getElementById('screenshot-shield');
    if (overlay) {
      overlay.style.display = 'block';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 1500);
    }
  }, []);

  useEffect(() => {
    // ==========================================
    // 1. DISABLE RIGHT-CLICK
    // ==========================================
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // ==========================================
    // 2. DISABLE KEYBOARD SHORTCUTS
    // ==========================================
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        flashScreen();
        // Clear clipboard
        navigator.clipboard?.writeText('').catch(() => {});
        return false;
      }

      // Ctrl + S (Save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }

      // Ctrl + P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        return false;
      }

      // Ctrl + U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }

      // Ctrl + Shift + I (Dev Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }

      // Ctrl + Shift + J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }

      // Ctrl + Shift + C (Element Inspector)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }

      // F12 (Dev Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Ctrl + A (Select All)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        return false;
      }

      // Ctrl + C (Copy)
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        return false;
      }

      // Windows + Shift + S (Windows Snipping Tool)
      if (e.metaKey && e.shiftKey && e.key === 's') {
        e.preventDefault();
        flashScreen();
        return false;
      }

      // Cmd + Shift + 3/4/5 (Mac screenshots)
      if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        flashScreen();
        return false;
      }
    };

    // ==========================================
    // 3. DISABLE DRAG ON ALL IMAGES
    // ==========================================
    const handleDragStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // ==========================================
    // 4. DETECT VISIBILITY CHANGE (tab switch for screenshot tools)
    // ==========================================
    const handleVisibilityChange = () => {
      if (document.hidden) {
        flashScreen();
      }
    };

    // ==========================================
    // 5. PREVENT TOUCH LONG-PRESS (Mobile save image)
    // ==========================================
    let touchTimer: ReturnType<typeof setTimeout>;
    let longPressActive = false;
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('img')) {
        longPressActive = false;
        touchTimer = setTimeout(() => {
          longPressActive = true;
        }, 500);
        // Prevent default immediately if we detect it's a long-press on next move
      }
    };

    const handleTouchMove = () => {
      if (longPressActive) longPressActive = false;
      clearTimeout(touchTimer);
    };

    const handleTouchEnd = () => {
      clearTimeout(touchTimer);
      longPressActive = false;
    };

    // ==========================================
    // 6. DISABLE COPY EVENT
    // ==========================================
    const handleCopy = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // ==========================================
    // 7. ADD CSS PROTECTION TO ALL IMAGES
    // ==========================================
    const protectImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        img.setAttribute('draggable', 'false');
        img.style.pointerEvents = 'none';
        img.style.userSelect = 'none';
        img.style.webkitUserSelect = 'none';
        // Wrap images in a protective container if not already
        const parent = img.parentElement;
        if (parent && !parent.classList.contains('img-protected')) {
          parent.style.position = 'relative';
          parent.classList.add('img-protected');
        }
      });
    };

    // Initial image protection
    protectImages();

    // Observe DOM for new images
    const observer = new MutationObserver(() => {
      protectImages();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ==========================================
    // ATTACH ALL LISTENERS
    // ==========================================
    const handleKeyUp = (e: KeyboardEvent) => {
      // Catch PrintScreen on keyup (some browsers fire it here)
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        navigator.clipboard?.writeText('').catch(() => {});
        flashScreen();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('copy', handleCopy);

    // ==========================================
    // CLEANUP
    // ==========================================
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('copy', handleCopy);
      observer.disconnect();
    };
  }, [flashScreen]);

  return null; // This component renders nothing — it's purely behavioral
};

export default ContentProtection;
