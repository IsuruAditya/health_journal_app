import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Smartphone } from 'lucide-react';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ThemeToggle';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Health Journal
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track your health journey with medical-grade assessment tools and AI-powered insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">Health Tracking</h3>
            <p className="text-muted-foreground">
              Monitor symptoms, medications, and wellness metrics
            </p>
          </div>
          <div className="text-center p-6">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your health data is encrypted and completely private
            </p>
          </div>
          <div className="text-center p-6">
            <Smartphone className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">Mobile Ready</h3>
            <p className="text-muted-foreground">
              Install as an app on any device for offline access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;