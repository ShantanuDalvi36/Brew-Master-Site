import { useState, useCallback } from 'react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import NotFound from '@/pages/not-found';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AIBarista } from '@/components/AIBarista';
import { LoadingScreen } from '@/components/LoadingScreen';

// Pages
import Home from '@/pages/Home';
import Explore from '@/pages/Explore';
import CoffeeDetail from '@/pages/CoffeeDetail';

const ease = [0.22, 1, 0.36, 1] as const;

function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageTransitionWrapper>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/explore" component={Explore} />
            <Route path="/coffee/:id" component={CoffeeDetail} />
            <Route component={NotFound} />
          </Switch>
        </PageTransitionWrapper>
      </main>
      <Footer />
      <AIBarista />
    </div>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const handleLoadComplete = useCallback(() => setLoaded(true), []);

  return (
    <ThemeProvider defaultTheme="light">
      <AnimatePresence>
        {!loaded && <LoadingScreen key="loader" onComplete={handleLoadComplete} />}
      </AnimatePresence>

      {/* Render app underneath so it's ready when loader exits */}
      <div style={{ visibility: loaded ? 'visible' : 'hidden' }}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
