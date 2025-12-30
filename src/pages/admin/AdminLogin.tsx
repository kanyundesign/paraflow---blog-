import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCMSAuth } from '@/contexts/CMSAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, User, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const { user, login, signup, isLoading } = useCMSAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Email and password are required.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLoginMode) {
        const result = await login(email, password);
        if (result.success) {
          toast({
            title: 'Login Successful',
            description: 'Welcome back!',
          });
          navigate('/admin');
        } else {
          toast({
            title: 'Login Failed',
            description: result.error || 'Invalid email or password.',
            variant: 'destructive',
          });
        }
      } else {
        const result = await signup(email, password, displayName);
        if (result.success) {
          toast({
            title: 'Registration Successful',
            description: 'Account created. Please contact an admin to assign your role.',
          });
          setIsLoginMode(true);
          setEmail('');
          setPassword('');
          setDisplayName('');
        } else {
          toast({
            title: 'Registration Failed',
            description: result.error || 'An error occurred during registration.',
            variant: 'destructive',
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <span className="text-primary font-bold text-3xl">Paraflow</span>
            <span className="text-muted-foreground text-lg ml-2">CMS</span>
          </div>
          <CardTitle className="text-foreground">
            {isLoginMode ? 'Admin Login' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLoginMode 
              ? 'Enter your credentials to access the admin panel' 
              : 'Register and wait for admin to assign your role'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-foreground">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border-border"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-background border-border"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLoginMode ? 'Logging in...' : 'Registering...'}
                </>
              ) : (
                isLoginMode ? 'Log In' : 'Sign Up'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setEmail('');
                setPassword('');
                setDisplayName('');
              }}
              className="text-sm text-primary hover:underline"
            >
              {isLoginMode ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>

          {!isLoginMode && (
            <p className="mt-4 text-xs text-muted-foreground text-center">
              After registration, an admin needs to assign your role in "User Management" to access the admin panel
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}