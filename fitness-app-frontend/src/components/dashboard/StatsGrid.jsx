import { Grid2 } from '@mui/material';
import StatCard from './StatCard';

const StatsGrid = ({ activities }) => {
  const totalActivities = activities?.length || 0;
  
  const totalCalories = activities?.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0) || 0;
  
  const totalDuration = activities?.reduce((sum, a) => sum + (Number(a.duration) || 0), 0) || 0;

  const stats = [
    {
      title: 'Total Activities',
      value: totalActivities.toString(),
      subtitle: 'All time',
      type: 'activities',
    },
    {
      title: 'Total Calories',
      value: `${totalCalories.toLocaleString()} kcal`,
      subtitle: 'Burned',
      type: 'calories',
    },
    {
      title: 'Active Minutes',
      value: `${totalDuration} min`,
      subtitle: 'Total duration',
      type: 'duration',
    },
  ];

  return (
    <Grid2 container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat) => (
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={stat.title}>
          <StatCard {...stat} />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default StatsGrid;