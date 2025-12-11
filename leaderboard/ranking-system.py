#!/usr/bin/env python3
"""
🏆 Bridge Rescue Archive - Leaderboard & Ranking System

Tracks contributor achievements, points, and badges.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional


# Constants
CONTRIBUTION_CATEGORIES = ['code', 'documentation', 'research', 'design', 'community']
BADGE_EMOJIS = {
    'first-responder': '🎖️',
    'bridge-builder': '🌉',
    'memory-keeper': '💾',
    'researcher': '🔬',
    'educator': '🎓',
    'designer': '🎨'
}


class Contributor:
    """Represents a contributor with their achievements."""
    
    def __init__(self, username: str):
        self.username = username
        self.points = 0
        self.missions_completed = []
        self.badges = []
        self.contributions = {category: 0 for category in CONTRIBUTION_CATEGORIES}
        self.joined_date = datetime.now().isoformat()
        self.last_activity = datetime.now().isoformat()
    
    def add_points(self, points: int, category: str):
        """Add points for a contribution."""
        self.points += points
        if category in self.contributions:
            self.contributions[category] += 1
        self.last_activity = datetime.now().isoformat()
    
    def complete_mission(self, mission_id: str, points: int):
        """Mark a mission as completed."""
        if mission_id not in self.missions_completed:
            self.missions_completed.append(mission_id)
            self.add_points(points, 'code')
    
    def award_badge(self, badge: str):
        """Award a badge to the contributor."""
        if badge not in self.badges:
            self.badges.append(badge)
            self.last_activity = datetime.now().isoformat()
    
    def to_dict(self) -> dict:
        """Convert to dictionary for serialization."""
        return {
            'username': self.username,
            'points': self.points,
            'missions_completed': self.missions_completed,
            'badges': self.badges,
            'contributions': self.contributions,
            'joined_date': self.joined_date,
            'last_activity': self.last_activity
        }
    
    @classmethod
    def from_dict(cls, data: dict):
        """Create from dictionary."""
        contributor = cls(data['username'])
        contributor.points = data.get('points', 0)
        contributor.missions_completed = data.get('missions_completed', [])
        contributor.badges = data.get('badges', [])
        contributor.contributions = data.get('contributions', 
            {category: 0 for category in CONTRIBUTION_CATEGORIES})
        contributor.joined_date = data.get('joined_date', datetime.now().isoformat())
        contributor.last_activity = data.get('last_activity', datetime.now().isoformat())
        return contributor


class Leaderboard:
    """Manages the contributor leaderboard."""
    
    def __init__(self, data_file: str = 'leaderboard/data.json'):
        self.data_file = Path(data_file)
        self.contributors: Dict[str, Contributor] = {}
        self.load()
    
    def load(self):
        """Load leaderboard data from file."""
        if self.data_file.exists():
            try:
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    for username, contrib_data in data.get('contributors', {}).items():
                        self.contributors[username] = Contributor.from_dict(contrib_data)
            except Exception as e:
                print(f"Error loading leaderboard: {e}")
    
    def save(self):
        """Save leaderboard data to file."""
        self.data_file.parent.mkdir(parents=True, exist_ok=True)
        data = {
            'last_updated': datetime.now().isoformat(),
            'contributors': {
                username: contrib.to_dict()
                for username, contrib in self.contributors.items()
            }
        }
        with open(self.data_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def get_or_create_contributor(self, username: str) -> Contributor:
        """Get existing contributor or create new one."""
        if username not in self.contributors:
            self.contributors[username] = Contributor(username)
        return self.contributors[username]
    
    def add_contribution(self, username: str, points: int, category: str):
        """Add a contribution and update points."""
        contributor = self.get_or_create_contributor(username)
        contributor.add_points(points, category)
        self._check_and_award_badges(contributor)
        self.save()
    
    def complete_mission(self, username: str, mission_id: str, points: int):
        """Mark mission as completed for a contributor."""
        contributor = self.get_or_create_contributor(username)
        contributor.complete_mission(mission_id, points)
        self._check_and_award_badges(contributor)
        self.save()
    
    def _check_and_award_badges(self, contributor: Contributor):
        """Check and award badges based on achievements."""
        # First Responder: First contribution
        if contributor.points > 0 and 'first-responder' not in contributor.badges:
            contributor.award_badge('first-responder')
        
        # Bridge Builder: 5+ missions
        if len(contributor.missions_completed) >= 5:
            contributor.award_badge('bridge-builder')
        
        # Memory Keeper: 3+ documentation contributions
        if contributor.contributions['documentation'] >= 3:
            contributor.award_badge('memory-keeper')
        
        # Researcher: 2+ research contributions
        if contributor.contributions['research'] >= 2:
            contributor.award_badge('researcher')
        
        # Educator: Created educational content
        if contributor.contributions.get('education', 0) >= 1:
            contributor.award_badge('educator')
        
        # Designer: Design contributions
        if contributor.contributions['design'] >= 1:
            contributor.award_badge('designer')
    
    def get_top_contributors(self, limit: int = 10) -> List[Contributor]:
        """Get top contributors by points."""
        sorted_contributors = sorted(
            self.contributors.values(),
            key=lambda c: c.points,
            reverse=True
        )
        return sorted_contributors[:limit]
    
    def get_recent_contributors(self, limit: int = 5) -> List[Contributor]:
        """Get most recently active contributors."""
        sorted_contributors = sorted(
            self.contributors.values(),
            key=lambda c: c.last_activity,
            reverse=True
        )
        return sorted_contributors[:limit]
    
    def generate_markdown_table(self) -> str:
        """Generate markdown table of leaderboard."""
        top_contributors = self.get_top_contributors()
        
        if not top_contributors:
            return "No contributors yet. Be the first!"
        
        lines = [
            "# 🏆 Leaderboard",
            "",
            "| Rank | Contributor | Points | Missions | Badges |",
            "|------|-------------|--------|----------|--------|"
        ]
        
        for i, contributor in enumerate(top_contributors, 1):
            badge_icons = ' '.join([
                self._badge_to_emoji(badge) for badge in contributor.badges
            ])
            lines.append(
                f"| {i} | @{contributor.username} | {contributor.points} | "
                f"{len(contributor.missions_completed)} | {badge_icons or '-'} |"
            )
        
        return '\n'.join(lines)
    
    def _badge_to_emoji(self, badge: str) -> str:
        """Convert badge name to emoji."""
        return BADGE_EMOJIS.get(badge, '⭐')


def main():
    """Main entry point for leaderboard management."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Manage Bridge Rescue Archive Leaderboard')
    parser.add_argument('action', choices=['show', 'add', 'mission', 'export'],
                       help='Action to perform')
    parser.add_argument('--username', help='Contributor username')
    parser.add_argument('--points', type=int, help='Points to add')
    parser.add_argument('--category', help='Contribution category')
    parser.add_argument('--mission', help='Mission ID')
    parser.add_argument('--output', help='Output file for export')
    
    args = parser.parse_args()
    
    leaderboard = Leaderboard()
    
    if args.action == 'show':
        print(leaderboard.generate_markdown_table())
    
    elif args.action == 'add':
        if not args.username or not args.points or not args.category:
            print("Error: --username, --points, and --category required")
            return
        leaderboard.add_contribution(args.username, args.points, args.category)
        print(f"Added {args.points} points for @{args.username}")
    
    elif args.action == 'mission':
        if not args.username or not args.mission or not args.points:
            print("Error: --username, --mission, and --points required")
            return
        leaderboard.complete_mission(args.username, args.mission, args.points)
        print(f"Mission {args.mission} completed by @{args.username}")
    
    elif args.action == 'export':
        output = args.output or 'leaderboard/README.md'
        with open(output, 'w') as f:
            f.write(leaderboard.generate_markdown_table())
        print(f"Leaderboard exported to {output}")


if __name__ == '__main__':
    main()
