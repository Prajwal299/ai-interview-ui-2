import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Loader2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UploadedCSV {
  id: number;
  filename: string;
  user_id: number;
  uploaded_at: string;
  campaign_id?: number; // Optional, as it may be null
}

const StartCampaign = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [selectedCsvId, setSelectedCsvId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [uploadedCSVs, setUploadedCSVs] = useState<UploadedCSV[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCSVs = async () => {
      try {
        console.log('Fetching uploaded CSVs');
        const response = await apiClient.getUploadedCSVs();
        console.log('Uploaded CSVs response:', response.data);
        setUploadedCSVs(response.data.csvs || []);
        if (response.data.csvs.length === 0) {
          toast({
            title: 'No CSVs found',
            description: 'No previously uploaded CSVs available. Please upload a new CSV.',
            variant: 'default',
          });
        }
      } catch (error: any) {
        console.error('Failed to fetch CSVs:', error.response?.data || error);
        toast({
          title: 'Failed to load CSVs',
          description: error.response?.data?.message || 'Could not load uploaded CSVs.',
          variant: 'destructive',
        });
      }
    };
    if (user) fetchCSVs();
  }, [user, toast]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0];
      if (uploadedFile && uploadedFile.name.endsWith('.csv')) {
        setFile(uploadedFile);
        setSelectedCsvId(null); // Clear selected CSV when a new file is dropped
        console.log('File selected:', uploadedFile.name);
      } else {
        toast({
          title: 'Invalid file',
          description: 'Please upload a CSV file.',
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    disabled: !!selectedCsvId, // Disable drag-and-drop when a CSV is selected
  });

  const handleUpload = async () => {
    if (!campaignId || !user) {
      toast({
        title: 'Upload failed',
        description: !user ? 'Please log in to upload candidates.' : 'Invalid campaign ID.',
        variant: 'destructive',
      });
      return;
    }

    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please upload a CSV file.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      console.log('Uploading new CSV for campaign:', campaignId);
      const response = await apiClient.uploadCandidates(parseInt(campaignId), file);
      console.log('Upload response:', response.data);
      toast({
        title: 'Candidates uploaded',
        description: response.data.message,
      });
      setFile(null);
      const csvResponse = await apiClient.getUploadedCSVs();
      setUploadedCSVs(csvResponse.data.csvs || []);
    } catch (error: any) {
      console.error('Upload error:', error.response?.data || error);
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || 'Failed to upload candidates.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartCampaign = async () => {
    if (!campaignId || !user) {
      toast({
        title: 'Start campaign failed',
        description: !user ? 'Please log in to start the campaign.' : 'Invalid campaign ID.',
        variant: 'destructive',
      });
      return;
    }

    if (!file && !selectedCsvId) {
      toast({
        title: 'No candidates selected',
        description: 'Please upload a new CSV or select a previously uploaded CSV.',
        variant: 'destructive',
      });
      return;
    }

    setIsStarting(true);
    try {
      console.log('Starting campaign:', campaignId, 'with CSV ID:', selectedCsvId || 'new upload');
      const response = await apiClient.startCampaign(parseInt(campaignId), selectedCsvId ? parseInt(selectedCsvId) : undefined);
      console.log('Start campaign response:', response.data);
      toast({
        title: 'Campaign started',
        description: 'The campaign is now running and candidates will be contacted.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Start campaign error:', error.response?.data || error);
      toast({
        title: 'Start campaign failed',
        description: error.response?.data?.message || 'Failed to start the campaign.',
        variant: 'destructive',
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedCsvId(null);
    setFile(null);
    console.log('Cleared CSV selection');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Start Campaign</h1>
          <p className="text-muted-foreground">Upload candidates or select a previously uploaded CSV to start the interview process</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Manage Candidates
          </CardTitle>
          <CardDescription>
            Select a previously uploaded CSV or upload a new one with candidate details (name, phone_number, email)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="csvSelect">Previously Uploaded CSVs</Label>
              <div className="flex space-x-2">
                <Select
                  onValueChange={(value) => {
                    const newCsvId = value === 'none' ? null : value;
                    setSelectedCsvId(newCsvId);
                    setFile(null); // Clear file when selecting a CSV
                    console.log('Selected CSV ID:', newCsvId);
                  }}
                  disabled={isUploading || isStarting}
                  value={selectedCsvId || undefined}
                >
                  <SelectTrigger id="csvSelect" className="w-full">
                    <SelectValue placeholder="Select a CSV file" />
                  </SelectTrigger>
                  <SelectContent>
                    {uploadedCSVs.length === 0 ? (
                      <SelectItem value="none" disabled>No CSVs available</SelectItem>
                    ) : (
                      uploadedCSVs.map((csv) => (
                        <SelectItem key={csv.id} value={csv.id.toString()}>
                          {csv.filename} ({new Date(csv.uploaded_at).toLocaleDateString()})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {selectedCsvId && (
                  <Button variant="outline" onClick={handleClearSelection} disabled={isUploading || isStarting}>
                    Clear Selection
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload New CSV</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragActive && !selectedCsvId ? 'border-primary bg-primary/10' : 'border-muted'
                } ${selectedCsvId ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={selectedCsvId ? { pointerEvents: 'none' } : {}}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{file.name}</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {selectedCsvId
                        ? 'Clear the selected CSV to upload a new one'
                        : 'Drag and drop a CSV file here, or click to select a file'}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                CSV should have columns: <code>name</code>, <code>phone_number</code>, and optionally <code>email</code>.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setSelectedCsvId(null);
                  navigate(-1);
                }}
                disabled={isUploading || isStarting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading || isStarting || !!selectedCsvId}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Candidates'
                )}
              </Button>
            </div>

            <div className="border-t pt-6">
              <CardTitle className="flex items-center text-lg mb-2">
                <FileText className="w-5 h-5 mr-2" />
                Start Campaign
              </CardTitle>
              <CardDescription>
                Begin the interview process for all uploaded candidates
              </CardDescription>
              <Button
                onClick={handleStartCampaign}
                disabled={(!file && !selectedCsvId) || isUploading || isStarting}
                className="mt-4 w-full"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Starting Campaign...
                  </>
                ) : (
                  'Start Campaign'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartCampaign;