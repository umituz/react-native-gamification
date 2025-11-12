# @umituz/react-native-gamification

Comprehensive gamification system for React Native apps with achievements, points, levels, streaks, leaderboards, rewards, and progress tracking.

## Features

- 🏆 **Achievements** - Track and unlock user achievements
- 💰 **Points System** - Award and manage user points
- 📈 **Levels** - Experience-based leveling system
- 🔥 **Streaks** - Track consecutive activities
- 🏅 **Leaderboards** - Competitive rankings
- 🎁 **Rewards** - Unlockable rewards system
- 📊 **Progress Tracking** - Monitor user progress across metrics

## Installation

```bash
npm install @umituz/react-native-gamification
```

## Peer Dependencies

- `react` >= 18.2.0
- `react-native` >= 0.74.0
- `@umituz/react-native-storage` (latest)
- `zustand` >= 4.0.0

## Quick Start

```typescript
import { useGamification, useGamificationInitializer } from '@umituz/react-native-gamification';

function App() {
  const userId = 'user-123';
  useGamificationInitializer(userId);
  
  const { 
    achievements, 
    pointBalance, 
    level,
    addPoints,
    addExperience 
  } = useGamification();

  // Add points when user completes an action
  const handleActionComplete = async () => {
    await addPoints(10, 'action_completed', 'action-id', 'actions', 'Completed action');
  };

  return (
    // Your app UI
  );
}
```

## Usage

### Initialization

```typescript
import { useGamification, useGamificationInitializer } from '@umituz/react-native-gamification';

function MyComponent() {
  const userId = 'user-123';
  
  // Initialize gamification system
  useGamificationInitializer(userId);
  
  const gamification = useGamification();
  
  // Check if initialized
  if (!gamification.isInitialized) {
    return <Loading />;
  }
  
  return <YourContent />;
}
```

### Achievements

```typescript
import { useAchievements } from '@umituz/react-native-gamification';

function AchievementsScreen() {
  const { 
    achievements, 
    unlockAchievement,
    updateAchievementProgress 
  } = useAchievements();

  // Update progress
  await updateAchievementProgress('achievement-id', 50);

  // Unlock achievement
  await unlockAchievement('achievement-id');

  return (
    <View>
      {achievements.map(achievement => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </View>
  );
}
```

### Points

```typescript
import { usePoints } from '@umituz/react-native-gamification';

function PointsDisplay() {
  const { 
    pointBalance, 
    addPoints, 
    deductPoints 
  } = usePoints();

  // Add points
  await addPoints(100, 'purchase', 'purchase-id', 'purchases', 'Made a purchase');

  // Deduct points
  await deductPoints(50, 'reward_claim', 'reward-id', 'Claimed reward');

  return (
    <Text>Total Points: {pointBalance?.total || 0}</Text>
  );
}
```

### Levels

```typescript
import { useLevel } from '@umituz/react-native-gamification';

function LevelDisplay() {
  const { 
    level, 
    addExperience 
  } = useLevel();

  // Add experience
  await addExperience(50, 'action_completed');

  return (
    <View>
      <Text>Level: {level?.currentLevel || 1}</Text>
      <Text>XP: {level?.currentExperience || 0} / {level?.experienceToNextLevel || 100}</Text>
      <ProgressBar progress={level?.levelProgress || 0} />
    </View>
  );
}
```

### Streaks

```typescript
import { useStreaks } from '@umituz/react-native-gamification';

function StreakDisplay() {
  const { 
    streaks, 
    updateStreakActivity 
  } = useStreaks();

  // Update streak
  await updateStreakActivity('daily_login', new Date().toISOString());

  const loginStreak = streaks.find(s => s.type === 'daily_login');

  return (
    <Text>Login Streak: {loginStreak?.currentStreak || 0} days</Text>
  );
}
```

### Rewards

```typescript
import { useRewards } from '@umituz/react-native-gamification';

function RewardsScreen() {
  const { 
    rewards, 
    claimReward,
    getAvailableRewards 
  } = useRewards();

  const availableRewards = getAvailableRewards();

  const handleClaim = async (rewardId: string) => {
    const claim = await claimReward(rewardId);
    if (claim) {
      console.log('Reward claimed!');
    }
  };

  return (
    <View>
      {availableRewards.map(reward => (
        <RewardCard 
          key={reward.id} 
          reward={reward}
          onClaim={() => handleClaim(reward.id)}
        />
      ))}
    </View>
  );
}
```

### Progress Tracking

```typescript
import { useProgress } from '@umituz/react-native-gamification';

function ProgressTracker() {
  const { 
    progress, 
    updateProgress 
  } = useProgress();

  // Update progress
  await updateProgress({
    userId: 'user-123',
    metric: 'goals_completed',
    increment: 1,
    category: 'goals',
    period: 'all-time'
  });

  const goalsProgress = progress.find(p => p.metric === 'goals_completed');

  return (
    <View>
      <Text>Goals Completed: {goalsProgress?.currentValue || 0}</Text>
      <ProgressBar progress={goalsProgress?.progress || 0} />
    </View>
  );
}
```

## Custom Repository

You can provide a custom repository implementation for app-specific storage:

```typescript
import { useGamificationRepository } from '@umituz/react-native-gamification';
import { MyCustomRepository } from './MyCustomRepository';

function App() {
  const customRepository = new MyCustomRepository();
  
  useGamificationRepository(customRepository);
  
  // Rest of your app
}
```

## Architecture

This package follows Domain-Driven Design (DDD) principles:

- **Domain Layer** - Entities and repository interfaces
- **Infrastructure Layer** - Repository implementations and stores
- **Presentation Layer** - React hooks for easy integration

## License

MIT

## Author

Ümit UZ <umit@umituz.com>


