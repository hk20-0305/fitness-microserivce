import { useState } from 'react';
import {
  Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Snackbar, Alert, CircularProgress, FormHelperText
} from '@mui/material';
import { Plus } from 'lucide-react';
import { addActivity } from '../../services/api';

const ACTIVITY_TYPES = [
  { value: 'RUNNING', label: 'Running' },
  { value: 'WALKING', label: 'Walking' },
  { value: 'CYCLING', label: 'Cycling' },
  { value: 'SWIMMING', label: 'Swimming' },
  { value: 'WEIGHT_TRAINING', label: 'Weight Training' },
  { value: 'YOGA', label: 'Yoga' },
  { value: 'HIIT', label: 'HIIT' },
  { value: 'CARDIO', label: 'Cardio' },
  { value: 'STRETCHING', label: 'Stretching' },
  { value: 'OTHER', label: 'Other' },
];

const getTypeEmoji = (type) => {
  const map = {
    RUNNING: '🏃',
    WALKING: '🚶',
    CYCLING: '🚴',
    SWIMMING: '🏊',
    WEIGHT_TRAINING: '🏋️',
    YOGA: '🧘',
    HIIT: '⚡',
    CARDIO: '❤️',
    STRETCHING: '🤸',
    OTHER: '🏅',
  };
  return map[type] || '🏅';
};

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: 'RUNNING',
    duration: '',
    caloriesBurned: '',
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!activity.type) {
      newErrors.type = 'Please select an activity type';
    }
    if (!activity.duration || Number(activity.duration) <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    if (!activity.caloriesBurned || Number(activity.caloriesBurned) <= 0) {
      newErrors.caloriesBurned = 'Calories must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await addActivity({
        type: activity.type,
        duration: Number(activity.duration),
        caloriesBurned: Number(activity.caloriesBurned),
      });
      setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '' });
      setSnackbar({ open: true, message: 'Activity tracked successfully!', severity: 'success' });
      onActivityAdded?.();
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Failed to add activity. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: 'rgba(124, 255, 79, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={20} color="#7CFF4F" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Track New Activity
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <FormControl fullWidth error={!!errors.type}>
          <InputLabel id="activity-type-label">Activity</InputLabel>
          <Select
            labelId="activity-type-label"
            value={activity.type}
            label="Activity"
            onChange={(e) => setActivity({ ...activity, type: e.target.value })}
            startAdornment={<span style={{ marginRight: 8 }}>{getTypeEmoji(activity.type)}</span>}
          >
            {ACTIVITY_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
          {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
        </FormControl>

        <TextField
          fullWidth
          label="Duration"
          type="number"
          error={!!errors.duration}
          helperText={errors.duration}
          InputProps={{ endAdornment: <span style={{ color: '#9AA4B2' }}>min</span> }}
          value={activity.duration}
          onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Calories Burned"
          type="number"
          error={!!errors.caloriesBurned}
          helperText={errors.caloriesBurned}
          InputProps={{ endAdornment: <span style={{ color: '#9AA4B2' }}>kcal</span> }}
          value={activity.caloriesBurned}
          onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Plus size={20} />}
          sx={{ mt: 1, py: 1.5 }}
        >
          {loading ? 'Adding...' : 'Add Activity'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActivityForm;