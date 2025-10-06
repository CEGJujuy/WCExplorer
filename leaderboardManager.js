export class LeaderboardManager {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  async submitScore(playerName, score, timeRemaining) {
    try {
      const { error } = await this.supabase
        .from('leaderboard')
        .insert([
          {
            player_name: playerName,
            score: score,
            time_remaining: timeRemaining
          }
        ]);

      if (error) {
        console.error('Error submitting score:', error);
        alert('Failed to submit score. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting score:', err);
      alert('Failed to submit score. Please try again.');
    }
  }

  async displayLeaderboard(container, currentPlayerName = null) {
    try {
      const { data, error } = await this.supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .order('time_remaining', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        container.innerHTML = '<p>Failed to load leaderboard.</p>';
        return;
      }

      if (!data || data.length === 0) {
        container.innerHTML = '<p>No scores yet. Be the first to play!</p>';
        return;
      }

      container.innerHTML = data
        .map((entry, index) => {
          const isCurrentPlayer = currentPlayerName &&
            entry.player_name === currentPlayerName &&
            index < 10;

          const rank = index + 1;
          const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;

          return `
            <div class="leaderboard-item ${isCurrentPlayer ? 'current-player' : ''}">
              <div class="leaderboard-rank">${medal}</div>
              <div class="leaderboard-name">${this.escapeHtml(entry.player_name)}</div>
              <div class="leaderboard-score">${entry.score} pts</div>
              <div class="leaderboard-time">${entry.time_remaining}s</div>
            </div>
          `;
        })
        .join('');
    } catch (err) {
      console.error('Error displaying leaderboard:', err);
      container.innerHTML = '<p>Failed to load leaderboard.</p>';
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
