import { Route, Switch, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AIBarista } from '@/components/AIBarista';

// Pages
import Home from '@/pages/Home';
import Explore from '@/pages/Explore';
import CoffeeDetail from '@/pages/CoffeeDetail';

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/explore" component={Explore} />
          <Route path="/coffee/:id" component={CoffeeDetail} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <AIBarista />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </ThemeProvider>
  );
}

export default App;
