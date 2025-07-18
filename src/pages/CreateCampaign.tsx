import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateCampaign = () => {
  const [name, setName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !user) {
      console.log('Submit prevented - User:', user);
      console.log('Submit prevented - Token:', localStorage.getItem('auth_token'));
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to create a campaign.',
          variant: 'destructive',
        });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting campaign:', { name, job_description: jobDescription });
      const response = await apiClient.createCampaign({
        name,
        job_description: jobDescription,
      });
      console.log('Campaign response:', response.data);

      toast({
        title: 'Campaign created successfully',
        description: 'You can now upload candidates and start the campaign.',
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Campaign creation error:', error.response?.data || error);
      toast({
        title: 'Failed to create campaign',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Campaign</h1>
          <p className="text-muted-foreground">Set up a new interview screening campaign</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Campaign Details
          </CardTitle>
          <CardDescription>
            Provide the basic information for your interview screening campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g. Software Engineer Screening Q4 2024"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description *</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the complete job description here. This will be used by AI to generate relevant interview questions..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
                disabled={isSubmitting}
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                The AI will analyze this job description to automatically generate targeted interview questions.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !name.trim() || !jobDescription.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Campaign...
                  </>
                ) : (
                  'Create Campaign'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCampaign;