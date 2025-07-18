import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Plus, 
  Users, 
  Phone, 
  BarChart3, 
  FileText,
  Calendar,
  Loader2
} from 'lucide-react';

interface Campaign {
  id: number;
  name: string;
  job_description: string;
  status: 'created' | 'running' | 'completed';
  user_id: number;
  created_at: string;
  candidates_count: number;
  questions_count: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Initial fetch
    fetchCampaigns();

    // Set up polling
    const intervalId = setInterval(fetchCampaigns, 10000); // Poll every 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [location]);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching campaigns from /api/campaigns...');
      const response = await apiClient.getCampaigns();
      console.log('Campaigns response:', response.data);
      setCampaigns(response.data.campaigns || []);
    } catch (error: any) {
      console.error('Failed to fetch campaigns:', error.response?.data || error);
      toast({
        title: 'Error fetching campaigns',
        description: error.response?.data?.message || 'Failed to load campaigns. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500 text-white';
      case 'completed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Interview Screener</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.username || user?.email || 'User'}
                </p>
              </div>
            </div>
            <Link to="/create-campaign">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Total Campaigns</span>
              </div>
              <p className="text-2xl font-bold mt-2">{campaigns.length}</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Total Candidates</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {campaigns.reduce((sum, campaign) => sum + campaign.candidates_count, 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Active Campaigns</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {campaigns.filter(c => c.status === 'running').length}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Completed</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {campaigns.filter(c => c.status === 'completed').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Manage your interview screening campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading campaigns...</span>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first campaign to start screening candidates
                </p>
                <Link to="/create-campaign">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-foreground">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {campaign.job_description || 'No description provided'}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {campaign.candidates_count} candidates
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(campaign.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link to={`/campaigns/${campaign.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      {campaign.status === 'created' && (
                        <Link to={`/campaigns/${campaign.id}/start`}>
                          <Button size="sm">
                            Start Campaign
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;