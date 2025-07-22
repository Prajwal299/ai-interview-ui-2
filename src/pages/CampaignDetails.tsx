// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { apiClient } from '@/lib/api';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/hooks/use-toast';
// import { ArrowLeft, Users, Loader2 } from 'lucide-react';

// interface Interview {
//   id: number;
//   question_id: number;
//   question_text: string;
//   audio_recording_path: string;
//   transcript: string;
//   ai_score_communication: number;
//   ai_score_technical: number;
//   ai_recommendation: string;
//   created_at: string;
// }

// interface CandidateResult {
//   candidate: {
//     id: number;
//     name: string;
//     phone_number: string;
//   };
//   interviews: Interview[];
//   avg_communication_score: number;
//   avg_technical_score: number;
//   shortlisted: boolean;
// }

// interface Campaign {
//   id: number;
//   name: string;
//   job_description: string;
//   status: string;
//   created_at: string;
// }

// const CampaignDetails = () => {
//   const { campaignId } = useParams<{ campaignId: string }>();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [campaign, setCampaign] = useState<Campaign | null>(null);
//   const [results, setResults] = useState<CandidateResult[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchCampaignResults = async () => {
//     try {
//       setIsLoading(true);
//       const response = await apiClient.getCampaignResults(parseInt(campaignId || '0'));
//       setCampaign(response.data.campaign);
//       setResults(response.data.results || []);
//     } catch (error: any) {
//       console.error('Failed to fetch campaign results:', error.response?.data || error);
//       toast({
//         title: 'Error fetching campaign results',
//         description: error.response?.data?.message || 'Failed to load results. Please try again.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCampaignResults();
//     // Poll for updates if campaign is running
//     let intervalId: NodeJS.Timeout | null = null;
//     if (campaign?.status === 'running') {
//       intervalId = setInterval(fetchCampaignResults, 30000); // Poll every 30 seconds
//     }
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [campaignId, campaign?.status]);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'running':
//         return 'bg-green-500 text-white';
//       case 'completed':
//         return 'bg-gray-500 text-white';
//       default:
//         return 'bg-blue-500 text-white';
//     }
//   };

//   const getRecommendationColor = (recommendation: string) => {
//     switch (recommendation) {
//       case 'Select':
//         return 'bg-green-500 text-white';
//       case 'Consider':
//         return 'bg-yellow-500 text-white';
//       case 'Reject':
//         return 'bg-red-500 text-white';
//       default:
//         return 'bg-gray-500 text-white';
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex items-center space-x-4 mb-6">
//         <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
//           <ArrowLeft className="w-4 h-4" />
//         </Button>
//         <div>
//           <h1 className="text-2xl font-bold">Campaign Details</h1>
//           <p className="text-muted-foreground">Interview results for {campaign?.name || `Campaign ${campaignId}`}</p>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="flex items-center justify-center py-8">
//           <Loader2 className="w-6 h-6 animate-spin text-primary" />
//           <span className="ml-2 text-muted-foreground">Loading results...</span>
//         </div>
//       ) : !campaign ? (
//         <Card>
//           <CardContent className="text-center py-8">
//             <h3 className="text-lg font-medium mb-2">Campaign not found</h3>
//             <p className="text-muted-foreground mb-4">The requested campaign does not exist.</p>
//             <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <>
//           <Card className="mb-8">
//             <CardHeader>
//               <CardTitle>{campaign.name}</CardTitle>
//               <CardDescription>
//                 Status: <Badge className={getStatusColor(campaign.status)}>
//                   {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
//                 </Badge>
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-muted-foreground mb-2">
//                 Created: {new Date(campaign.created_at).toLocaleDateString('en-US', {
//                   year: 'numeric',
//                   month: 'short',
//                   day: 'numeric',
//                 })}
//               </p>
//               <p className="text-sm text-muted-foreground">{campaign.job_description}</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <Users className="w-5 h-5 mr-2" />
//                 Candidate Results
//               </CardTitle>
//               <CardDescription>Interview performance and recommendations</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {results.length === 0 ? (
//                 <div className="text-center py-8">
//                   <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="text-lg font-medium mb-2">No results yet</h3>
//                   <p className="text-muted-foreground mb-4">
//                     Candidates have not completed interviews for this campaign.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   {results.map((result) => (
//                     <div key={result.candidate.id} className="border rounded-lg p-4">
//                       <div className="flex items-center justify-between mb-4">
//                         <div>
//                           <h3 className="font-medium text-foreground">{result.candidate.name}</h3>
//                           <p className="text-sm text-muted-foreground">{result.candidate.phone_number}</p>
//                         </div>
//                         <Badge className={result.shortlisted ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
//                           {result.shortlisted ? 'Shortlisted' : 'Not Shortlisted'}
//                         </Badge>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4 mb-4">
//                         <div>
//                           <p className="text-sm font-medium">Avg. Communication Score</p>
//                           <p className="text-lg font-bold">{result.avg_communication_score.toFixed(1)}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium">Avg. Technical Score</p>
//                           <p className="text-lg font-bold">{result.avg_technical_score.toFixed(1)}</p>
//                         </div>
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium mb-2">Interview Responses</h4>
//                         {result.interviews.map((interview) => (
//                           <div key={interview.id} className="border-t pt-2 mt-2">
//                             <p className="text-sm font-medium">Question: {interview.question_text}</p>
//                             <p className="text-sm text-muted-foreground">Transcript: {interview.transcript}</p>
//                             <div className="flex items-center space-x-4 mt-1">
//                               <p className="text-sm">
//                                 Communication: {interview.ai_score_communication}
//                               </p>
//                               <p className="text-sm">Technical: {interview.ai_score_technical}</p>
//                               <Badge className={getRecommendationColor(interview.ai_recommendation)}>
//                                 {interview.ai_recommendation}
//                               </Badge>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

// export default CampaignDetails;



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Loader2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Interview {
  id: number;
  question_id: number;
  question_text: string;
  audio_recording_path: string;
  transcript: string;
  ai_score_communication: number;
  ai_score_technical: number;
  ai_recommendation: string;
  created_at: string;
}

interface CandidateResult {
  candidate: {
    id: number;
    name: string;
    phone_number: string;
  };
  interviews: Interview[];
  avg_communication_score: number;
  avg_technical_score: number;
  shortlisted: boolean;
}

interface Campaign {
  id: number;
  name: string;
  job_description: string;
  status: string;
  created_at: string;
}

interface Question {
  id: number;
  text: string;
  campaign_id: number;
  question_order: number;
  created_at: string;
}

const CampaignDetails = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCampaignData = async () => {
    try {
      setIsLoading(true);
      const [resultsResponse, questionsResponse] = await Promise.all([
        apiClient.getCampaignResults(parseInt(campaignId || '0')),
        apiClient.getCampaignQuestions(parseInt(campaignId || '0')),
      ]);

      setCampaign(resultsResponse.data.campaign);
      setResults(resultsResponse.data.results || []);
      setQuestions(questionsResponse.data.questions || []);
    } catch (error: any) {
      console.error('Failed to fetch campaign data:', error.response?.data || error);
      toast({
        title: 'Error fetching campaign data',
        description: error.response?.data?.message || 'Failed to load data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
    let intervalId: NodeJS.Timeout | null = null;
    if (campaign?.status === 'running') {
      intervalId = setInterval(fetchCampaignData, 30000); // Poll every 30 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [campaignId, campaign?.status]);

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

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Select':
        return 'bg-green-500 text-white';
      case 'Consider':
        return 'bg-yellow-500 text-white';
      case 'Reject':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const calculateTotalScore = (interviews: Interview[]) => {
    return interviews.reduce((total, interview) => {
      return total + (interview.ai_score_communication || 0) + (interview.ai_score_technical || 0);
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Campaign Details</h1>
          <p className="text-muted-foreground">
            Interview results for {campaign?.name || `Campaign ${campaignId}`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading results...</span>
        </div>
      ) : !campaign ? (
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Campaign not found</h3>
            <p className="text-muted-foreground mb-4">The requested campaign does not exist.</p>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{campaign.name}</CardTitle>
              <CardDescription>
                Status:{' '}
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Created:{' '}
                {new Date(campaign.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-muted-foreground">{campaign.job_description}</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Interview Questions</CardTitle>
              <CardDescription>Questions asked during the campaign interviews</CardDescription>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <p className="text-muted-foreground">No questions available for this campaign.</p>
              ) : (
                <ol className="list-decimal pl-5 space-y-2">
                  {questions.map((question) => (
                    <li key={question.id} className="text-foreground">
                      {question.text}
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Candidate Results
              </CardTitle>
              <CardDescription>Interview performance, answers, and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Candidates have not completed interviews for this campaign.
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-2">
                  {results.map((result) => (
                    <AccordionItem
                      key={result.candidate.id}
                      value={`candidate-${result.candidate.id}`}
                      className="border rounded-lg"
                    >
                      <AccordionTrigger className="px-4 py-2 hover:no-underline">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <h3 className="font-medium text-foreground">{result.candidate.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {result.candidate.phone_number}
                            </p>
                          </div>
                          <Badge
                            className={
                              result.shortlisted
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            }
                          >
                            {result.shortlisted ? 'Shortlisted' : 'Not Shortlisted'}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2 pb-4">
                        <div className="mb-4">
                          <p className="text-sm font-medium">Total Score</p>
                          <p className="text-lg font-bold">{calculateTotalScore(result.interviews)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium">Avg. Communication Score</p>
                            <p className="text-lg font-bold">
                              {result.avg_communication_score.toFixed(1)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Avg. Technical Score</p>
                            <p className="text-lg font-bold">
                              {result.avg_technical_score.toFixed(1)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Interview Responses</h4>
                          {result.interviews.map((interview, index) => {
                            const totalQuestionScore =
                              (interview.ai_score_communication || 0) +
                              (interview.ai_score_technical || 0);
                            return (
                              <div key={interview.id} className="border-t pt-2 mt-2">
                                <p className="text-sm font-medium">
                                  Question {index + 1}: {interview.question_text}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Answer: {interview.transcript || 'No answer provided'}
                                </p>
                                <div className="flex items-center space-x-4 mt-1 text-sm">
                                  <p>Communication: {interview.ai_score_communication || 0}</p>
                                  <p>Technical: {interview.ai_score_technical || 0}</p>
                                  <p>Total: {totalQuestionScore} points</p>
                                  <Badge
                                    className={getRecommendationColor(interview.ai_recommendation)}
                                  >
                                    {interview.ai_recommendation || 'N/A'}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                  
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CampaignDetails;
