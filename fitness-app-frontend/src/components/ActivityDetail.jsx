import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getActivityDetail } from '../services/api';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';

const ActivityDetail = () => {
  const { id } = useParams();
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        // The AI service returns the full Recommendation object directly
        setRecommendation(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchActivityDetail();
  }, [id]);

  if (!recommendation) {
    return <Typography>Loading...</Typography>
  }
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Activity Details</Typography>
                    <Typography>Type: {recommendation.activityType}</Typography>
                    <Typography>Activity ID: {recommendation.activityId}</Typography>
                    <Typography>Date: {recommendation.createdAt ? new Date(recommendation.createdAt).toLocaleString() : 'N/A'}</Typography>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>AI Recommendation</Typography>
                    <Typography variant="h6">Analysis</Typography>
                    <Typography paragraph>{recommendation.recommendation}</Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6">Improvements</Typography>
                    {recommendation?.improvements?.map((improvement, index) => (
                        <Typography key={index} paragraph>• {improvement}</Typography>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6">Suggestions</Typography>
                    {recommendation?.suggestions?.map((suggestion, index) => (
                        <Typography key={index} paragraph>• {suggestion}</Typography>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6">Safety Guidelines</Typography>
                    {recommendation?.safety?.map((safety, index) => (
                        <Typography key={index} paragraph>• {safety}</Typography>
                    ))}
                </CardContent>
            </Card>
        </Box>
  )
}

export default ActivityDetail