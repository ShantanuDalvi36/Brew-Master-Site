import { useState, useCallback } from 'react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import NotFound from '@/pages/not-found';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AIBarista } from '@/components/AIBarista';
import { LoadingScreen } from '@/components/LoadingScreen';

import Home from '@/pages/Home';
import Explore from '@/pages/Explore';
import CoffeeDetail from '@/pages/CoffeeDetail';
import Journal from '@/pages/Journal';
import Atlas from '@/pages/Atlas';
import AtlasCountry from '@/pages/AtlasCountry';
import Passport from '@/pages/Passport';
import Customize from '@/pages/Customize';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import OrderTracking from '@/pages/OrderTracking';
import Orders from '@/pages/Orders';
import Profile from '@/pages/Profile';
import Favorites from '@/pages/Favorites';
import TableOrderEntry from '@/pages/TableOrderEntry';
import StaffOrders from '@/pages/StaffOrders';

// Luxury easing — used for every transition
const EASE = [0.22, 1, 0.36, 1] as const;

function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
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
            <Route path="/coffee/:id/customize" component={Customize} />
            <Route path="/coffee/:id" component={CoffeeDetail} />
            <Route path="/journal" component={Journal} />
            <Route path="/atlas" component={Atlas} />
            <Route path="/atlas/:country" component={AtlasCountry} />
            <Route path="/passport" component={Passport} />
            <Route path="/order" component={TableOrderEntry} />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/order/:id/confirmation" component={OrderConfirmation} />
            <Route path="/order/:id/tracking" component={OrderTracking} />
            <Route path="/orders" component={Orders} />
            <Route path="/profile" component={Profile} />
            <Route path="/favorites" component={Favorites} />
            <Route path="/staff/orders" component={StaffOrders} />
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

      {/* App renders underneath so it's ready the moment the loader exits */}
      <div style={{ visibility: loaded ? 'visible' : 'hidden' }}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
